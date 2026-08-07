# 兒少安全（NCMEC）

> **重要適用提醒**
> 本頁翻譯 Coop 與美國 National Center for Missing & Exploited Children（NCMEC）CyberTipline 的產品工作流程。內容不構成台灣法律意見，也不代表台灣平台可直接依相同步驟履行通報義務。啟用前需要由具資格的法律與兒少安全專業人員，確認組織資格、證據與資料處理、通報對象、時限、保存、跨境傳輸及審查員保護。

Coop 支援透過 [CyberTipline Reporting API](https://report.cybertip.org/ispws/documentation)，向美國 [National Center for Missing & Exploited Children（NCMEC）](https://www.missingkids.org/)通報兒少性虐待素材（CSAM）。Coop 處理完整的偵測、路由與通報生命週期，包括自動標記已知或疑似 CSAM、送至專用 NCMEC 審查 Queue，並引導審查員完成 CyberTip 提交。

設定方式見英文版 [NCMEC 整合文件](https://roostorg.github.io/coop/latest/integrations/ncmec.html)。

## 存取權與角色

由於 NCMEC 資料高度敏感，Coop 只允許 Admin、Moderator Manager 與 Child Safety Moderator 角色存取。

## 內容如何進入 NCMEC Queue

內容可透過四種方式進入 NCMEC 審查 Queue。

1. **雜湊比對（HMA）**：Coop 透過 [Hasher-Matcher-Actioner（HMA）](https://roostorg.github.io/coop/latest/integrations/hma.html)整合，將上傳媒體與 NCMEC 的已知 CSAM 雜湊資料庫比對。雜湊符合是強而可靠的 Signal

2. **新出現的 CSAM 偵測（Content Safety API）**：對於沒有已知雜湊的內容，Coop 整合 Google Content Safety API，分類圖片是否可能為 CSAM。高信心結果可直接送至 NCMEC Queue，也可先送至初步分類 Queue

3. **標記為 CSAM 的新進 Report**：平台傳送標記為 CSAM 的使用者 Report 至 Coop 時，Coop 會直接送至 NCMEC Queue，不評估一般 Routing Rules

4. **人工升級**：在任何審查 Job 中，具有 NCMEC 存取權的內容審查員都可從 Action 清單選擇 **Enqueue to NCMEC**，立即將 Job 移至 NCMEC Queue

設定方式見英文版 [Routing Content to NCMEC](https://roostorg.github.io/coop/latest/integrations/ncmec.html#routing-content-to-ncmec)。

### 內容進入 Queue 後的處理

內容透過上述任一路徑進入 NCMEC Queue 後，Coop 會進行下列步驟。

1. 透過內容 Item 的 `creatorId` 欄位辨識相關**使用者**。若 Item 本身是 User Type，則直接使用該 Item
2. 檢查該使用者是否已有開啟中的 NCMEC Job。若有，加入新內容並更新，不建立重複 Job
3. 取得平台上曾與該使用者關聯的**所有媒體**
4. 建立單一彙整 NCMEC 審查 Job，包含使用者及其所有媒體
5. 將 Job 送至已設定的 NCMEC Queue

以使用者為中心的彙整方式，會讓同一位使用者即使上傳多項 CSAM，也只建立一個 NCMEC 審查 Job，並向 NCMEC 提交一份較具行動價值的 CyberTip，不會為每項內容分別提交。

> **資料範圍提醒**
> 「取得所有媒體」可能大幅擴張審查與跨境傳輸的資料範圍。實際採用時應確認是否具有適當權限與必要性、哪些媒體可納入、失敗或誤標時如何停止，以及未送出資料如何隔離與刪除。

## 審查 NCMEC Job

NCMEC Job 使用者介面與標準審查 Job 不同，設計重點是使用者及與其相關的全部媒體。

![NCMEC Reporting Job 檢視，顯示使用者的彙整媒體、industry classification 鍵盤快速鍵、incident type 下拉選單，以及每項媒體的標籤選擇器。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/ncmec-job.png)

### Incident Type

從 NCMEC CyberTipline 定義的類別中選擇適用 incident type。下列英文名稱應依 API 類別原樣使用。

- `Child Pornography`，持有、製作與散布
- `Child Sex Trafficking`，兒少性販運
- `Child Sex Tourism`，兒少性觀光
- `Child Sexual Molestation`，兒少性侵害
- `Misleading Domain Name`，誤導性網域名稱
- `Misleading Words or Digital Images on the Internet`，網路上的誤導性文字或數位影像
- `Online Enticement of Children for Sexual Acts`，在線上引誘兒少從事性行為
- `Unsolicited Obscene Material Sent to a Child`，未經要求傳送給兒少的猥褻素材

### Industry Classification

對每項通報媒體套用由 ESP 指定的 [industry classification](https://technologycoalition.org/wp-content/uploads/Tech_Coalition_Industry_Classification_System.pdf)。

| 分類 | 說明 |
| --- | --- |
| **A1** | 青春期前兒少，露骨性行為 |
| **A2** | 青春期前兒少，非露骨裸露或性姿勢 |
| **B1** | 青春期兒少，露骨性行為 |
| **B2** | 青春期兒少，非露骨裸露或性姿勢 |

審查介面提供鍵盤快速鍵，以加快分類速度。

### File Annotations

對個別媒體套用一個或多個標籤，向 NCMEC 提供更多脈絡。欄位名稱屬於資料交換值，不應翻譯或修改。

| 標籤 | 說明 |
| --- | --- |
| `animeDrawingVirtualHentai` | 檔案呈現動漫、卡通、虛擬或 hentai 內容 |
| `potentialMeme` | 檔案看似因模仿或其他表面上非惡意意圖而分享 |
| `viral` | 檔案正在使用者之間快速流傳 |
| `possibleSelfProduction` | 檔案可能是自行製作 |
| `physicalHarm` | 檔案呈現蓄意造成身體傷害或創傷的行為 |
| `violenceGore` | 檔案呈現寫實暴力或殘酷內容 |
| `bestiality` | 檔案涉及動物 |
| `liveStreaming` | 內容上傳時正在直播 |
| `infant` | 檔案呈現嬰兒 |
| `generativeAi` | 檔案可能由 AI 生成 |

### 提交 CyberTip

完成必要數量的媒體審查並選擇 incident type 後，選擇 **Submit to NCMEC**。Coop 會自動建立並提交 CyberTip，包括取得補充中繼資料、上傳媒體檔案，以及向 NCMEC 完成報告。技術細節見英文版 [CyberTip Submission Flow](https://roostorg.github.io/coop/latest/integrations/ncmec.html#cybertip-submission-flow)。

傳送前必須審查的媒體數量，由組織設定 **Media review requirement** 控制，位置在 Settings → NCMEC Settings。

- **Review all media**，預設值：傳送前必須對帳號上的每項媒體作成 Decision，這是原本的行為
- **Require a minimum number of reviewed media**：只需分類已設定的最低項目數，可避免為了通報相關項目而審查數百項媒體

兩種情況都至少要有一項媒體被指定通報類別，不能全部是 `None`，才能傳送 Report。

## 查看已提交 Report

CyberTip 提交後，Report 會保存在 Coop，並可從 NCMEC Reports 資訊儀表板存取。Report 紀錄包含下列資訊。

- NCMEC 指派的 Report ID
- 遭通報的使用者
- Report 包含的所有媒體
- 完整 CyberTip XML
- 已上傳的所有補充檔案
- 已上傳的所有對話 Thread CSV
- 提交的是測試 Report 或正式 Report

## 審查與治理要求

- 本頁目前狀態為 `translated`，尚未完成法律與兒少安全領域審查
- 真實 CSAM 不應用於一般翻譯、介面測試、教學截圖或開發環境驗證
- 應為內容審查員提供專門訓練、最小化暴露、身心健康保護、事件升級與事後支持
- 測試與正式環境必須明確分離，並防止測試操作誤送正式通報
- API 傳送成功不等同於已完成所有台灣通報、證據保存、使用者處置或受害者保護責任
