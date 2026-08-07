# Partial Items API

讓 Coop 可從平台取得 [Item](../user/concepts.md#item) 及其詳細資訊。此 API 用於回填歷史資料、在 Review Console 取得尚未傳送至 Coop 的相關 Items，以及確保查看時使用最新 Item 資料。

## 設定 endpoint

若要使用此 API，平台必須提供可接收 Coop POST requests 的 Partial Items API endpoint。Coop 需要平台上特定 Item 的資訊時，會將該 Item 唯一 ID 傳送至此 endpoint。

若要確認新進 request 確實由 Coop 傳送，請檢查 `Coop-Signature` header。Signature verification algorithm 與程式碼範例見英文版 [API Keys & Authentication](https://roostorg.github.io/coop/latest/development/api-auth.html#verifying-incoming-requests-from-coop)。

> [!IMPORTANT]
> 依此英文來源版本，**尚無法從 Coop 使用者介面設定此功能**，必須從程式碼管理。詳情見 [roostorg/coop#378](https://github.com/roostorg/coop/issues/378)。

您需要在 Coop instance 程式碼設定 endpoint URL 與所有必要 headers，包括 API key 等其他 authentication，讓 Coop 可發出 HTTP requests。

## REST API 範例

以下是 Coop 會傳送至 endpoint 的 POST request 範例。

```sh
curl --request POST \
    --url https://your-platform.example.com/partial-items \
    --header 'Content-Type: application/json' \
    --header 'Coop-Signature: t=1234567890,v1=5f7d8e9...' \
    --data '{
        "items": [
            {
                "id": "abc123",
                "typeId": "def456"
            },
            {
                "id": "xyz789",
                "typeId": "def456"
            }
        ]
    }'
```

Request body 只有一個頂層 property `items`，是代表 Coop 需要補充資訊之 Items 的 Objects Array。使用 Array 是為了讓 Coop 可依需要，在單一 API request 中批次要求多個 Items。

`items` Array 中每個 Object 需包含下列 Fields。

| Property | Type | 說明 |
| :--- | :--- | :--- |
| `id` | `String` | 平台為 Item 使用的唯一識別碼 |
| `typeId` | `String` | 對應 Item 的 [Item Type](../user/concepts.md#item-type) ID，必須完全符合平台[已定義](../user/administration.md#item-types)的其中一個 Item Type ID |

## Response 要求

Endpoint 必須回傳 `2xx` status 及 JSON body，其中包含一個具有 `items` Array 的頂層 Object。可包含其他頂層 keys，但 Coop 會忽略，只處理 `items`。

`items` 中每個 entry 描述 Coop 所要求的其中一個 Item。平台可以回傳 Item 的 _partial_ 版本，`data` 只包含可取得的 Fields 子集，但下列 keys 必須存在且 type 正確。

| Property | Type | 必要性 | 說明 |
| :--- | :--- | :--- | :--- |
| `id` | `String` | 必要 | Coop 在 request body 提供的 `id` |
| `typeId` | `String` | 必要 | Coop 在 request body 提供的 `typeId` |
| `data` | `Object` | 必要 | 與 Items API 傳送內容相同的形狀。可為空 Object `{}`，但 key 必須存在 |
| `typeVersion` | `String` | 選填 | 指定目標 Item Type version |
| `typeSchemaVariant` | `"original" \| "partial"` | 選填 | 預設為 `partial` |

Response 範例如下。

```json
{
  "items": [
    {
      "id": "abc123",
      "typeId": "def456",
      "data": {
        "text": "some text uploaded by a user"
      }
    }
  ]
}
```

若找不到或無法回傳特定 Item，請從 `items` Array **省略**，不要回傳 error 或 sentinel value。Coop 不會把缺少 Item 視為失敗，只會沒有該 Item 的資料。Request 中沒有出現相同 `(id, typeId)` 的 Items 會被無聲捨棄。

另一種可接受的格式，是將 `typeId`、`typeVersion` 與 `typeSchemaVariant` 放在 `type` Object 中，分別使用 `id`、`version` 與 `schemaVariant`。新整合建議使用上述扁平格式，巢狀格式只為了與 Items API submission 形狀保持一致。

```json
{
  "items": [
    {
      "id": "abc123",
      "data": { "text": "..." },
      "type": {
        "id": "def456",
        "version": "2025-01-01",
        "schemaVariant": "partial"
      }
    }
  ]
}
```

## 疑難排解

Webhook logs 中有 request，但 Coop 內 Item 沒有更新時，使用者介面會顯示下列其中一種錯誤。

- **`PartialItemsEndpointResponseError`**：endpoint 回傳非 2xx status
- **`PartialItemsInvalidResponseError`**：body 可解析為 JSON，但不符合上述 schema，常見原因是缺少 `data`、頂層 `items` key，或 `id`／`typeId` 不是 string；也可能完全無法解析為 JSON。Body 解析失敗時，Coop server logs 會包含 response bytes 的短 prefix。最常見原因是重複寫入 response，例如 middleware 在 payload 前先寫入 sentinel，產生 `null{"items":[...]}`

Request 看似成功但 Item 仍未顯示時，請確認每個回傳 Item 的 `(id, typeId)` 與 Coop request 完全相同。不相符的資料會被無聲捨棄。透過 tunnel 測試時，例如 `localtunnel` 或 `ngrok`，請確認 tunnel 沒有以 browser warning page 取代 JSON response。

## 安全、隱私與可靠性提醒

- Partial Items endpoint 會依 Coop request 回傳平台資料。必須先驗證 `Coop-Signature`，再查詢或回傳 Item，並限制 request size、batch 數量與 rate
- 即使 Coop 要求某個 Field，平台仍應只回傳此次審查與 Rule 評估所需資料。`partial` 不代表可以略過目的限制與權限檢查
- Endpoint URL 與 authentication headers 目前由程式碼管理，不得硬編碼 secrets 或提交至版本控制。應透過環境變數或 secret manager 提供
- 無聲省略找不到的 Item 方便部分回應，但可能掩蓋權限錯誤或資料同步問題。平台應在不記錄敏感內容的前提下，監測省略比例與原因
- 回傳前應驗證 `(id, typeId)` 屬於要求範圍，避免物件層級授權錯誤。不可只依可猜測的 `id` 查詢
- 若 Item data 含媒體 URL、私訊、位置或帳號資料，應確認 URL 權限、有效期與 Review Console 實際可見角色
