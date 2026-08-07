# API 參考

本節介紹 Coop API，包括平台用來與 Coop 整合的 REST API endpoints。

所有 endpoints 都要求每次 request 透過 HTTP header 傳送 API key。

```http
X-API-KEY: <<apiKey>>
Content-Type: application/json
```

您可以從 Coop 使用者介面的 **Settings** → **API Keys** 查找或輪替 API key。驗證 Coop 加在外送 webhook request 上的 signature，見 [API Keys 與 Authentication](../development/api-auth.md)。

| Endpoint | 說明 |
| :--- | :--- |
| `POST /api/v1/items/async/` | [Items](items.md)，傳送內容供 Rule 評估 |
| `POST /api/v1/report` | [Report](report.md)，提交使用者檢舉 |
| `POST /api/v1/report/appeal` | [Appeal](appeal.md)，提交使用者申訴 |
| `GET /api/v1/policies/` | [Policies](policies.md)，取得已設定的 Policies |

另請參閱下列文件。

- [處理 Actions](actions.md)，接收 Coop 對自動 Action、內容審查員 Decision、使用者違規門檻及申訴 Decision 送出的 webhooks
- [Partial Items API](partial-items.md)，讓 Coop 可依需要取得 Item 及其屬性
- [Errors](errors.md)，了解 Coop error response

## 安全提醒

API key 應由 server-side secret 管理機制提供，不得放入前端、公開文件、issue、log 或版本控制。應為不同環境使用不同金鑰、限制存取、建立輪替與撤銷程序，並監控異常 request。
