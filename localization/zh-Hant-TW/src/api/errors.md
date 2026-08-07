# Errors

本頁說明 Coop 如何回應 API requests 與 errors。

## HTTP status codes

| Status | 意義 |
| :--- | :--- |
| `200 OK` | Request 成功，response body 包含資料 |
| `202 Accepted` | 已收到 Item submission，並排入非同步處理 Queue |
| `204 No Content` | Request 成功，沒有 response body，例如 Report 與 Appeal submissions |
| `400 Bad Request` | Request 無效，包括 JSON 格式錯誤、缺少必要 Fields 或 schema 不相符，例如 Report 引用不存在的 Item。詳情見 error body |
| `401` 或 `403` | 驗證失敗，API key 缺漏、無效或過期 |
| `429 Too Many Requests` | 超過 rate limit |
| `500` 或 `503` | Server 內部錯誤，通常是暫時性問題，可安全重試 |
| `502` 或 `504` | Gateway 或 dependency error，上游服務無法使用，請重試 |

## Error response 格式

所有 `4xx` errors 都會以下列格式回傳 JSON body。

```json
{
  "errors": [
    {
      "status": 400,
      "type": ["/errors/invalid-user-input"],
      "title": "Short error description",
      "detail": "Detailed explanation of the problem (optional)",
      "pointer": "/path/to/problematic/field (optional)",
      "requestId": "correlation-id (optional)"
    }
  ]
}
```

| Field | 說明 |
| :--- | :--- |
| `status` | HTTP status code |
| `type` | Error type identifiers 的 Array |
| `title` | 簡短、供人閱讀的摘要 |
| `detail` | 補充 error 脈絡，若有 |
| `pointer` | 指向造成 error 之 Field 的 JSON pointer，若適用 |
| `requestId` | 供 tracing 使用的 correlation ID |

## 整合提醒

- 對 `500`、`502`、`503`、`504` 與 `429` 重試時，應使用有上限的 exponential backoff 與 jitter，避免服務中斷時放大流量
- 只有具備冪等性，或平台使用唯一 request ID 防止重複處理的操作，才能安全自動重試
- 對外顯示錯誤時，不應暴露 secrets、內部 stack trace、個人資料或敏感 Item 內容
- 保存 `requestId` 可協助調查，但 log 仍應採資料最小化與存取控制
