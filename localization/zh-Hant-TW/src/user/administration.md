# 管理與設定

管理員從 **Settings** 選單管理組織設定，以及 [Item](#item-types)、[Action](#actions)、[Policy](#policies)、[使用者存取](#使用者管理)與整合的個別設定。

## Settings

在 **Settings** 設定組織資料與全組織行為，包括單一登入、申訴、Review Console、審查員身心健康等功能。許多可切換功能預設關閉，請依平台與團隊需要選擇啟用。

### Organization

Coop 組織的識別與聯絡資訊。

![Settings 資訊儀表板的 Organization 分頁，包含組織名稱、電子郵件、網站網址與值班警示電子郵件欄位。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-org.png)

On-Call Alert Email 需要在 Coop 部署中整合電子郵件服務。Coop 支援電子郵件服務整合，但不會預先設定服務。

### Single Sign-on

啟用以 SAML 為基礎的 SSO，讓使用者透過組織的身分提供者驗證，不使用電子郵件與密碼。Coop 支援任何 SAML 2.0 身分提供者。以 Okta 設定的範例，見部署指南的 [Single Sign-on](../development/deployment.md#single-sign-on)。

![Settings 的 SSO 分頁，顯示 SAML／SSO 啟用切換，以及 SSO URL 與 SAML Certificate 欄位。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-sso.png)

### Appeals

啟用使用者對 Coop Decision 提出申訴，並設定平台的申訴 callback URL、headers 與 body。

![Settings 的 Appeals 分頁，顯示啟用申訴的切換，以及 callback URL、headers 與 body 欄位。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-appeals.png)

### Review Console

設定組織內內容審查員使用 [Review Console](review-console.md) 的方式，包括內容審查員必要條件、Queue 管理行為與 webhooks。

![Settings 的 Review Console 分頁，包含 Require Policy、Require Decision Reason、Hide Skip Button、Enable Preview Jobs View 切換，以及 Ignore Callback URL 欄位。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-review-console.png)

### Wellness

設定 Review Console 顯示媒體時的審查員身心健康保護，包括模糊、灰階與靜音，以減少審查有害媒體時的暴露。

![Settings 的 Wellness 分頁，包含 Blur Media 滑桿、Greyscale 切換與 Mute Videos 切換。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-wellness.png)

### 其他

不適合歸入其他分頁的設定，包括 [Partial Items](../api/partial-items.md) 端點，以及讓 Job Decision 引用多項 Policy 的功能。

![Settings 的 Other 分頁，包含 Partial Items Endpoint、Partial Items Request Headers、Reporting Rules、Multiple Policies Per Action 與 User Strike TTL。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-other.png)

## Item Types

Item Type 代表平台上的不同實體類型。詳情見[基本概念的 Item Type](concepts.md#item-type)。

![Item Type 設定範例。從 firehose 取得貼文，Schema 包含傳送至 Coop 的文字、唯一 ID 與欄位格式。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/items.png)

建立 Item Type 時，請定義 Schema，指定要包含及顯示給內容審查員的 Fields。這些 Fields 也可用於 Rule 邏輯，連接 Signals 以進行路由或自動化。

## Actions

Action 代表 Proactive Rule 或內容審查員 Decision 可對 Item 執行的任何動作。詳情見[基本概念的 Actions](concepts.md#actions)。

![已設定的自訂 Action 表格，包括傳送警告、標記為垃圾內容、刪除內容、刪除帳號與封鎖電子郵件。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/actions.png)

Action 會與平台上的 API 端點配對。技術細節見[處理 Actions](../api/actions.md)。

![在 Coop 建立 Action，設定名稱、說明、可執行 Action 的 Item Type，以及 callback URL。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/define-action.png)

## Policies

Policy 是平台用來治理使用者行為的一組規則與指引。詳情見[基本概念的 Policy](concepts.md#policy)。

![Policy 資訊儀表板顯示 Fraud、Nudity、Scams 與 Spam 四項 Policy，並提供建立 Policy、加入子 Policy、編輯與刪除選項。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/policies.png)

從 Coop 使用者介面加入的 Policy，會直接顯示在 Review Console 的 [Job 檢視](review-console.md#job-檢視)，供內容審查員查閱。

## 使用者管理

Coop 使用角色式存取控制，確保只有適當的人員能存取相應資料。

![使用者管理頁面，顯示不同使用者的電子郵件、角色、核准狀態與建立日期。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/manage-users.png)

您可以從 **Settings** → **Users** 邀請使用者，複製邀請連結直接分享，或設定電子郵件服務自動寄送。

![使用者邀請流程。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/invite.png)

### Roles

Coop 內建七種預設角色，可直接對應多數團隊結構。

- **Admin**：管理整個組織，完整控制 Coop 內所有資源與設定
- **Rules Manager**：可建立、編輯及部署 Live Rules，執行 retroaction 與 backtests、查看 Rule insights、管理 Policies，以及使用 Investigation 工具和批次處置。無法管理使用者、Queues 或其他組織層級設定
- **Moderator Manager**：可查看及編輯 Review Console 內所有 Queues、管理內容審查員權限，以及使用 Investigation 工具和批次處置，也能查看兒少安全資料
- **Child Safety Moderator**：具有與 Moderator 相同的權限，另可審查 Child Safety Jobs 與查看先前 Child Safety Decisions
- **Moderator**：可存取 Review Console，但只能審查獲准查看之 Queue 中的 Job，無法查看任何兒少安全相關 Job 或 Decision
- **Analyst**：可修改及測試 Draft 和 Background Rules、執行 backtests，以及查看 Rule insights 與 Investigation 工具。無法建立或編輯 Live Rules、執行 Retroaction，或存取 Review Console
- **External Moderator**：只能審查 Review Console 中的 Job，無法查看任何 Decision 或使用其他工具

Admin 可從 **Settings** → **Users** → **Roles** 自訂任何角色。開啟角色卡片上的選單，即可編輯顯示名稱、說明與權限。個別權限依領域分組，包括組織管理、Rules、人工審查與 Investigation，可個別開啟或關閉。**View Permissions** 則會開啟矩陣，一次比較所有角色。

![Roles Management 分頁顯示七種預設角色的卡片，以及各角色名稱、說明、使用者數與權限數。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/role-management.png)

變更會立即套用至所有具有該角色的使用者。只有具有 **Manage Roles** 權限者能存取角色編輯器，Admin 預設具有此權限。

## API Keys

Coop 使用 API keys 驗證平台與 Coop 之間的 request。

### Coop API key

平台傳送 request 至 Coop 時，應在每次 request 中以 HTTP header 加入組織 API key。您可在 **Settings** → **API Keys** 查找或輪替金鑰。

```text
X-API-KEY: <<apiKey>>
Content-Type: application/json
```

若要確認 Action 端點收到的 request 確實由 Coop 傳送，請使用 **Settings** → **API Keys** 顯示的 webhook signature verification key。實作細節見開發指南的 [API Keys 與 Authentication](../development/api-auth.md)。

## 台灣使用提醒

- 角色與權限變更會立即生效。特別是兒少安全資料、批次處置、Live Rules、API keys 與角色管理，應遵循最低權限並定期複核
- 邀請連結、SAML certificate、API key 與 webhook verification key 都應視為安全敏感資訊，避免放入 issue、聊天紀錄、螢幕截圖或版本控制
- Callback URL、headers 與 body 可能包含 secrets 或個人資料，應使用加密傳輸、限制目的地並建立金鑰輪替及事件應變流程
- 「External Moderator」權限較少，但仍可能接觸遭檢舉內容。外部人員的契約、保密、訓練、身心健康與帳號撤銷程序仍需另行安排
