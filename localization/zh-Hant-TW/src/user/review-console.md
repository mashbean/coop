# 人工審查與處置

**Review Console（審查主控台）** 是內容審查員處理遭檢舉內容並作成治理決策的地方。

## Queues

![五個 Queue 範例，包括媒體、預設 Queue、詐欺、詐騙與垃圾內容。畫面提供建立新 Queue、開始審查、刪除所有 Job，以及編輯或刪除個別 Queue 的按鈕。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/review-console.png)

Coop 使用 Queue 組織審查 Job。內容遭到檢舉後，無論來源是平台使用者或[主動式規則](automated-enforcement.md#主動式規則)，都會進入 Queue，直到完成審查並作成決策。

內容審查員在任一 Queue 選擇 **Start Reviewing** 即可開始。Coop 會先取出最早的 Job，作成決策後自動載入下一個，直到 Queue 清空或審查員停止。

兩位內容審查員不會收到同一個 Job，可避免重複工作。

每位使用者可將 Queue 加上星號並固定在 Review Console 頂端。每個 Queue 都會顯示待處理 Job 數量，以協助安排優先順序。

### 建立與編輯 Queue

內容審查員管理者與管理員可以為組織建立及編輯 Queue。

![在 Coop 建立 Queue，顯示名稱與隱藏動作欄位。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/create-queue.png)

建立或編輯 Queue 時，可設定 **Reviewer Access**，決定哪些內容審查員能存取及處理該 Queue 的 Job。**Hidden Actions** 則決定哪些 Action 不提供給這個 Queue 的審查員。這適合用來限制特定脈絡下可作成的決策，例如在第一輪分類 Queue 中隱藏永久停權。

[路由規則](automated-enforcement.md#路由規則)決定新進 Job 要送到哪個 Queue。

## Job 檢視

![Coop 的審查 Job，使用者資料已遮蔽。畫面顯示收到檢舉的時間、Item 類型、檢舉者與理由、Job 上的檢舉數量及貼文資訊。使用者可加入內部留言、查看政策所列處置指引、選擇決策，或略過 Job。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/task-view.png)

Queue 中的每個 **Job** 都會顯示 Report，以及 Coop 所知的遭標記內容或使用者資訊。每個 Job 都有專屬網址，可分享給組織內具有 Coop 存取權的人。

畫面至少會顯示該 Item 已設定的 Fields。依 Item Type 而定，例如貼文、留言、個人檔案或私訊，Coop 也會提供更多脈絡。

- 與內容相關的使用者帳號
- 同一使用者的其他內容

### Decisions

每個 Job 都會顯示審查員可用的 Decision。預設情況下，每個 Queue 都包含下列選項。

- **Ignore**：關閉 Job，不採取任何 Action
- **Enqueue to NCMEC**：將 Job 移至 NCMEC 審查 Queue，轉換成使用者層級的審查，彙整與該使用者相關的所有媒體
- **Move**：把 Job 轉移至其他 Queue
- 已為相關 Item Type 設定的**[自訂 Action](administration.md#actions)**，但不包含目前 Queue 隱藏的項目

Policy 會直接顯示在 Job 檢視中，內容審查員無須離開審查流程，就能查閱處置指引。

> **台灣使用提醒**
> **Enqueue to NCMEC** 屬於 Coop 內建的美國兒少安全工作流程。選用前需確認組織資格、資料處理方式、適用法律及台灣通報安排，不應只因介面提供此選項就直接送出資料。

### 留言

內容審查員可以在任何 Job 加入內部留言，與團隊成員溝通，例如標記疑慮、要求第二意見，或記錄未來可能需要的脈絡。留言只對組織成員可見，不會顯示給遭檢舉的使用者或檢舉者。

## 審查員身心健康

審查員的身心健康與安全是信任與安全工作的核心關切。Coop 提供可設定的選項，降低審查有害內容造成的影響。

- **Blur**：圖片與影片預設模糊。將游標移到圖片上可暫時取消模糊，移開後再次模糊。播放影片時會取消模糊。您可以設定模糊強度或完全停用

- **Grayscale**：以灰階顯示媒體，不使用全彩，可降低圖像內容的情緒衝擊

- **Mute Videos**：無論裝置音量為何，預設將所有影片靜音

### 全組織預設值

![Coop 的組織身心健康設定，可設定媒體的基本保護選項，包括模糊程度、灰階切換與影片自動靜音。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/settings-wellness.png)

管理員可以在 **Settings → Wellness** 設定適用於組織所有使用者的身心健康預設值。

每位使用者都能在 **Account → Wellness** 以個人偏好覆寫組織預設值。
