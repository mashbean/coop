# OpenAI Moderation API

Coop 整合 [OpenAI moderation endpoint](https://platform.openai.com/docs/guides/moderation)，依有害內容類別分類文字。英文來源記載 moderation endpoint 可免費使用，導入前仍應重新確認目前服務條款與價格。

## 要求

- 具有 API 存取權的 [OpenAI](https://platform.openai.com) 帳號

## 設定

在 Coop 前往 **Settings → Integrations**，加入 OpenAI API key。

## Signals

每種有害內容類別都會成為 Coop Signal 函式庫中的獨立 Signal。所有 Signals 都回傳 0 至 1 的分數，可作為 Routing Rules 與 Proactive Rules 的條件門檻。

| Signal | 偵測內容 |
| --- | --- |
| Hate | 針對受保護特徵群體表達仇恨的內容 |
| Hate (threatening) | 同時包含威脅或暴力語言的仇恨內容 |
| Self-harm | 描繪、鼓勵或提供自傷指示的內容 |
| Sexual | 露骨性內容 |
| Sexual (minors) | 涉及未成年人的性內容 |
| Violence | 描繪或美化暴力或身體傷害的內容 |
| Violence (graphic) | 寫實或血腥暴力內容 |

Coop 也提供 OpenAI Whisper 轉錄 Signal，可將音訊內容轉為文字，再交由文字 Signals 進行後續分析。

## Models

Coop 呼叫 `/v1/moderations` endpoint 時不固定 model 版本，因此 OpenAI 會套用當時的預設 model。此英文來源版本記載預設值為 `omni-moderation-latest`。若 OpenAI 變更預設值，Coop 行為也會自動跟著改變。

## 限制

- 分數是機率結果，並非確定判斷。請使用符合平台情境的門檻，並人工審查確認的正向結果
- `omni-moderation-latest` 支援圖片 input，但 Coop 目前的整合只傳送文字 Fields，圖片需要另外設定
- 不同語言與地區的效能可能不同，模型針對英文內容最佳化

## 台灣使用提醒

- 繁中內容應獨立建立測試集，評估不同書寫方式、語碼混用、諧音、反諷與在地脈絡，不能直接沿用英文門檻
- API key 不得放入 repository、issue、前端程式碼或公開截圖
- 傳送內容前應確認資料最小化、外部服務保存與使用方式、跨境傳輸，以及自傷與兒少內容的人工升級流程
- 未固定 model 版本會造成輸出隨供應商預設值變化。正式使用時應監測分數分布與決策結果的漂移
