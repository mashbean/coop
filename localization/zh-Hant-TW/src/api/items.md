# Submit Items API

將 [Item](../user/concepts.md#item) 傳送至 Coop，進行自動 Rule 評估。每次提交 Item，Coop 都會使用所有已設定的[主動式規則](../user/automated-enforcement.md#主動式規則)進行評估。

Item 建立、編輯、遭檢舉或需要重新評估時，都應提交。如果上線後才設定新 Rule，也應追溯提交既有 Item。若要讓 Coop 依需要取得 Item 及其屬性，見英文版 [Partial Items API](https://roostorg.github.io/coop/latest/api/partial-items.html)。

## Endpoint

```http
POST /api/v1/items/async/
```

驗證使用 `X-API-KEY` header。詳情見英文版 [API Keys & Authentication](https://roostorg.github.io/coop/latest/development/api-auth.html)。

## Request

```json
{
  "items": [
    {
      "id": "unique-item-id-123",
      "typeId": "your-item-type-id",
      "data": {
        "fieldName1": "value1",
        "fieldName2": 123
      }
    }
  ]
}
```

在 `items` Array 加入其他 Objects，即可於單一 request 提交多個 Items。所有處理皆為非同步。

### Request body Fields

| Field | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `items` | Array | 必要 | 要提交的一個或多個 Items |
| `items[].id` | String | 必要 | 平台為 Item 使用的唯一識別碼 |
| `items[].typeId` | String | 必要 | 從資訊儀表板設定之 Item 的 Coop Item Type ID |
| `items[].data` | Object | 必要 | Item payload。Fields 必須符合 Item Type 定義的 schema |
| `items[].data.images` | Array | 選填 | URL strings 的 Array，會觸發自動 [HMA 圖片雜湊](../integrations/hma.md) |
| `items[].typeVersion` | String | 選填 | 供 schema versioning 使用的 version string |
| `items[].typeSchemaVariant` | String | 選填 | Schema variant，有效值為 `"original"` 或 `"partial"` |

### `data` Fields 格式

`data` 的形狀必須符合 Item Type schema。常見 Field types 如下。

| Field type | 格式 |
| :--- | :--- |
| String | 一般 string value |
| Number | JSON number |
| Boolean | `true` 或 `false` |
| Image／Audio／Video | 指向媒體的 URL string |
| Geohash | Base-32 geohash string |
| Datetime | ISO 8601 string，例如 `"2024-01-15T10:30:00.000Z"` |
| Related Item | `{ "id": "...", "typeId": "..." }` object |

### 媒體存取

所有媒體 Fields，包括 image、audio 與 video，都以 URL references 提交。Coop 不會直接上傳或保存媒體內容。

Item 提交時，Coop 會立即取得每個媒體 URL，執行 HMA hashing、Content Safety analysis 等 Signal 處理。內容審查員開啟 Job 時，Coop 不會重新取得媒體，改由瀏覽器直接從原始 URL 載入。

Coop 以未驗證的 GET requests 取得媒體，不會將 API key 或其他憑證轉送至媒體 URL。

若媒體需要驗證或受存取控制，請使用 pre-signed URL，例如 S3 pre-signed URL。由於內容審查員可能在提交數小時或數天後才開啟 Job，瀏覽器會在審查時直接載入媒體，因此 pre-signed URL 必須在 Job 可能停留於 Queue 的完整期間內有效，不能只涵蓋提交時的 Signal 處理時間。

## Response

| Status | 意義 |
| :--- | :--- |
| `202 Accepted` | 已收到 Items，並排入 Rule 評估 Queue |
| `400 Bad Request` | 驗證失敗，見 [Errors](errors.md) |
| `401` 或 `403` | 驗證失敗 |

完整 error response 格式見 [Errors](errors.md)。

## 自動圖片雜湊

若 Item 的 `data` Object 包含由 URL strings Array 構成的 `images` Field，Coop 會自動進行下列步驟。

1. 從提供的 URLs 取得圖片內容
2. 為每張圖片計算感知雜湊
3. 與組織已設定的所有 [HMA Matching Banks](../integrations/hma.md)比對
4. 將產生的 HMA Signals 加入 Item，供[自動 Rules](../user/automated-enforcement.md)評估

## 注意事項

- **非同步處理**：此 endpoint 為大量非同步處理設計。Submission 會進入 Redis Queue，透過 BullMQ 交由 background workers 處理
- **立即結果**：實作若嚴格要求同步處理，也就是在相同 HTTP response 收到 Rule results，可使用舊版 `POST /api/v1/content/` endpoint。舊版 endpoint 不支援 batch submissions 或自動 HMA 圖片雜湊
- **Action Callbacks**：Rule 符合並觸發 Action 時，Coop 會對英文版所述 [Action callback endpoint](https://roostorg.github.io/coop/latest/api/actions.html)送出 POST request
- **基本概念**：Item Types 與 Coop 如何識別 Items，見[基本概念](../user/concepts.md)

## 安全與隱私提醒

- Pre-signed URL 有效期間愈長，遭轉寄或洩漏後的風險愈高。應限制可存取物件、HTTP method、來源、有效期與記錄，並在 Job 關閉後撤銷或失效
- 審查員瀏覽器會直接連接媒體來源，可能暴露網路 metadata，也可能受到不受信任檔案影響。媒體服務應使用隔離網域、正確 Content-Type、下載限制與惡意檔案防護
- `202 Accepted` 只表示進入 Queue，不代表 Rule 評估或 Action 已完成。平台應另行監測 background worker、失敗與 callback 結果
- 新 Rule 上線後追溯提交大量 Item 前，應先小批次測試成本、重複 Action、Rate limit 與復原方式
