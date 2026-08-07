# Signals

Signals 是 Coop 發揮功能的關鍵。您可以用 Signal 分析 **Item** 並判斷其特徵。Signal 可以只是檢查關鍵字，也可以複雜到將 Item 交給大型語言模型或其他 AI 模型處理。Signal 接收 Item，輸出可用於自動化內容治理決策的資訊。

Coop 提供可在 Rule 中使用的 Signals 函式庫，各 Signal 都能調整嚴格或寬鬆程度。例如，主要服務兒童的平台可能希望阻止任何裸露或性內容，因此可建立 Rule，選用裸露分類器等偵測裸露的 Signals。若裸露分類器 Signal 對使用者個人圖片給出 95% 分數，也就是判斷圖片含裸露內容的可能性為 95%，Rule 就可能自動停權該使用者。

使用 Signal 的流程如下。

1. **設定整合**：管理員加入外部服務的 API 憑證
2. **在 Rules 中使用 Signal**：在內容治理規則中引用 Signal
3. **內容評估**：提交內容時呼叫 Signal 並取得分數
4. **執行 Action**：分數超過門檻時，執行 Rule 所設定的 Action

Signals 函式庫包含文字分析、地點比對與第三方 API 整合。

## 文字分析

Coop 提供多種分析文字的 Signals。

1. **精確關鍵字比對**：在內容中尋找完全相同的詞語或片語

2. **正規表示式比對**：使用[正規表示式](https://zh.wikipedia.org/zh-tw/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)在 Item 中尋找文字模式

3. **文字變體比對**：Coop 提供偵測常見文字字串變體的演算法，特別適合找出使用 [leetspeak](https://en.wikipedia.org/wiki/Leet)、替換字元、在字詞中加入標點符號或以其他方式規避處置的惡意行為者。例如，尋找 `Hello` 時，也會將 `h3||0` 與 `helllllllloooo` 判定為符合

## 地點比對

您可以建立針對特定地點的 Rule。要使用地點比對，傳送至 Coop 的每個 Item 都需要包含 [geohash](https://en.wikipedia.org/wiki/Geohash)，代表建立該 Item 之使用者的經緯度位置。接著建立只對特定地點內或附近 Item 採取 Action 的 Rule。也可建立包含 geohash 位置的 Matching Bank，以便在同一處管理大量地點。

## 第三方整合

按一下即可連接 Google Content Safety API、OpenAI Moderation API 與 Zentropi CoPE 等安全服務 API。Coop 已內建多種整合，只需輸入 API 金鑰。每項整合都有 model card，以一致且可比較的方式說明運作方式。

詳細資訊見[整合文件](../integrations/)。

## 自訂整合

部署 Coop 的平台可以透過自訂整合加入任何 Signal，例如自建機器學習模型，或使用 Coop 無法直接存取的內部資料。詳細資訊見[自訂整合](../integrations/custom.md)。

## 台灣使用提醒

- Signal 分數是模型或規則輸出，不代表事實或法律判定。自動採取刪除、停權等高影響 Action 前，應評估誤判、偏誤與人工複核安排
- 裸露分類器等模型未必以台灣繁中內容或在地脈絡驗證，翻譯文件不構成效能證明
- 地點比對與外部 API 可能涉及個人資料及跨境傳輸，應依實際資料流向另行評估
