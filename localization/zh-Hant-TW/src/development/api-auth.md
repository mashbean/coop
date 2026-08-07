# API Keys 與 Authentication

## 向 Coop 傳送 request

若要驗證傳送至 Coop 的 request，請在每一個 API request 加入含有組織 API key 的 HTTP header。你可以在 Coop UI 的 **Settings** → **API Keys** 查看或管理 API key。

Header 格式如下。

```
X-API-KEY: <<apiKey>>
Content-Type: application/json
```

你隨時可以在同一頁輪替 API key。輪替後，請更新所有仍使用舊 key 的應用程式或 script。

## 驗證來自 Coop 的 request

若要確認傳入 Action APIs 或其他 webhook 的 request 確實由 Coop 傳送，可以驗證 request signature。Coop 會簽署傳送至 endpoint 的每一個 HTTP request，並將 signature 放入 header。你需使用 **webhook signature verification key**，也就是 public key，驗證該 signature。

- **Webhook signature verification key** 顯示於 **Settings** → **API Keys** 的「Webhook Signature Verification Key」。需要時可在該處產生新 key。輪替後，請使用新的 public key 更新驗證邏輯。

### 使用 signature header 驗證 request

Coop 會將 signature 放在 `Coop-Signature` header，部分 client 會將名稱顯示為 `coop-signature`。驗證傳入 HTTP request 的步驟如下。

1. 使用 SHA-256 對 request body 進行 hash。輸入必須是未經處理的原始 request body bytes。
2. 對 `Coop-Signature` header 的值進行 Base64 decode，取得原始 binary signature。
3. 使用 public key 驗證 signature。Coop 使用 **RSASSA-PKCS1-v1_5** 與 **SHA-256**。以 public key 驗證 signature，並確認結果符合第一步取得的 hash。請使用程式語言提供的 cryptography library，例如 Web Crypto、OpenSSL 或標準 crypto package，執行 RSASSA-PKCS1-v1_5 驗證。

### 範例（JavaScript / Node）

```javascript
// Your public signing key in PEM format (from Settings → API Keys)
const pem = `-----BEGIN PUBLIC KEY-----
...your key...
-----END PUBLIC KEY-----`;

const pemHeader = '-----BEGIN PUBLIC KEY-----';
const pemFooter = '-----END PUBLIC KEY-----';
const publicKeyPem = pem.substring(
  pemHeader.length,
  pem.length - pemFooter.length,
);

const publicKeyBuffer = Buffer.from(publicKeyPem, 'base64');
const requestBodyBuffer = Buffer.from(req.body, 'utf8');
const signature = Buffer.from(req.headers['coop-signature'], 'base64');

const publicKey = await crypto.subtle.importKey(
  'spki',
  publicKeyBuffer,
  { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
  false,
  ['verify'],
);

const isValid = await crypto.subtle.verify(
  'RSASSA-PKCS1-v1_5',
  publicKey,
  signature,
  requestBodyBuffer,
);
```

請依 server 實際收到 request 的方式，調整 header 名稱（`coop-signature` 或 `Coop-Signature`）與 body encoding。

## 實作安全提醒

- 驗證時應使用 JSON parsing、字元編碼轉換或正規化前的原始 request body bytes
- Signature 驗證成功前，不得執行 Action 或處理 webhook 內容
- 目前文件中的 signature 格式沒有 timestamp 或 nonce。平台應以冪等 handler 與事件紀錄控制重試及 replay 造成的影響
- 輪替 webhook verification key 時，應事先設計過渡期、回復方式與失敗監測
- Log 不應記錄完整 API key、signature 或 request body
- 上線前應以實際 web framework 驗證 raw body 的取得方式，避免 middleware 預先改寫 body 而使驗證失敗
