# 指標與報告

Coop 在兩個介面追蹤內容治理活動。Overview 資訊儀表板提供營運指標，Recent Decisions 紀錄則提供完整稽核軌跡。

## Overview

![Coop Overview 顯示主要營運指標，包括已採取的 Action 總數、待審查 Job、自動與人工 Action 百分比，以及最常見的 Policy 違規。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/overview.png)

Overview 資訊儀表板提供內容治理活動的高階概況。所有指標都可在可設定期間內，依小時或每日篩選。Overview 顯示下列內容。

- **已採取的 Action 總數**：所選期間內所有內容治理 Decision 的數量
- **待審查 Job**：目前在 Queue 中等待內容審查員處理的 Job 數量
- **自動與人工 Action**：由 Proactive Rules 與人工審查員作成之 Decision 的百分比分布
- **最常見的 Policy 違規**：哪些 Policy 產生最多 Action
- **每位內容審查員的 Decision**：工作在審查團隊中的分布情形
- **每條 Rule 的 Action**：哪些 Rule 最常觸發，只有啟用 Rule 時才顯示
- **各 Policy 的違規**：一段時間內，各 Policy 之下採取的 Action 數量

## Recent Decisions

![Coop Recent Decisions 頁面，顯示 Coop 內所有 Action 與執行者的紀錄。畫面提供重新整理表格、下載所有 Decision，以及只下載使用者略過 Job 的按鈕。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/recent-decisions.png)

前往 **Review Console** → **Recent Decisions**，即可查看 Coop 中採取的每項 Action，包括誰在何時對何種內容作成 Decision。您可以從任何紀錄前往完整 Job，進一步調查或採取其他 Action。

![篩選 Recent Decisions。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/recent-decisions-filter.png)

可下載完整紀錄，也可依 Decision、Policy、Queue、內容審查員與日期範圍篩選後下載。特別適合下列用途。

- **透明度報告**：匯出 Decision，納入提供給主管機關或監督單位的報告
- **品質保證與稽核**：抽樣個別內容審查員或自動 Rule 作成的 Decision，檢查一致性與準確度
- **推翻工作流程**：從紀錄的 Decision 回到原始 Job，並依需要執行反向 Action

也可另外下載只包含內容審查員曾經 _skip_ 的 Job。這有助於找出可能長期難以判定的內容。

## 台灣使用提醒

- Action 數量與處理速度無法單獨代表治理品質。建議同時觀察誤判、推翻率、申訴結果、等待時間、審查員負荷與不同 Policy 的差異
- `Decisions per moderator` 適合分析工作分配，不宜脫離案件難度與身心健康因素，直接當成個人績效排名
- 匯出資料可能含帳號、內容、理由與審查員資訊。提供給外部單位前應確認目的、欄位最小化、去識別、存取權與保存期限
