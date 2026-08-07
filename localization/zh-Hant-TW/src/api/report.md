# Report API

將使用者檢舉提交至 Coop。平台收到使用者標記後，透過此 API 傳送，在 Review Console 建立內容治理 Job。

Coop 如何處理 Report、Routing Rules 與 NCMEC 的完整流程，見[檢舉](../user/reports.md)。

## Endpoint

```http
POST /api/v1/report
```

驗證使用 `X-API-KEY` header。詳情見 [API Keys 與 Authentication](../development/api-auth.md)。

## Request

```json
{
  "reporter": {
    "kind": "user",
    "typeId": "reporter-user-type-id",
    "id": "reporter-user-id"
  },
  "reportedAt": "2024-01-15T10:30:00.000Z",
  "reportedForReason": {
    "policyId": "violated-policy-id",
    "reason": "Free-text reason from reporter",
    "csam": false
  },
  "reportedItem": {
    "id": "reported-item-id",
    "data": { "fieldName": "value" },
    "typeId": "item-type-id"
  },
  "reportedItemThread": [
    {
      "id": "thread-message-1",
      "data": { "content": "message content" },
      "typeId": "message-type-id"
    }
  ],
  "reportedItemsInThread": [
    { "id": "specific-reported-message", "typeId": "message-type-id" }
  ],
  "additionalItems": [
    { "id": "additional-context-item", "data": {}, "typeId": "item-type-id" }
  ]
}
```

### Request body Fields

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `reporter` | Reporter | 必要 | 提交 Report 的使用者 |
| `reportedAt` | Datetime | 必要 | Item 遭檢舉時間的 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp |
| `reportedItem` | ReportedItem | 必要 | 遭檢舉的 Item |
| `reportedItem.data.images` | Array | 選填 | URL strings 的 Array，會觸發自動 [HMA 圖片雜湊](../integrations/hma.md) |
| `reportedForReason` | ReportedForReason | 選填 | Item 遭檢舉的原因 |
| `reportedItemThread` | Array\<ReportedItem\> | 選填 | 同一 Thread 中的其他 Items，例如私訊 Thread 中的前後訊息。Coop 用來向內容審查員顯示完整脈絡 |
| `reportedItemsInThread` | Array\<ItemIdentifier\> | 選填 | `reportedItemThread` 中明確遭檢舉的 Items，會在審查使用者介面標記 |
| `additionalItems` | Array\<ReportedItem\> | 選填 | 與 Report 一起顯示的補充內容，例如作者近期貼文 |

**Reporter schema**

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `kind` | String | 必要 | 檢舉實體類型，目前只支援 `"user"` |
| `id` | String | 必要 | 平台對檢舉使用者使用的唯一識別碼 |
| `typeId` | String | 必要 | 從 Item Types 資訊儀表板設定的檢舉使用者 Item Type ID |

**ReportedItem schema**

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `id` | String | 必要 | 平台對遭檢舉 Item 使用的唯一識別碼 |
| `typeId` | String | 必要 | 遭檢舉 Item 的 Item Type ID |
| `data` | JSON | 必要 | Item payload，必須符合 Item Type 定義的 schema |

`reportedItemThread` 使用與 `ReportedItem` 相同的 schema，但不嚴格強制必要 Fields，以支援追溯取得資料。Thread Items 應包含 `datetime` Field，確保正確依時間排序。

**ItemIdentifier schema**

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `id` | String | 必要 | 平台對 Item 使用的唯一識別碼 |
| `typeId` | String | 必要 | Item 的 Item Type ID |

**ReportedForReason schema**

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `policyId` | String | 選填 | 若檢舉者選擇的原因已對應 Policy，填入違反 Policy 的 ID |
| `reason` | String | 選填 | 檢舉者說明提交原因的自由格式文字 |
| `csam` | Boolean | 選填 | 設為 `true` 時，Coop 將 Job 直接送至 NCMEC Queue，不進入預設審查 Queue |

## Response

成功時回傳由 Coop 指派的唯一 Report ID。

```json
{ "reportId": "report-uuid" }
```

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `reportId` | String | Coop 指派給 Report 的唯一 ID |

HTTP statuses 如下。

| Status | 意義 |
| :--- | :--- |
| `201 Created` | 已收到 Report，回傳 `reportId` |
| `400 Bad Request` | 驗證失敗，見 [Errors](errors.md) |
| `401` 或 `403` | 驗證失敗 |

完整 error response 格式見 [Errors](errors.md)。

## 資料與路由提醒

- `reportedItemThread` 與 `additionalItems` 會擴大內容審查員可見資料。只應提供判斷必要的前後文，不要預設傳送整個私訊歷程或作者全部近期內容
- `reason` 可能含誹謗、威脅、健康、性或其他敏感資訊，應限制長度、處理惡意輸入，並避免顯示給無關人員
- `csam: true` 會略過一般 Routing Rules 並進入高敏感工作流程。平台應限制哪些檢舉原因與系統可設定此值，並監測誤用
- `201 Created` 代表 Report 已建立，不代表內容違規、已完成審查或已向任何機關通報
