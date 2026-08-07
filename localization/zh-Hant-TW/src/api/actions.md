# 處理 Actions

Coop 透過自動 Rule、Review Console 內容審查員 Decision，或使用者超過 User Strike 門檻而觸發 Action 時，會對該 Action 所設定的 callback URL 傳送 POST request。平台 server 收到 request 後，再執行對應操作。

## 設定 callback endpoint

在 Coop 定義每個 Action 時，需提供公開可存取的 callback URL，以及 endpoint 所需的 authentication headers，例如由 Coop 傳送的 API key。Coop 會在傳送至該 endpoint 的每個 request 加入這些 headers。

若要確認新進 request 確實由 Coop 傳送，請檢查 `Coop-Signature` header。Signature verification algorithm 與程式碼範例見英文版 [API Keys & Authentication](https://roostorg.github.io/coop/latest/development/api-auth.html#verifying-incoming-requests-from-coop)。

傳送失敗時，Coop 會使用 exponential backoff，最多重試五次。

> **重要實作要求**
> Callback 可能因 timeout、網路中斷或 response 遺失而重複傳送。平台必須使用穩定的事件識別或業務條件，將 Action handler 設計為冪等。驗證 `Coop-Signature` 失敗時不得執行 Action，也不得只以來源 IP 取代簽章驗證。

## Request body

```json
{
  "item": { "id": "item-id", "typeId": "item-type-id" },
  "action": { "id": "action-id" },
  "policies": [{ "id": "policy-id", "name": "Spam", "penalty": "MEDIUM" }],
  "rules": [{ "id": "rule-id", "name": "Spam detector" }],
  "custom": {},
  "actorEmail": "moderator@example.com",
  "creator": { "id": "user-id", "typeId": "user-type-id" },
  "decisionReason": "Violated spam policy",
  "userStrikeCount": 3
}
```

### Field 參考

| Field | Type | 是否固定存在 | 說明 |
| :--- | :--- | :--- | :--- |
| `item` | Item | 一律存在 | 應執行此 Action 的 Item |
| `action` | Action | 一律存在 | 正在觸發的 Action |
| `policies` | Array\<Policy\> | 一律存在 | 與此 Action 相關的 Policies。多個 Rules 觸發相同 Action 時，可能包含多筆 |
| `rules` | Array\<Rule\> | 不一定 | 觸發此 Action 的 Rules。由人工審查或批次處置觸發時為空 |
| `custom` | Object | 不一定 | 在 Action 表單 Body 中設定的自訂參數。對遭檢舉 Item 的 Review Console Decision，Coop 也會將 `reason` 與 `reportHistory` 合併至此 Object，見下方 Custom Object |
| `actorEmail` | String | 不一定 | 執行 Action 之 Coop 使用者的 email。自動 Rule 觸發時省略 |
| `actorNote` | String | 不一定 | 內容審查員執行 Action 時加入的 note，未填寫時省略 |
| `creator` | ItemIdentifier | 不一定 | Action 所涉及的使用者。`USER` Item 使用目標本身，`CONTENT` Item 使用內容作者。無法解析 creator 時省略，例如只有 content ID 且沒有已知 submission |
| `decisionReason` | String | 不一定 | 內容審查員從 Review Console 或 Submit Decision API 提供的 Decision reason。Review Console Decision 有填寫 reason 時存在，其他情況省略 |
| `userStrikeCount` | Number | 不一定 | 此 Action 後使用者的累計違規分數，包括既有分數及本次事件加入的分數。無法解析目標使用者時省略 |

**Item schema**

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `id` | String | 平台為 Item 使用的唯一識別碼 |
| `typeId` | String | Item Type ID |
| `typeName` | String | Item Type 顯示名稱 |

**Policy schema**

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `id` | String | Coop 唯一 Policy ID |
| `name` | String | Policy 名稱 |
| `penalty` | String | Penalty level，可為 `NONE`、`LOW`、`MEDIUM`、`HIGH` 或 `SEVERE` |

**Rule schema**

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `id` | String | Coop 唯一 Rule ID |
| `name` | String | Rule 名稱 |

**Custom Object**

除了在 Body 中設定的參數，對**遭檢舉** Item 作成 Review Console Decision 時，Coop 也會將下列資訊合併至 `custom`。Decision reason 同時出現在頂層 `decisionReason` Field，因此會在兩處出現。

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `reason` | String | 內容審查員的 Decision reason，與頂層 `decisionReason` 相同 |
| `reportHistory` | Array\<Report\> | 對 Item 提出的 Reports，每筆格式為 `{ reason, reporter }` |

### User Strikes

使用者累計違規分數超過設定門檻時，Coop 會使用相同 callback 機制，執行與該門檻關聯的 Action。與 Rule 觸發 callback 的差異如下。

- `policies` 一律為空 Array，因為門檻依累計分數觸發，不代表此次 request 的特定 Policy 違規
- `rules` 一律為空 Array，沒有 Rule 直接觸發 callback
- `actorEmail` 與 `actorNote` 一律不存在，因為沒有人工執行者

User Strikes、門檻及關聯 Actions 的設定方式，見使用者指南的 [User Strikes](../user/automated-enforcement.md#使用者違規次數)。

## Appeal Decision callback

內容審查員在 Review Console 審查 Appeal 並作成 Decision 後，Coop 會對 Appeals Dashboard 設定的 Appeal callback URL 傳送 POST request。

```json
{
  "appealId": "your-appeal-id",
  "item": { "id": "item-id", "typeId": "item-type-id" },
  "appealedBy": { "id": "user-id", "typeId": "user-type-id" },
  "appealDecision": "ACCEPT",
  "custom": {}
}
```

### Appeal callback Field 參考

| Field | Type | 是否固定存在 | 說明 |
| :--- | :--- | :--- | :--- |
| `appealId` | String | 一律存在 | 平台內部 Appeal ID，與透過 Appeal API 傳送的值相同 |
| `item` | Item | 一律存在 | 原本遭執行內容治理 Action 的 Item |
| `appealedBy` | ItemIdentifier | 一律存在 | 提交 Appeal 的使用者 |
| `appealDecision` | String | 一律存在 | `ACCEPT` 代表原始 Action 不正確並接受 Appeal，`REJECT` 代表維持原始 Action |
| `custom` | Object | 不一定 | Appeal Configuration Form 的 Body 中設定的自訂參數 |

完整 Appeal submission 流程見[申訴](../user/appeals.md)。

## 安全、隱私與可靠性提醒

- 驗證簽章時應使用原始 request body、常數時間比較與允許的 timestamp 偏差，並防止舊 request replay。確切演算法仍以 Coop authentication 文件與實作為準
- `actorEmail`、`decisionReason`、`actorNote` 與 `reportHistory` 可能包含個人資料、敏感內容或內部判斷，callback endpoint 應採最低權限、加密傳輸、欄位最小化與受控 logging
- Callback URL 與 headers 由管理設定提供，應限制可接受目的地，避免錯送 secrets，並防範 server-side request forgery
- 平台應在成功完成 Action 後才回傳 `2xx`。若採非同步處理，需先可靠寫入自己的 Queue，再回傳成功
- Appeal `ACCEPT` 後，平台仍需確認反向 Action 成功、更新使用者狀態並傳送結果通知，不能只記錄 callback

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
