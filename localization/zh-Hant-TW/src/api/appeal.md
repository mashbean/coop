# Appeal API

將使用者申訴提交至 Coop。使用者對平台的內容治理 Decision 提出異議時，透過此 API 傳送申訴，並在 Review Console 建立審查 Job。

申訴如何顯示、維持或推翻 Decision 的完整流程，見[申訴](../user/appeals.md)。內容審查員對申訴作成 Decision 後，Coop 會透過英文版 [Appeal Decision Callback](https://roostorg.github.io/coop/latest/api/actions.html#appeal-decision-callback)將結果傳送至平台。

## Endpoint

```http
POST /api/v1/report/appeal
```

驗證使用 `X-API-KEY` header。詳情見英文版 [API Keys & Authentication](https://roostorg.github.io/coop/latest/development/api-auth.html)。

## Request

```json
{
  "appealId": "platform-internal-appeal-id",
  "appealedBy": {
    "typeId": "appealer-user-type-id",
    "id": "appealer-user-id"
  },
  "appealedAt": "2024-01-15T12:00:00.000Z",
  "actionedItem": {
    "id": "item-that-was-actioned",
    "data": { "fieldName": "value" },
    "typeId": "item-type-id"
  },
  "actionsTaken": ["action-id-1", "action-id-2"],
  "appealReason": "User's explanation for why they are appealing",
  "violatingPolicies": [{ "id": "policy-id-1" }, { "id": "policy-id-2" }],
  "additionalItems": [
    { "id": "additional-context-item", "data": {}, "typeId": "item-type-id" }
  ]
}
```

### Request body Fields

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `appealId` | String | 必要 | 平台內部的 Appeal submission ID。內容審查員處理申訴時，會將此值傳回平台 |
| `appealedBy` | ItemIdentifier | 必要 | 提出申訴的使用者，包括平台內部 user ID 與該使用者的 Coop Item Type ID |
| `appealedAt` | Datetime | 必要 | 提交申訴時間的 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp |
| `actionedItem` | Item | 必要 | 原本遭執行 Action 的 Item |
| `actionsTaken` | Array\<String\> | 必要 | 已執行並送至 Action callback 的 Action Coop IDs |
| `appealReason` | String | 選填 | 使用者說明申訴原因的自由格式文字 |
| `violatingPolicies` | Array\<Policy\> | 選填 | 最初內容治理 Action 執行時，從 Action webhook 收到的 Policies |
| `additionalItems` | Array\<Item\> | 選填 | 與申訴一起顯示、提供脈絡的補充內容 |

## Response

| Status | 意義 |
| :--- | :--- |
| `204 No Content` | 已成功收到 Appeal |
| `400 Bad Request` | 驗證失敗，見 [Errors](errors.md) |
| `401` 或 `403` | 驗證失敗 |

完整 error response 格式見 [Errors](errors.md)。

## 資料與流程提醒

- `appealReason` 與 `additionalItems` 應限制為複核必要內容，不應把整個帳號或無關對話歷程一併提交
- `appealId` 應具唯一性，平台也應避免同一 Appeal 因重試而建立重複 Job
- Callback 成功後，仍需由平台向使用者提供結果、理由與後續救濟資訊，並正確處理原 Action 的反向操作
