# Google Content Safety API

Content Safety API 是 AI 分類器，會對傳送至服務的內容提供 Child Safety 優先順序建議。

## 要求

Content Safety API 使用者必須自行進行人工審查，才能決定是否對內容採取 Action，並遵守所在地適用的通報法律。

希望保護平台免受濫用的產業與公民社會第三方，可[申請 Content Safety API 存取權](https://protectingchildren.google/toolkit-interest-form/?roost-coop)。申請時請提及使用 Coop 審查工具。申請需經核准，並接受 Google 條款及細則。

Coop 目前支援透過 Google Content Safety API 分類下列檔案格式的圖片。

- BMP
- GIF
- ICO
- JPEG
- PNG
- PPM
- TIFF
- WEBP

## 回應

回應會包含五種優先順序中的一種。

| Priority ENUM |
| --- |
| VERY_LOW |
| LOW |
| MEDIUM |
| HIGH |
| VERY_HIGH |

優先順序愈高，圖片愈可能是虐待內容。然而，這只是一項指標，並非確認結果。**您必須一律進行人工審查，以確認內容並避免誤判。** 因此，這項 Signal 只能用於人工 Routing Rules，不能用於自動 Action Rules。

## 良好實務

- 為取得最佳效能，建議圖片解析度約為 640 × 480 像素，約 30 萬像素
- 圖片小於 30 萬像素時，請勿放大，因為放大會引入雜訊，也不會改善效能
- 圖片大於 30 萬像素時，可考慮縮小至 30 萬像素，預期不會降低效能
- 一般建議使用能維持品質的 codec 壓縮圖片，例如 WEBP 或品質 90 以上的 JPEG，以減少 request 大小

## 限制

- 一次最多可傳送 32 張圖片
- 圖片必須採用上述格式之一
- JSON body 總大小不得超過 10 MB
- **最大 QPS** 為 200

## 台灣使用提醒

- API 優先順序不能取代人工判斷、法律認定或通報決策
- 將疑似兒少性影像傳送至外部 API 前，應確認申請資格、服務條款、資料所在地、保存與再利用方式，以及是否允許傳送實際個案資料
- 一般功能測試應使用合成或經核准的安全測試素材，不得使用真實 CSAM 驗證整合
