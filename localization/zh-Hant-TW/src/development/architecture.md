# 架構

本頁提供 Coop system architecture 的開發與維運概覽。

## 概覽

Coop 採 monorepo 架構，包含 React frontend、Node.js backend 與 multi-database architecture，設計目標是支援大規模、高吞吐量的內容治理。Coop 具備下列能力。

- Operations 與 policy teams 可管理檢舉送往哪個 Queue、每項處置需要累積多少次違規等設定，不需由 engineers 修改 backend code
- 同時支援自動處理與人工審查流程
- 提供具 role-based access control permissions 的 UI
- 內建 image 與 video media player
- 內建符合實務建議的審查員身心健康功能
- 使用 webhook-based architecture 將事件與其後續效果連接
- 記錄 Actions 的 audit trail、Action metadata，包括發生時間及執行者，以及對應 Policy
- 支援 dev/staging environments，供人工測試與 automated integration tests 使用

### Technology stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React、TypeScript、Ant Design、TailwindCSS、Apollo Client |
| **Backend** | Node.js、Express、Apollo Server、TypeScript |
| **Databases** | PostgreSQL、Scylla（5.2）、ClickHouse、Redis |
| **Messaging** | BullMQ（Redis） |
| **ORM** | Sequelize、Kysely |
| **Auth** | Passport.js、express-session、SAML（SSO） |
| **Observability** | OpenTelemetry |

### Directory structure

```text
coop/
├── client/                    # React frontend
│   └── src/
│       ├── webpages/         # Page components
│       ├── graphql/          # GraphQL queries/mutations
│       ├── components/       # Shared UI components
│       └── utils/            # Utility Functions
│
├── server/                    # Node.js backend
│   ├── bin/                  # CLI scripts
│   ├── graphql/              # GraphQL schema and resolvers
│   ├── iocContainer/         # Dependency injection setup
│   ├── models/               # Sequelize ORM models
│   ├── routes/               # REST API routes
│   ├── rule_engine/          # Rule evaluation logic
│   ├── services/             # Business logic services including NCMEC
│   └── workers_jobs/         # Background processing
│
├── db/                        # Database migrations
│   └── src/scripts/
│       ├── api-server-pg/     # PostgreSQL
│       ├── clickhouse/        # ClickHouse
│       └── scylla/            # Scylla
│
└── docs/                      # Documentation
```

## Backend service registration

Coop backend 使用 [BottleJS](https://github.com/young-steveo/bottlejs) 進行 dependency injection，支援 lazy loading、middleware hooks 與 decorators。新 services 需在 [`server/iocContainer/index.ts`](https://github.com/roostorg/coop/blob/main/server/iocContainer/index.ts) 註冊。若要加入新 service 並讓 application 其他部分使用，應從此處開始。

## API

Coop 透過 REST APIs 接收內容。所有 API requests 都必須在 `x-api-key` header 傳入 organization API key。

所有 endpoints 與 request/response schemas 詳見 [API 參考](../api/README.md)。

### 傳入 Coop

平台透過 [Items API](../api/items.md) 將內容傳入 Coop，以進行自動處置。使用者檢舉則透過 [Report API](../api/report.md) 傳入，再路由至 Review Console。

若要回填歷史資料、在 Review Console 取得尚未送至 Coop 的 related Items，並確保查看時 Items 內容為最新狀態，平台可使用 [Partial Items API](../api/partial-items.md)。

### Coop 傳出的 Actions

Proactive Rule 或內容審查員 Decision 觸發 Action 時，Coop 會向 organization platform 傳送 webhook。Webhook 格式與處理方式詳見[處理 Actions](../api/actions.md)。

## Rules

Coop 支援兩組 [Rules](../user/automated-enforcement.md)，各自使用不同 code paths、storage tables 與 UI surfaces。

### Proactive Rules

提交 Item 時，Coop 會取得所有與該 Item Type 關聯的 [Proactive Rules](../user/automated-enforcement.md#proactive-rules)。Proactive Rules 會平行執行以決定 automatic Actions，也可能將 Item 傳至 Review Console。

每項 Rule 會以 recursive processing 評估其 `conditionSet`，從 Item 取出 values，視需要將 values 傳入 Signals，再以設定的 comparators 比較結果。

Rule status 包括 `LIVE`、`DRAFT`、`BACKGROUND`、`EXPIRED`。

- Code：`/server/models/rules/RuleModel.ts`
- Storage tables
  - `manual_review_tool.routing_rules`
  - `manual_review_tool.routing_rules_to_item_types`
  - `manual_review_tool.routing_rules_history`
  - `manual_review_tool.appeal_routing_rules`
  - `manual_review_tool.appeal_routing_rules_to_item_types`
- UI：`/client/src/webpages/dashboard/rules/`

### Routing Rules

提交檢舉，或 Proactive Rule 將 Item 傳至 Review Console 時，系統會以 [Routing Rules](../user/automated-enforcement.md#routing-rules) 進行評估。第一個成功的 Routing Rule 會將 Item 以 Job 形式路由至適當 Queue，等待審查。

- Code：`/server/services/manualReviewToolService/modules/JobRouting.ts`
- Storage tables
  - `public.rules`
  - `public.rules_and_actions`
  - `public.rules_and_item_types`
  - `public.rules_and_policies`
  - `public.rules_history`
- UI：`/client/src/webpages/dashboard/mrt/queue_routing/`

## Review Console

[Review Console](../user/review-console.md) 在 codebase 中有時稱為「manual review tool」或「MRT」，是一套以 BullMQ Queue 為基礎的人工審查系統。Items 會因 Rule Actions 或使用者檢舉，以 [Job](../user/concepts.md#jobs) 形式進入 Review Console。每個 Job 會加入檢舉次數、使用者違規次數、related Items 等脈絡，再依 UI 設定的 Routing Rules 路由至具名 Queue。內容審查員以 exclusive lock 領取 Job，確保同一 Job 只有一人處理，再透過執行 [Actions](../user/concepts.md#actions) 作成 Decision，觸發 downstream callbacks 或 NCMEC 等通報流程。

### Queue operations

**File**：`/server/services/manualReviewToolService/modules/QueueOperations.ts`

Jobs 可由下列來源進入 Queue。

- Rules engine execution
- 使用者檢舉
- Post-action workflows
- Review Console internal jobs

**使用者操作**

- 使用 exclusive locks 取出 Jobs
- 提交 Decisions
- 觸發 post-decision webhooks 或 NCMEC 通報

**支援的 Decision types**

- `IGNORE`
- `CUSTOM_ACTION`
- `SUBMIT_NCMEC_REPORT`
- `ACCEPT_APPEAL`
- `REJECT_APPEAL`
- `TRANSFORM_JOB_AND_RECREATE_IN_QUEUE`
- `AUTOMATIC_CLOSE`

**Manual Enqueue**

```typescript
{
  orgId: string;
  correlationId: RuleExecutionCorrelationId | ActionExecutionCorrelationId;
  createdAt: Date;
  enqueueSource: 'REPORT' | 'RULE_EXECUTION' | 'POST_ACTIONS' | 'MRT_JOB';
  enqueueSourceInfo: ReportEnqueueSourceInfo | RuleExecutionEnqueueSourceInfo | ...;
  payload: ManualReviewJobPayloadInput;
  policyIds: string[];
}
```

**從 Rules Engine 進入**（`ActionPublisher.ts`）

```typescript
case ActionType.ENQUEUE_TO_MRT:
  await this.manualReviewToolService.enqueue({
    orgId,
    payload: { kind: 'DEFAULT', item, reportHistory: [], ... },
    enqueueSource: 'RULE_EXECUTION',
    enqueueSourceInfo: { kind: 'RULE_EXECUTION', rules: rules.map(x => x.id) },
    correlationId,
    policyIds: policies.map(it => it.id),
  });
```

**以 lock 取出 Job**

```typescript
async dequeueNextJob(opts: {
  orgId: string;
  queueId: string;
  userId: string;
}): Promise<{ job: ManualReviewJob; lockToken: string } | null>
```

**提交 Decisions**

```typescript
async submitDecision(opts: SubmitDecisionInput): Promise<SubmitDecisionResponse>
```

## Actions

Rule match 或內容審查員提交 Decision 時會執行 Actions。

Action types 如下。

- `CUSTOMER_DEFINED_ACTION`：向 platform infrastructure 傳送 POST webhook
- `ENQUEUE_TO_MRT`：傳送至 Review Console
- `ENQUEUE_TO_NCMEC`：路由至 NCMEC reporting Queue

**Webhook structure**

```json
{
  "item": { "id": "...", "typeId": "..." },
  "policies": [{ "id": "...", "name": "...", "penalty": "..." }],
  "rules": [{ "id": "...", "name": "..." }],
  "action": { "id": "..." },
  "custom": {},
  "actorEmail": "moderator@example.com"
}
```

Webhook delivery 失敗時，會使用 exponential backoff，最多重試五次。

**Webhook Field 參考**

| Property | Type | 是否固定存在 | 說明 |
| :--- | :--- | :--- | :--- |
| `item` | Item | 一律存在 | 應執行此 Action 的 Item |
| `action` | Action | 一律存在 | 正在觸發的 Action 資訊 |
| `policies` | Array\<Policy\> | 一律存在 | 與此 Action 關聯的 Policies。多項 Rules 觸發同一 Action 時可能包含多筆 |
| `rules` | Array\<Rule\> | 不一定 | 觸發此 Action 的 Rules。由人工審查或批次處置觸發時為空 |
| `custom` | Object | 不一定 | 在 Action form 的「Body」中設定的自訂參數 |
| `actorEmail` | String | 不一定 | 執行 Action 之 Coop 使用者的 email。由 automated Rule 或 AI 觸發時省略 |

## Storage

Coop 使用 multi-database storage system。

- **PostgreSQL** 以 ACID guarantees 儲存 configuration、Rules、users、sessions 與 Decisions
- **Redis（透過 BullMQ）** 提供 Review Console Job Queues、caching 與 aggregation counters 所需的低延遲處理
- **ScyllaDB（5.2）** 儲存高吞吐量寫入的 Item submission history，並以 materialized views 支援不同 access patterns
- **ClickHouse** 作為 Rule executions、Actions 與 user statistics 的 analytics warehouse

### PostgreSQL

提供 config、auth、Rules 與 operational data 的 ACID-compliant storage，包括下列 schemas 與資料。

- `public`：orgs、users、actions、policies、item_types、banks、api_keys
- `jobs`：scheduled job tracking
- `manual_review_tool`：manual review Queues、Decisions、Routing Rules、comments
- `ncmec_reporting`：兒少安全 NCMEC reports
- `reporting_rules`：user/content reporting Rules
- `signal_service`：Signal configuration
- `user_management_service`：user management
- `users_statistics_service`：user statistics

### Redis

作為低延遲 hot cache，用途如下。

- **Review Console**：BullMQ Job Queues
- **Caching**：Sets、Sorted Sets、Lua scripts
- **Distributed counters**

### ScyllaDB

用於高吞吐量的 Item history，包括 Investigations tool 及相關 users/Items。它以 time-series 形式儲存 Item submissions，並支援多種 access patterns。

Tables 與 views 如下。

- **`item_submission_by_thread`**：primary table
- **`item_submission_by_item_id`**：以 Item ID lookup
- **`item_submission_by_thread_and_time`**：以 thread 與 time range lookup
- **`item_submission_by_creator`**：以 creator lookup

### ClickHouse

作為 analytics、aggregations 與 audit trails 的 OLAP storage。

Databases 與主要 tables 如下。

- **`analytics`**：`RULE_EXECUTIONS`、`ACTION_EXECUTIONS`、`CONTENT_API_REQUESTS`、`ITEM_MODEL_SCORES_LOG`
- **Action executions**：`ACTION_STATISTICS_SERVICE` 下的 `BY_ACTION`、`BY_RULE`、`BY_POLICY`、`ACTIONED_SUBMISSION_COUNTS`
  - `MANUAL_REVIEW_TOOL` 下的 `ROUTING_RULE_EXECUTIONS`
- **Reporting 與 Appeal statistics**：`REPORTING_SERVICE` 下的 `REPORTS`、`APPEALS`、`REPORTING_RULE_EXECUTIONS`
- **User-level metrics**：`USER_STATISTICS_SERVICE` 下的 `LIFETIME_ACTION_STATS`、`SUBMISSION_STATS`、`USER_SCORES`

## Signals

Signals 是 Rules 使用的 scoring 或 evaluation functions，範圍從簡單文字比對到 third-party ML services。

Rules engine 評估需要 score 的 conditions 時會呼叫 Signals。結果會進行 memoization 與 caching，以供重複使用。Signals 會 extend shared base class，並定義 metadata 與 execution logic。

File：`/server/services/signalsService`

**Signals Base Class**

File：`/server/services/signalsService/signals/SignalBase.ts`

```typescript
abstract class SignalBase<Input, OutputType, MatchingValue, Type> {
  abstract get id(): SignalId;
  abstract get displayName(): string;
  abstract get description(): string;
  abstract get eligibleInputs(): readonly Input[];
  abstract get outputType(): OutputType;
  abstract get supportedLanguages(): readonly Language[] | 'ALL';
  abstract get integration(): Integration | null;
  abstract getCost(): number;
  abstract run(input: SignalInput): Promise<SignalResult | SignalErrorResult>;
}
```

# 設定

User roles 如下。

- `ADMIN`：完整存取權
- `RULES_MANAGER`：可修改 live Rules
- `ANALYST`：可查看 insights
- `MODERATOR_MANAGER`：管理 MRT Queues
- `MODERATOR`：審查被指派 Queues
- `CHILD_SAFETY_MODERATOR`：可存取 NCMEC data
- `EXTERNAL_MODERATOR`：只有 MRT view access

Permissions 如下。

- `MANAGE_ORG`：`ADMIN`
- `MUTATE_LIVE_RULES`：`ADMIN`、`RULES_MANAGER`
- `VIEW_MRT`：所有 moderator roles
- `EDIT_MRT_QUEUES`：`ADMIN`、`MODERATOR_MANAGER`
- `VIEW_CHILD_SAFETY_DATA`：`ADMIN`、`MODERATOR_MANAGER`、`CHILD_SAFETY_MODERATOR`

## Authentication

Coop 支援三種 authentication methods，分別是供 programmatic access 使用的 API key authentication、session-based authentication，以及 SAML/SSO。

### API Key Authentication

API keys 用於驗證存取 REST endpoints 的 programmatic requests。所有 API requests 都必須提供 `x-api-key` header。

1. Middleware 取出 `x-api-key` header
2. 透過 database 中的 SHA-256 hash lookup 驗證 key
3. Key 有效時，在 request 設定 `orgId`，供 downstream handlers 使用
4. Key 無效或不存在時回傳 `401 Unauthorized`

- Keys 是 32-byte random values，儲存前會進行 SHA-256 hashing
- 每個 key 的 scope 限於單一 organization
- 系統追蹤 last-used timestamp 供 audit 使用
- Keys 可進行 rotation，建立新 key 並停用舊 key

Files 如下。

- Middleware：`/server/utils/apiKeyMiddleware.ts`
- Service：`/server/services/apiKeyService/apiKeyService.ts`

### Session-Based Authentication

Dashboard UI 透過 GraphQL 使用 session authentication。

1. User 透過 GraphQL login mutation 提交 credentials
2. Passport 的 `GraphQLLocalStrategy` 驗證 email/password
3. 透過 bcrypt comparison 驗證 password
4. 驗證成功後，使用 `passport.serializeUser()` 將 user serialized 至 session
5. 透過 `connect-pg-simple` 將 session 儲存於 PostgreSQL

Session configuration 如下。

- Store：PostgreSQL-backed
- Cookie：production 啟用 Secure flag，30-day expiry
- Session secret：`process.env.SESSION_SECRET`

Files：`/server/api.ts`

### SAML/SSO Authentication

Enterprise SSO 使用 SAML，並由各 organization 分別設定。

1. User 前往 `/saml/login/{orgId}`
2. Passport 的 `MultiSamlStrategy` 取得該 organization 的 SAML settings
3. User redirected 至設定的 SAML provider
4. Provider 完成 authentication，並將 assertion POST 至 callback URL
5. 系統從 SAML assertion 取出 user email
6. Lookup user record 並建立 session

各 organization 的 configuration 儲存於 `org_settings` table。

- `saml_enabled`：Boolean flag
- `sso_url`：SAML entry point URL
- `cert`：供驗證使用的 certificate

Files 如下。

- `/server/api.ts`
- `/server/services/SSOService/SSOService.ts`

## 安全與維運提醒

- 本頁記錄的是來源 commit 所描述的 architecture。實際部署、權限與資料流仍應以同一版本 code、migrations 與 runtime configuration 共同核對
- Webhook callbacks 需依 [API Keys 與 Authentication](api-auth.md) 驗證 signature，並將 handler 設計為冪等，以承受重試
- Audit trails、Review Console Jobs、reports、Appeals、Signals 與 metrics 可能含個人資料、敏感內容或內部判斷，應分別設定最低權限、retention、刪除與 log access controls
- `VIEW_CHILD_SAFETY_DATA` 等 role/permission 設定仍需由 backend enforcement 驗證，不應只依靠 UI 隱藏功能
- Multi-database architecture 需要跨 PostgreSQL、Redis、ScyllaDB 與 ClickHouse 設計一致性、備份、復原、retention 與資料刪除流程
- Queue lock、retry、worker restart 與 downstream callback failure 都應納入 integration tests 與 production monitoring
