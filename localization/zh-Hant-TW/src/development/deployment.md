# 部署

你可以在自己的基礎設施上執行 Coop。另請參考 [Docker Images](docker.md) 與[架構](architecture.md)。

> [!IMPORTANT]
> 執行 migrations 時，系統會建立一個含有預設密碼使用者的範例組織。Production 環境務必清除這些帳號與資料。

## Self-hosting 檢查清單

Coop 目前沒有提供單一的 production deployment recipe，但 repository 已包含建立 self-hosted instance 所需的設定項目。請以 `db/.env.example`、`server/.env.example` 與 `client/.env.example` 的範例環境檔為起點，建立符合自身部署環境的設定。

### Production 必要設定

Production 部署至少需要提供下列項目。

- API server Postgres instance 與 database migrator 的 database connection
- Queue 與 background processing 使用的 Redis connection
- Item submission history 使用的 Scylla connection
- `SESSION_SECRET` 與 `GRAPHQL_OPAQUE_SCALAR_SECRET` 等 session 及 token secrets
- `UI_URL` / `VITE_UI_URL` 等公開 UI origin，讓產生的連結與 browser-facing flow 指向正確 host
- 符合部署環境的 email sender addresses

正式上線前，通常也需要檢查 `server/.env.example` 中的 pool、timeout、TLS 與 keepalive 設定。預設值以 local development 為目標，不一定適合長期執行的 production 環境。

### 選用及依部署而定的設定

許多設定只在啟用特定功能或更換 backend 時才需要。

- Analytics 與 warehouse backend 由 `WAREHOUSE_ADAPTER` 和 `ANALYTICS_ADAPTER` 控制。支援的 adapter 及相關 ClickHouse/PostgreSQL 設定，請參考 [Data Warehouse Abstraction Layer](data-warehouse.md)。
- 兒少安全通報為選用功能。若使用 NCMEC 通報，必須先完成 Coop 的組織設定，且只有在部署已獲准進行正式通報後，才可在 server 設定 `NCMEC_ENV=production`。詳見 [NCMEC CyberTipline 的測試與正式提交](../integrations/ncmec.md#測試與正式提交)。
- Google Places、custom docs/content proxy URLs 等 client-side integrations 為選用項目，不使用相關功能時可留空。
- `server/.env.example` 中的 third-party integration keys 通常只有在啟用對應 integration 時才需要設定。

### 正式上線前

第一次成功完成 migration 與 bootstrap 後，請依序確認下列事項。

1. 移除或妥善保護範例組織，以及所有使用預設密碼建立的使用者。
2. 確認 production hostname 與 email 設定正確。
3. 確認 warehouse 及 analytics adapters 與實際部署的 backing services 一致。
4. 除非確定要傳送正式 CyberTipline 通報，否則應讓 `NCMEC_ENV` 保持未設定或使用非 `production` 值。

## Single Sign-on

Coop 支援透過 SAML 使用 single sign-on，例如 Okta。請在 [Settings → Single Sign-on](../user/administration.md#single-sign-on) 啟用 SSO，並設定 URL 與 certificate。

### 範例：Okta

為 Coop 設定 Okta SAML 需要下列條件。

- 可使用 Okta admin mode
- Okta 與 SAML 的 group names 完全一致
- 具備 Coop admin 權限
- 能夠建立 custom SAML application

設定步驟如下。

1. 在 Okta 建立 [custom SAML application](https://help.okta.com/oag/en-us/content/topics/access-gateway/add-app-saml-pass-thru-add-okta.htm)，並使用下列設定。

   | 設定 | 值 |
   | :--- | :--- |
   | Single sign-on URL | 組織的 callback URL，例如 `https://your-coop-instance.com/login/saml/12345/callback`。可在 Coop 的 **Settings** → **SSO** 找到。 |
   | Audience URI (SP Entity ID) | Coop instance 的 base URL，例如 `https://your-coop-instance.com`。 |
   | `email` attribute（位於 **Attribute Statements**） | `email`。實際值取決於 identity provider 的 attribute mappings，例如 Google SSO 可能使用「Primary Email」。 |

2. 在 **Feedback** tab 勾選 **I'm a software vendor. I'd like to integrate my app with Okta**。
3. 前往 app settings 的 **Sign On** tab，在 **SAML Signing Certificates** → **SHA-2** 下點選 **Actions** → **View IdP metadata**。
4. 複製 XML file 的內容。在 Coop 前往 **Settings** → **SSO**，將 XML 貼入 **Identity Provider Metadata** field。
5. 在同一頁的 **Attributes** section 輸入 `email`。
6. 在 Okta app 的 **Assignments** 下，將 users 或 groups 指派給 app。

## 歷史參考資料

先前 production deployment 使用的 AWS infrastructure code，包括 CDK、Helm charts、Pulumi 與 CDKTF，可在 [`0.1` tag](https://github.com/roostorg/coop/tree/0.1/.devops) 找到。該 infrastructure code 已不再維護，也可能與目前 application architecture 有落差，但仍可作為自行部署的參考。

## Production readiness 補充檢查

- 固定 container images 與 dependencies 的版本，並保留 artifact provenance 及更新程序
- 使用 secret manager 管理 production secrets，不將 secrets 放入 repository 或一般設定檔
- 完成 network segmentation、TLS、最低權限 access、backup、restore test、monitoring 與 alerting
- Migration 前建立可驗證的 backup，並準備 rollback 或 forward-fix 程序
- 驗證 queue、workers、upstream outage、service restart 與 disaster recovery 情境
- 對兒少安全通報及其他敏感資料設定獨立的存取控制、稽核紀錄與 retention policy
- 為 SSO certificate rotation、break-glass access 與 identity provider outage 準備程序
- `0.1` tag 的 infrastructure code 僅供歷史參考，不應未經審查就直接部署

<style>
  table {
    width: 100%;
  }

  table td,
  table thead th {
    padding: 0.25em 0.5em;
  }

  table td {
    text-wrap: balance;
    word-wrap: anywhere;
  }
</style>
