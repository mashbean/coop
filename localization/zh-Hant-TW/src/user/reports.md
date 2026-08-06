# 檢舉

平台使用者檢舉內容時，平台會把該檢舉送至 Coop 的 Report API。Coop 據此建立內容治理 Job，再把 Job 送到適當的審查 Queue，交由內容審查員處理。

Report 是使用者產生的 signals 進入內容治理工作流程的主要方式。Report 會攜帶檢舉者身分、遭檢舉內容、檢舉理由，以及討論串前後訊息或作者近期活動等選填脈絡。

## Coop 如何處理檢舉

平台傳送 Report 時，Coop 會進行下列步驟。

1. 為遭檢舉的 Item 建立內容治理 Job
2. 評估 Routing Rules，決定 Job 應進入哪個 Queue
3. 將 Job 送到該 Queue，若沒有符合的 Rule，則送到預設 Queue
4. 讓該 Queue 中下一位可用的內容審查員取得 Job

若 `reportedForReason.csam` 為 `true`，Job 會直接送到 NCMEC Queue，不經一般 Routing Rule 評估。詳細資訊見英文版 [Child Safety (NCMEC)](https://roostorg.github.io/coop/latest/user/child-safety.html)。

## 將檢舉傳送至 Coop

Report 透過 `POST /api/v1/report` 提交。完整 API schema，包括欄位定義、型別與必要條件，見英文版 [Report API](https://roostorg.github.io/coop/latest/api/report.html)。

## 將惡意檢舉者的檢舉設為無效

若同一位平台使用者大量標記未違規內容並阻塞審查 Queue，具有 `EDIT_MRT_QUEUES` 權限的內容審查員，可在 Manual Review Tool 的任何 Report 詳細資料檢視中，使用「Invalidate reports」Action，將該檢舉者所有待處理 Report 設為無效。

預設情況下，Action 只影響目前 Job，會從 Job 的檢舉歷程移除該檢舉者的紀錄。若移除後沒有其他檢舉者或 Report 來源，例如自動偵測器，Job 就會從 Queue 移除。若要處理組織內所有待處理 Job，請在確認視窗勾選「Apply across the whole organization」。已決定或已關閉的 Job 不會修改。

這是單次操作，不是持續性的封鎖清單。相同檢舉者日後提出的 Report 仍會正常進入系統，若行為持續，需要再次設為無效。反覆惡意檢舉的使用者，應由平台層級停權或限制發言。

每次設為無效的操作都會在伺服器產生 trace span，記錄執行操作的內容審查員、目標檢舉者、選填理由與結果數量。目前，該 span 是臨時稽核查詢的單一真實來源。

## 申訴

使用者要對內容治理決策提出異議時，應使用 Appeals API。這是與 Report 分開的流程。詳細資訊見[申訴](appeals.md)。

## 台灣使用提醒

檢舉者身分、檢舉內容與作者活動都可能包含個人資料或敏感資訊。設定 Report payload、內部權限、保存期限與稽核存取前，應先採資料最小化原則。`reportedForReason.csam` 的自動路由也不等同完成台灣法定通報。
