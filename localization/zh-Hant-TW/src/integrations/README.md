# 整合

Coop 可連接 Google Content Safety API、OpenAI Moderation API 與 Zentropi CoPE 等安全服務 API。Coop 已內建多種整合，設定時需輸入相應 API key。

> **服務狀態提醒**
> 下列費用、資格與服務條件來自本繁中版本所記錄的英文來源 commit，可能隨供應商政策調整。申請或導入前，請重新查閱供應商的官方條款、資料處理說明與最新價格。

## 內建整合

各項整合的詳細資訊與要求，請參閱對應文件。

| 整合 | 費用 | 要求 |
| --- | --- | --- |
| [Google Content Safety API] | 免費 | API key、Google 核准[^CSAPI] |
| [Hasher-Matcher-Actioner（HMA）] | 免費 | 自有雜湊，以及／或第三方 Hash Bank 存取權[^HMA] |
| [NCMEC Reporting] | 免費 | CyberTip API key、NCMEC 核准[^ESP] |
| [OpenAI Moderation API] | 免費[^OAI] | OpenAI API key |
| [Zentropi CoPE] | 免費，另有付費選項[^Z] | Zentropi API key |

[Google Content Safety API]: google-content-safety.md
[Hasher-Matcher-Actioner（HMA）]: hma.md
[NCMEC Reporting]: https://roostorg.github.io/coop/latest/integrations/ncmec.html
[OpenAI Moderation API]: https://roostorg.github.io/coop/latest/integrations/openai-moderation.html
[Zentropi CoPE]: https://roostorg.github.io/coop/latest/integrations/zentropi-cope.html

[^CSAPI]: 希望保護平台免受濫用的產業與公民社會第三方，可[申請 Content Safety API 存取權](https://protectingchildren.google/toolkit-interest-form/?roost-coop)。申請時請提及使用 Coop 審查工具。申請需經核准，並接受 Google 條款及細則。

[^HMA]: 使用自有 Hash Bank 不需額外憑證或授權，例如組織自行保存的已知違規內容集合。使用各第三方雜湊則需取得該組織授權。例如，NCMEC 需提供 Hash Sharing API 憑證，Tech Against Terrorism 也會管理其 Hash Bank 存取權。

[^ESP]: 需要完成 [NCMEC ESP registration](https://esp.ncmec.org/registration)，並經核准取得 CyberTip API 憑證。

[^OAI]: 依 [OpenAI 說明](https://help.openai.com/en/articles/4936833-is-the-moderation-endpoint-free-to-use)，Moderation API 免費，且不計入每月用量限制。

[^Z]: Zentropi 文字分類器可免費使用，目前採用開放授權的 [CoPE-A-9B 模型](https://huggingface.co/zentropi-ai/cope-a-9b)。API 支援自行建立的所有 labeler，包括免費及選用付費功能。詳情見 [Zentropi 價格說明](https://zentropi.ai/subscription)。

## Model cards

每項整合都有 model card，以一致且可比較的方式說明運作方式。Model card 是描述機器學習模型預定用途、行為與限制的短文件，可視為 AI 分類器的營養標示。

各整合的 model card 說明下列欄位。

| 欄位 | 說明 |
| --- | --- |
| **Purpose** | 模型設計要偵測或分類的內容 |
| **Input** | 模型接受的內容類型，例如圖片、文字或網址 |
| **Output** | 模型回應的格式與意義 |
| **Limitations** | 已知缺漏、失敗模式或難以處理的內容類型 |
| **Requirements** | 使用整合所需的存取、核准或設定 |
| **Best practices** | 取得可靠結果的建議 |

自動分類器都可能出錯。Model card 可協助判斷 Signal 在何種情況下可供參考、哪些結果需要人工審查，以及如何合理設定 Rule。
