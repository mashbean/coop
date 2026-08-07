# 本機開發

本頁提供本機開發的詳細設定與疑難排解資訊。

> [!NOTE]
> 建議先熟悉 Coop 的[基本概念](../user/concepts.md)，取得更多脈絡。

本頁著重提供詳細資訊與參考資料。若只想快速開始執行，請閱讀[開始使用](./)。系統元件與資料流見[架構](architecture.md)。

## Prerequisites

- **Operating System**：macOS、Linux，或使用 WSL2 的 Windows
- **git**：clone repository 與參與貢獻時使用
- **Node.js 24**、**nvm** 與 **npm**
- **Docker** 與 **Docker Compose**
- Bare instance 最少需要 **4 GiB RAM**，開發環境建議使用 8 GiB 以上

確認使用 repository 建議的 Node.js 版本。

```sh
nvm install && nvm use
```

## Dependencies

Coop repository 包含多個 components，各自以 npm package 管理及安裝 dependencies。

```sh
npm install
(cd db && npm install)
(cd server && npm install)
(cd client && npm install)
(cd migrator && npm install)
```

## Environment 設定

將 `db/`、`server/` 與 `client/` 中的 `.env.example` 複製為 `.env`，再依環境調整。預設值可供本機開發及展示使用。範例檔列出所有可用選項及說明。

### `db/.env`

Postgres、ClickHouse 與 Scylla database connection settings。

### `server/.env`

Redis connection settings、integrations 使用的 external API keys、session secrets 與 JWT signing keys。

### `client/.env`

Vite、content proxying 與產生 sourcemaps 的設定。

> [!WARNING]
> `.env` 可能包含 secrets，不得 commit、貼入 issue 或放入公開 log。範例 secrets 只適用於隔離的本機環境。

## Docker services

`npm run up` 會使用 Docker 啟動 backing services。

| Service | Port | 說明 |
| --- | --- | --- |
| PostgreSQL | 5432 | Primary database |
| ClickHouse | 8123、9000 | Analytics warehouse |
| ScyllaDB | 9042 | Item submission history |
| Redis | 6379 | Caching 與 job queues |
| Jaeger | 16686 | Tracing UI |
| OTEL Collector | 4317 | Telemetry collection |

檢查 service health。

```sh
docker ps
docker logs <container-name>
```

停止 services。

```sh
npm run down
```

## Database 操作

### 建立 databases

```sh
npm run db:create -- --env staging --db api-server-pg
npm run db:create -- --env staging --db scylla
npm run db:create -- --env staging --db clickhouse
```

### 執行 migrations

```sh
npm run db:update -- --env staging --db api-server-pg
npm run db:update -- --env staging --db scylla
npm run db:update -- --env staging --db clickhouse
```

### 其他 commands

```sh
npm run db:add -- --name <migration-name> --db api-server-pg
npm run db:clean    # Drop and recreate (destructive)
npm run db:create   # Create database
npm run db:drop     # Drop database
```

> [!CAUTION]
> `db:clean` 與 `db:drop` 會刪除資料。執行前請核對 environment、database target 與備份狀態，不要將本機範例 command 直接用於 production。

### Migration locations

```text
db/src/scripts/
├── api-server-pg/    # PostgreSQL
├── clickhouse/       # ClickHouse
└── scylla/           # ScyllaDB
```

## 執行 application

為了方便使用，repository root 的 `start` npm script 會啟動 client、server 與 GraphQL codegen，並開啟 web browser。`compile` script 會執行相同工作，但不開啟 browser。

```sh
npm run start
```

或使用下列 command。

```sh
npm run compile
```

### 個別 services

若要分別啟動 services 以協助除錯，請在不同 terminal windows 或 tabs 中，分別執行 `server` 與 `client` packages 的 `start` npm script。

在第一個 terminal 啟動 server。

```sh
cd server && npm run start
```

在第二個 terminal 啟動 client。

```sh
cd client && npm run start
```

若要持續更新 GraphQL schema changes，可選擇在第三個 terminal 執行下列 command。

```sh
npm run generate:watch
```

### Background workers

Item submissions 由 BullMQ worker 從 Redis Queue 取出後非同步處理。若要在本機處理 Items，請在另一個 terminal 執行 worker。

```sh
cd server
npm run runWorkerOrJob ItemProcessingWorker
```

若沒有執行此 worker，提交的 Items 會進入 Redis Queue，但不會被處理。其他可用的 workers 與 jobs 列於 `server/iocContainer/services/workersAndJobs.ts`。

### 使用 distributed tracing

```sh
cd server && npm run start:trace
```

可在 [localhost:16686](http://localhost:16686) 查看 traces。

### 存取位置

| Service | URL |
| --- | --- |
| Client | http://localhost:3000 |
| API Server | http://localhost:8080 |
| GraphQL | http://localhost:8080/graphql |
| Jaeger UI | http://localhost:16686 |

## Testing

```sh
# Server
cd server
npm run test              # Watch mode
npm run test:prepush      # Single run
npm run test:integ        # Integration tests

# Client
cd client
npm run test              # Watch mode
npm run test:prepush      # Single run

# Full validation (run before pushing)
npm run check:prepush
```

## 在本機執行 CI

所有 PR checks 都定義為 `docker compose` services，可在本機重現 CI jobs。

| CI job | 本機 command |
| --- | --- |
| `check_generated_graphql` | `docker compose run --rm codegen-check` |
| `check_api_server`（lint） | `docker compose run --rm backend npm run lint` |
| `check_api_server`（build） | `docker compose run --rm backend npm run build` |
| `run_frontend_checks_if_changed`（lint） | `docker compose run --rm client npm run lint` |
| `run_frontend_checks_if_changed`（build） | `docker compose run --rm client npm run build` |
| `check_api_server`（test） | `docker compose run --rm test` |

執行完整 suite，遇到第一個 failure 時停止。

```sh
docker compose run --rm codegen-check \
  && docker compose run --rm backend npm run lint \
  && docker compose run --rm backend npm run build \
  && docker compose run --rm client npm run lint \
  && docker compose run --rm client npm run build \
  && docker compose run --rm test
```

關閉 services。

```sh
docker compose down        # stop containers, keep DB volumes
docker compose down -v     # also drop DB volumes (fresh DBs next run)
```

> [!CAUTION]
> `docker compose down -v` 會刪除目前 Compose project 管理的 database volumes。執行前請確認工作目錄、Compose file 與資料是否已有備份或可重建。

`check_migration_order` 只在 GitHub Actions 執行。這是 GitHub-specific check，本機不需要執行。新增 migration 時，請以 `date -u +"%Y.%m.%dT%H.%M.%S"` 產生 filename prefix，讓 CI check 通過。

## GraphQL 開發

Coop 使用 schema-first GraphQL 與雙向 code generation。

```sh
npm run generate          # One-time
npm run generate:watch    # Watch mode
```

產生的 files 如下。

- `client/src/graphql/generated.ts`
- `server/graphql/generated.ts`

Schema changes 會觸發 client 與 server 重新編譯。若發生 regeneration loop，請停止 watch mode，再手動執行。

Backend GraphQL definitions 在每個 block 開頭以 `/* GraphQL */` 標示，大多位於 `/server/graphql/`。Frontend GraphQL 定義在使用它的 components 旁，因此 file 可能使用並未定義於同一檔案內的 queries。

## Management scripts

`server/bin/` 中的兩個 utility scripts 可協助執行常見操作。

- **`npm run create-org`**：建立新 organization、admin user 與 API key
- **`npm run get-invite`**：取得已透過 UI 邀請之使用者的 signup link

詳細用法與範例見 `server/bin/README.md`。

## HMA 開發

執行 `npm run up` 時，HMA 會與其他 backing services 一起自動啟動。

`server/.env` 已預先以 `HMA_SERVICE_URL=http://localhost:9876` 設定 HMA。本機開發不需要額外 environment 設定。

### Image URL 存取

向 Coop 提交 Items 時，image URLs 必須能由 HMA Docker container 存取，只有 browser 或 Node.js server 能存取仍不足以完成處理。

HMA 會自行取得 image 並計算 hash。因此，localhost URLs 會在沒有明顯 error 的情況下失敗，HMA 將回傳空 hashes、image similarity Signal 不會進行評估，也不會觸發 Rule。

本機開發時，若從 host machine 提供 images，請在 `/etc/hosts` 加入下列內容。

```text
127.0.0.1 host.docker.internal
```

提交 Items 時，請在 image URLs 使用 `host.docker.internal:<port>`。此 URL 可同時由 browser 與 Docker container 正確解析。

> [!NOTE]
> 修改 `/etc/hosts` 通常需要系統管理權限。請先確認既有內容，僅新增所需 mapping，不要覆寫整份檔案。

## 疑難排解

### ScyllaDB 尚未就緒

ScyllaDB 需要 30 至 60 秒完成初始化。若在 `npm run up` 後立即執行 migrations 而失敗，請等待後再重試。

### ClickHouse migration 失敗

確認 `.env` 已設定 `CLICKHOUSE_USERNAME` 與 `CLICKHOUSE_PASSWORD`。

### Port 衝突

```sh
lsof -i :3000    # Client
lsof -i :8080    # Server
lsof -i :5432    # PostgreSQL
```

### 重設所有本機資料

```sh
npm run down
docker volume prune    # Warning: removes all Docker volumes
npm run up
npm run db:update -- --env staging --db api-server-pg
npm run db:update -- --env staging --db clickhouse
npm run create-org
```

> [!CAUTION]
> `docker volume prune` 會刪除整個 Docker environment 中所有未被 container 使用的 volumes，不只 Coop 的 volumes，且可能影響其他 projects。執行前請先列出並核對目標；若只需重設 Coop，優先使用限定於正確 Compose project 的操作。

### 直接連線至 databases

```sh
# PostgreSQL
psql -h localhost -U postgres -d postgres
# Password: postgres123

# ClickHouse
clickhouse-client --host localhost --user default --password clickhouse

# Redis
redis-cli
```

上述 credentials 為本機範例值，不應用於共享或 production 環境。

## Code quality

```sh
npm run lint           # ESLint
npm run prettier       # Prettier (check only; use `npm run prettier:fix` to write, alias `npm run format`)
npm run check:prepush    # Run before pushing
```
