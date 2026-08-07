# Zentropi CoPE

[Zentropi CoPE](https://docs.zentropi.ai)（Content Policy Enforcement）是可依 Policy 調整的 AI 文字分類器。不同於使用固定分類的分類器，CoPE 沒有預先定義類別。使用者自行撰寫希望偵測內容的 Policy 文字，model 再依這些 Policy 分類內容。對於具有細緻或特殊內容規範，且一般現成分類器難以處理的平台，這項特性特別實用。

此英文來源版本記載，整合使用的 model 是 **CoPE-A-9B**，版本 1.x，於 2025 年 7 月發布。

## 要求

- 具有 API 存取權的 [Zentropi](https://docs.zentropi.ai) 帳號
- 在 Zentropi 使用者介面建立一個或多個 labeler version，每個都需包含 Policy 定義

## 設定

在 Coop 前往 **Settings → Integrations**，加入 Zentropi 憑證。

- **API Key**：Zentropi API key
- **Labeler Versions**，選填：在 Zentropi 使用者介面建立的 labeler version ID 與標籤清單。加入後，建立 Rule 時可直接依名稱選用

## Signals

在 Zentropi 使用者介面建立的每個 labeler version，都會成為 Coop 的獨立 Signal。建立 Rule 條件時，選擇 Zentropi Signal，並在 **subcategory** 欄位輸入 labeler version ID。

Coop 將文字 Field 值送至 Zentropi API，並取得 0 至 1 的分數。

- **0** 代表 model 有信心內容安全，也就是不違反 Policy
- **0.5** 代表不確定
- **1** 代表 model 有信心內容違反 Policy

此分數可搭配 Rule 條件中的任一比較運算。例如，使用 `score > 0.8`，只在高信心違規時觸發。

### 撰寫 Policy

Zentropi 分類器在 Policy 定義採用下列結構時，表現最佳。

1. **Overview**：Policy 主題簡介
2. **Definition of Terms**：精確定義關鍵詞語與片語
3. **Interpretation of Language**：說明如何處理模糊語言
4. **Definition of Labels**：標籤包含與排除的範圍

Zentropi 文件與[範例程式碼 notebook](https://colab.research.google.com/drive/1LBmQ3d0OVrq2EpVP0tc03POalf3sDpjl?usp=sharing)詳細說明 Policy 撰寫方式。

## 限制

- **只支援文字**：整合只分類文字 Fields，不支援圖片與影片
- **8,000 token 限制**：超過 8K tokens 的文字會遭截斷
- **只支援美式英文**：其他語言與地區的效能會顯著降低
- **二元分類**：每個 labeler version 回傳「violating」（1）或「not violating」（0）與信心分數，不提供中間類別或多標籤 output
- **Policy 設計會影響結果**：model 無法分類需要外部查證的內容，例如連結是否惡意。訓練資料偏誤可能影響不同人口群體的分類模式，應定期監測及稽核 Decision

## Model Card

| 欄位 | 英文來源所列資訊 |
| --- | --- |
| **Model** | CoPE-A-9B |
| **Version** | 1.x |
| **Release date** | 2025 年 7 月 20 日 |
| **Training data** | 約 60,000 個獨特 Policy／內容組合標籤，混合自動與人工標註，涵蓋仇恨言論、性內容、自傷、騷擾與毒性 |
| **Annotation methodology** | 針對 Policy 解釋而非記憶的新式訓練方法，使用互相衝突的 Policy 表述訓練 |
| **Performance** | Hate Speech 91%（內部）、84%（公開 Ethos benchmark）；Sexual Content 89%；Toxic Speech 90%；Self-Harm 88%；Harassment 73% |
| **Compared to** | 英文來源宣稱在多數類別優於 GPT-4o、Llama-3.1-8B、LlamaGuard3-8B 與 ShieldGemma-9B |

## 連結

- [Zentropi 文件](https://docs.zentropi.ai)
- [Hugging Face model card](https://huggingface.co/zentropi-ai/cope-a-9b)
- [研究演講](https://www.youtube.com/live/JMq49FZ5qmY?si=Q6qpHNeTo-Bc6t9a&t=1)
- [範例程式碼 notebook](https://colab.research.google.com/drive/1LBmQ3d0OVrq2EpVP0tc03POalf3sDpjl?usp=sharing)

## 台灣使用提醒

本 model 明確標示只支援美式英文，不應用於繁中自動處置。Model card 中的效能數值與比較屬英文來源所載結果，尚未在本翻譯工作中獨立驗證，也不代表台灣繁中內容表現。即使未來有繁中 model，也需要以在地 Policy、代表性資料、不同群體與實際誤判成本重新評估。
