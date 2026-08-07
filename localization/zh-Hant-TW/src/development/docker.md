# Docker Images

每次 push 至 `main` 時，都會將預先建置的 images 發布至 GitHub Container Registry。

```text
ghcr.io/roostorg/coop-server       # API server
ghcr.io/roostorg/coop-worker       # Background worker
ghcr.io/roostorg/coop-client       # Frontend (nginx)
ghcr.io/roostorg/coop-migrations   # One-shot database migrations runner
```

Images 使用 `latest`、Git SHA 與 release 的 semver tags。`coop-migrations` image 只在 `db/` 下的內容變更時，例如加入 migration script，或發布 release 時重新建置，因此 tags 追蹤的是 schema，不是每次 server 或 client 變更。

## 快速開始

取得已發布 images，並以單一 command 在本機執行完整 stack。

```bash
docker compose -f docker-compose.images.yaml up -d
```

> [!WARNING]
> `docker-compose.images.yaml` 使用 `.env.docker`。此檔案提供可供本機評估的預設值，但包含 placeholder secrets。**任何非本機部署都必須先檢查並更換 secrets。**

此 command 會啟動下列 components。

- **Coop server**，port 8080
- **Coop client**（nginx），port 3000
- **Postgres**、**Redis**、**ScyllaDB**、**ClickHouse**
- Database migrations，自動執行
- Seed service，建立具有隨機 password 的 admin user

### 取得登入 credentials

Seed service 會將產生的 credentials 輸出至 logs。

```bash
docker compose -f docker-compose.images.yaml logs seed
```

在底部尋找類似下列 output。

```text
============================================
  Login:    admin@coop.local
  Password: <randomly-generated>
============================================
```

接著開啟 [http://localhost:3000](http://localhost:3000) 並登入。

使用相同 volumes 再次啟動時，seed service 會偵測既有使用者並略過，credentials 維持相同。若遺失 password，可使用 `-v` 移除 volumes 並重設，但此操作會清除資料。

## 建立其他使用者

```bash
docker compose -f docker-compose.images.yaml exec server \
  node bin/create-org-and-user.js \
  --name "My Org" \
  --email "you@example.com" \
  --website "https://example.com" \
  --firstName "Jane" \
  --lastName "Doe" \
  --password "your-password"
```

## 停止服務

```bash
# Stop containers, keep data volumes
docker compose -f docker-compose.images.yaml down

# Stop containers and wipe all data
docker compose -f docker-compose.images.yaml down -v
```

> [!CAUTION]
> `down -v` 會刪除 Compose 管理的 data volumes。執行前應確認目前目錄、Compose file 與資料是否可重建或已有備份。

## Image 詳細資訊

| Image | Dockerfile | Build target | Base |
| --- | --- | --- | --- |
| `coop-server` | `Dockerfile` | `build_server` | node:24-bullseye-slim + dumb-init |
| `coop-worker` | `Dockerfile` | `build_worker_runner` | node:24-bullseye-slim + dumb-init |
| `coop-client` | `client/Dockerfile` | `serve` | nginx:1.27-bookworm |
| `coop-migrations` | `db/Dockerfile` | final stage | node:24-bullseye-slim |

Client image 透過 nginx 提供由 Vite 建置的 SPA，並將 `/api/` requests，包括 `/api/v1/graphql`，proxy 至名為 `server`、port 8080 的 backend service。

## 執行 migrations

`coop-migrations` image 將 `db/` 下的 migration scripts 與 migrator engine 一起封裝，可作為 one-shot task 執行，例如 ECS `RunTask`、Kubernetes `Job`，或 `docker-compose.images.yaml` 中的 `migrations` service。它提供與本機開發相同的 `npm run db:*` commands，因此呼叫方式與從 repository root 執行一致。

```bash
# Apply all pending migrations to an existing prod database
docker run --rm --env-file .env.docker ghcr.io/roostorg/coop-migrations:latest \
  npm run db:update -- --db api-server-pg --env prod
```

支援的 `--db` values 為 `api-server-pg`、`scylla` 與 `clickhouse`。Connection settings 來自 environment variables，見 `db/.env.example`。任何 command 啟動時都會讀取 database configs，因此必須提供這些設定。

### `--env` 控制的範圍

`--env` 可為 `staging` 或 `prod`，只影響 **seed scripts**，不影響 migrations。

- Migration scripts 會在所有 environments 執行
- 名稱為 `*.seed.<env>.sql` 的 seed 只在 `--env` 相符時執行。Seed files 以 timestamp 為 prefix。此英文來源版本記載 repository 包含 `db/src/scripts/api-server-pg/2025.12.01T00.00.01.initial-test-data.seed.staging.sql`，會建立具有預設 password users 的 sample organization。因此，**production 必須使用 `--env prod`** 以略過。如果對 production database 使用 `--env staging`，會寫入測試資料
- `db:create` 在功能上忽略 `--env`，也允許在 prod 執行，可用於自行託管 Scylla／ClickHouse 的 schema provisioning，這些服務沒有代管的 create database 步驟
- `db:clean` 與 `db:drop` 是 destructive commands，會拒絕 `--env prod`，作為安全保護

## 部署提醒

- 正式環境不要使用 `latest` tag，應固定經驗證的 Git SHA 或 release tag，並保留 image provenance 與 rollback 版本
- `.env.docker`、Compose logs 與 shell history 可能暴露 secrets。正式環境應使用 secret manager，並限制 log 存取
- Migration image 會對真實資料庫執行變更。執行前應備份、核對目標、檢視 migration、確認 rollback 或 forward-fix 計畫
- `--env prod` 只影響 seeds，不代表 command 或設定本身安全。仍需分離帳號、network、credentials 與核准流程
- 本文件翻譯不代表正式環境部署已通過安全、容量、備援、監控、備份或復原驗證
