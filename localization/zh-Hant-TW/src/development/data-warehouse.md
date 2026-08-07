# Data Warehouse Abstraction Layer

## 概覽

Data warehouse abstraction 讓 analytics writes 不與特定 backend 綁定。Coop 內建 **ClickHouse** 與 **PostgreSQL** adapters，也可實作 `IDataWarehouse` interface 支援其他 backends。只需變更一項 environment variable，即可指定 warehouse settings。

## 快速開始

```typescript
import { inject, type Dependencies } from '../iocContainer/index.js';

class MyService {
  constructor(private readonly dataWarehouse: Dependencies['DataWarehouse']) {}

  async getUserData(userId: string, tracer: SafeTracer) {
    return this.dataWarehouse.query(
      'SELECT * FROM users WHERE id = :1',
      tracer,
      [userId],
    );
  }
}

export default inject(['DataWarehouse'], MyService);
```

## 設定

使用 `WAREHOUSE_ADAPTER` 與選用的 `ANALYTICS_ADAPTER` 選擇 adapters。Legacy deployments 可繼續使用 `DATA_WAREHOUSE_PROVIDER`，目前仍會作為 fallback 接受。

### PostgreSQL

```sh
WAREHOUSE_ADAPTER=postgresql
ANALYTICS_ADAPTER=postgresql
# Legacy fallback:
DATA_WAREHOUSE_PROVIDER=postgresql
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=analytics
DATABASE_USER=postgres
DATABASE_PASSWORD=password
```

### ClickHouse

```sh
WAREHOUSE_ADAPTER=clickhouse
# Optional: override analytics adapter
# ANALYTICS_ADAPTER=clickhouse
# Legacy fallback:
DATA_WAREHOUSE_PROVIDER=clickhouse
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=password
CLICKHOUSE_DATABASE=analytics
CLICKHOUSE_PROTOCOL=http

# Disable analytics writes (while keeping the warehouse)
# ANALYTICS_ADAPTER=noop
```

## 運作方式

### 三個 interfaces

**1. `IDataWarehouse`，raw SQL queries**

```typescript
await dataWarehouse.query('SELECT * FROM users', tracer);
await dataWarehouse.transaction(async (query) => {
  await query('UPDATE users SET score = :1', [100]);
  await query('INSERT INTO audit_log VALUES (:1)', [userId]);
});
```

**2. `IDataWarehouseDialect`，type-safe Kysely queries**

```typescript
const kysely = dialect.getKyselyInstance();
await kysely.selectFrom('users').selectAll().execute();
```

**3. `IDataWarehouseAnalytics`，bulk writes 與 logging**

```typescript
await analytics.bulkWrite('RULE_EXECUTIONS', [
  { ds: '2024-01-01', ts: Date.now(), org_id: 'org1', ... }
]);
```

### Loggers 的運作方式

**所有 analytics loggers 都使用 abstraction**

```typescript
// server/services/analyticsLoggers/RuleExecutionLogger.ts
class RuleExecutionLogger {
  constructor(
    private readonly analytics: Dependencies['DataWarehouseAnalytics'],
  ) {}

  async logRuleExecutions(executions: any[]) {
    await this.analytics.bulkWrite('RULE_EXECUTIONS', executions);
  }
}

export default inject(['DataWarehouseAnalytics'], RuleExecutionLogger);
```

**執行流程**

1. Service 呼叫 `logger.logRuleExecutions(data)`
2. Logger 呼叫 `analytics.bulkWrite('RULE_EXECUTIONS', data)`
3. 使用 **ClickHouse** 時，透過 HTTP 進行分批 JSONEachRow inserts，預設每批 500 rows
4. 使用 **PostgreSQL** 時，先 buffers，再使用 COPY 或 batch INSERT

Loggers 不包含 warehouse-specific code，只需呼叫 `bulkWrite()`。

### Data flow

#### ClickHouse / PostgreSQL，direct

```text
RuleExecutionLogger
    ↓
DataWarehouseAnalytics.bulkWrite()
    ↓
ClickhouseAnalyticsAdapter / PostgresAnalyticsAdapter
    ↓
HTTP JSONEachRow (Clickhouse) or batched INSERT (PostgreSQL)
    ↓
Analytics tables
```

## 必要 tables

所有 warehouses 都需要下列 tables。Schema types 定義於 `/server/storage/dataWarehouse/IDataWarehouseAnalytics.ts`。

**Core tables**

- `RULE_EXECUTIONS`：Rule evaluation logs
- `ACTION_EXECUTIONS`：內容治理 Action logs
- `ITEM_MODEL_SCORES_LOG`：ML model prediction logs
- `CONTENT_API_REQUESTS`：API request logs

ClickHouse DDL 與其他 migrations 放在 `db/src/scripts/clickhouse/`。Schema 演進時，應在該處新增 files。

**Migration 範例**

### ClickHouse

```sql
CREATE TABLE rule_executions (
  ds Date,
  ts UInt64,
  org_id String,
  rule_id String,
  passed UInt8,
  result String,  -- JSON as string
  -- ... ~20 more fields
) ENGINE = MergeTree()
PARTITION BY ds
ORDER BY (ds, ts, org_id);
```

### PostgreSQL

```sql
CREATE TABLE rule_executions (
  ds DATE,
  ts BIGINT,
  org_id VARCHAR(255),
  rule_id VARCHAR(255),
  passed BOOLEAN,
  result JSONB,
  -- ... ~20 more fields
) PARTITION BY RANGE (ds);
```

**完整 schema** 請參考 `/server/storage/dataWarehouse/IDataWarehouseAnalytics.ts` 第 23 至 140 行。行號會隨 source 變更，使用時應以 interface 內容為準。

## 實作 custom warehouse

### 第 1 步，實作 `IWarehouseAdapter` plugin

在 `server/plugins/warehouse/adapters` 下建立 warehouse adapter。

```typescript
// server/plugins/warehouse/adapters/MyWarehouseAdapter.ts
import type SafeTracer from '../../../utils/SafeTracer.js';
import type { IWarehouseAdapter } from '../IWarehouseAdapter.js';
import {
  type WarehouseQueryFn,
  type WarehouseQueryResult,
  type WarehouseTransactionFn,
} from '../types.js';

export class MyWarehouseAdapter implements IWarehouseAdapter {
  readonly name = 'my-warehouse';

  constructor(
    private readonly client: SomeWarehouseClient,
    private readonly tracer?: SafeTracer,
  ) {}

  start(): void {
    // Optional: warm up connection pools
  }

  async query<T = WarehouseQueryResult>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<readonly T[]> {
    const execute = async () => {
      const rows = await this.client.execute(sql, params);
      return rows as readonly T[];
    };

    return this.tracer
      ? (this.tracer.addActiveSpan(
          { resource: 'my-warehouse.query', operation: 'query' },
          execute,
        ) as Promise<readonly T[]>)
      : execute();
  }

  async transaction<T>(fn: WarehouseTransactionFn<T>): Promise<T> {
    return this.client.transaction(async () =>
      fn((statement, parameters) => this.query(statement, parameters)),
    );
  }

  async flush(): Promise<void> {}

  async close(): Promise<void> {
    await this.client.close();
  }
}
```

### 第 2 步，提供 `IDataWarehouseDialect`（Kysely）implementation

若需要 type-safe queries，請建立 dialect wrapper。具體範例可參考 `ClickhouseKyselyAdapter`，並由 `DataWarehouseFactory.createKyselyDialect` 回傳。

### 第 3 步，實作 `IAnalyticsAdapter` plugin

Analytics adapters 位於 `server/plugins/analytics/adapters`，需實作 bulk writes 與選用的 CDC。

```typescript
// server/plugins/analytics/adapters/MyAnalyticsAdapter.ts
import type { IAnalyticsAdapter } from '../IAnalyticsAdapter.js';
import {
  type AnalyticsEventInput,
  type AnalyticsQueryResult,
  type AnalyticsWriteOptions,
} from '../types.js';

export class MyAnalyticsAdapter implements IAnalyticsAdapter {
  readonly name = 'my-analytics';

  constructor(private readonly client: SomeWarehouseClient) {}

  async writeEvents(
    table: string,
    events: readonly AnalyticsEventInput[],
    _options?: AnalyticsWriteOptions,
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }
    await this.client.insert(table, events);
  }

  async query<T = AnalyticsQueryResult>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<readonly T[]> {
    return (await this.client.query(sql, params)) as readonly T[];
  }

  async flush(): Promise<void> {}

  async close(): Promise<void> {
    await this.client.close();
  }
}
```

### 第 4 步，在 `DataWarehouseFactory` 註冊 provider

更新 `DataWarehouseFactory.createDataWarehouse`、`createKyselyDialect` 與 `createAnalyticsAdapter`，讓它們建立新 plugins 的 instances。Factory 會將 plugins 包在 bridges 中，application 其他部分只需使用 generic interfaces。

### 第 5 步，建立 analytics tables

所有 warehouses 都需要相同 tables，schema 位於 `IDataWarehouseAnalytics.ts`。

```sql
-- Adapt syntax for your warehouse
CREATE TABLE rule_executions (
  ds DATE,
  ts BIGINT,
  org_id VARCHAR,
  item_id VARCHAR,
  rule_id VARCHAR,
  passed BOOLEAN,
  result JSON,  -- Or JSONB, String depending on warehouse
  -- ... see IDataWarehouseAnalytics.ts for all ~20 fields
);
```

### 第 6 步，設定並執行

```sh
export WAREHOUSE_ADAPTER=your-warehouse
# Optional overrides
# export ANALYTICS_ADAPTER=your-warehouse
# Legacy fallback:
# export DATA_WAREHOUSE_PROVIDER=your-warehouse
export YOUR_WAREHOUSE_HOST=localhost
# ... other config vars

npm start
```

## Services 如何取用 analytics data

Services 使用 `DataWarehouseDialect` 查詢 analytics data。

```typescript
// server/services/analyticsQueries/UserHistoryQueries.ts
class UserHistoryQueries {
  constructor(private readonly dialect: Dependencies['DataWarehouseDialect']) {}

  async getUserRuleExecutionsHistory(orgId: string, userId: string) {
    const kysely = this.dialect.getKyselyInstance();

    return kysely
      .selectFrom('RULE_EXECUTIONS')
      .where('ORG_ID', '=', orgId)
      .where('ITEM_CREATOR_ID', '=', userId)
      .selectAll()
      .execute();
  }
}

export default inject(['DataWarehouseDialect'], UserHistoryQueries);
```

**適用於所有支援的 warehouses**

- ClickHouse：使用 `ClickhouseDialect`
- PostgreSQL：使用 `PostgresDialect`

## 可用的 IOC Services

| Service | Type | 用途 |
| --- | --- | --- |
| `DataWarehouse` | `IDataWarehouse` | Raw SQL、transactions |
| `DataWarehouseDialect` | `IDataWarehouseDialect` | Type-safe queries |
| `DataWarehouseAnalytics` | `IDataWarehouseAnalytics` | Bulk writes、logging |

## File structure

```text
server/storage/dataWarehouse/
├── IDataWarehouse.ts              # Core interface
├── IDataWarehouseAnalytics.ts     # Analytics interface + schema types
├── DataWarehouseFactory.ts        # Instantiates adapters via env configuration
├── ClickhouseAdapter.ts           # 📝 Stub - implement this
├── ClickhouseAnalyticsAdapter.ts  # 📝 Stub - implement this
├── PostgresAnalyticsAdapter.ts    # 📝 Stub - implement this
└── index.ts

server/plugins/warehouse/           # Pluggable warehouse adapters
├── examples/NoOpWarehouseAdapter.ts
└── ...

server/plugins/analytics/           # Pluggable analytics adapters
├── examples/NoOpAnalyticsAdapter.ts
└── ...

server/services/analyticsLoggers/   # Warehouse-agnostic loggers
├── RuleExecutionLogger.ts         # Uses DataWarehouseAnalytics
├── ActionExecutionLogger.ts       # Uses DataWarehouseAnalytics
├── ItemModelScoreLogger.ts        # Uses DataWarehouseAnalytics
└── ...

server/services/analyticsQueries/   # Warehouse-agnostic queries
├── UserHistoryQueries.ts          # Uses DataWarehouseDialect
├── ItemHistoryQueries.ts          # Uses DataWarehouseDialect
└── ...
```

## 參考資料

- **Schema types**：`/server/storage/dataWarehouse/IDataWarehouseAnalytics.ts`
- **ClickHouse**：`server/plugins/warehouse` 與 `server/plugins/analytics` adapters
- **PostgreSQL migrations**：`db/src/scripts/api-server-pg/` 是 application database。Analytics tables 可依部署方式放在專用 analytics database
- **Loggers**：`/server/services/analyticsLoggers/`
- **Queries**：`/server/services/analyticsQueries/`

## 資料安全與切換提醒

- Warehouse credentials 應由 secret manager 提供，不得 commit 或輸出至一般 application logs
- `ANALYTICS_ADAPTER=noop` 會停用 analytics writes。啟用前應清楚記錄資料缺口的開始與結束時間，並確認依賴 analytics 的功能如何降級
- Raw SQL 需使用 adapter 提供的 parameter binding，不可將外部輸入直接拼入 query string
- Custom adapter 必須明確定義 transaction、retry、timeout、partial bulk failure、flush 與 shutdown semantics，不能假設所有 backends 與 PostgreSQL 相同
- 在 ClickHouse 與 PostgreSQL 之間切換前，應完成 schema parity、歷史資料回填、雙寫或停機切換、row count reconciliation、query result comparison 與 rollback 計畫
- Analytics tables 可能包含使用者識別、內容治理 Decision、model score 與 API request metadata，需設定最低權限、encryption、retention、partition lifecycle、刪除與 audit controls
- Migration 或 schema 變更應與 application version 一起驗證。文件中的範例欄位、行號及 file structure 仍需以來源 commit 的實際 code 為準
