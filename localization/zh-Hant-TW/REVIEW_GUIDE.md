# Coop 繁中版審查指南

本指南用於第一輪翻譯完成後的語言與領域審查。每份文件的來源 commit、翻譯狀態與審查狀態記錄於 [`sources.tsv`](sources.tsv)。

## 審查角色

### 語言審查者

語言審查者應熟悉台灣繁體中文及平台治理語境，且不應是該文件第一輪翻譯的唯一作者。工作包括逐段對照英文來源、確認語意與限制條件，以及檢查術語、數字、欄位、連結與操作步驟。

### 領域審查者

領域審查者依文件風險選擇，可能包括下列角色。

- Coop 或相近內容治理系統的工程與維運人員
- 內容治理、申訴、審查員身心健康或事件應變實務工作者
- 兒少安全與 NCMEC 流程實務工作者
- 熟悉台灣法制與組織責任的法律專業人士
- 熟悉 authentication、webhook、database、container 與 production deployment 的資安或平台工程人員

同一人可以審查多個相近領域，但不得以單一專業涵蓋不相關的法律、兒少安全、資安與維運判斷。

## 建議審查批次

### A. 兒少安全與外部通報

- `docs/user/child-safety.md`
- `docs/integrations/ncmec.md`
- `docs/integrations/hma.md`
- `docs/integrations/google-content-safety.md`
- `docs/api/report.md`

至少需要兒少安全、法律、資安與事件應變觀點。NCMEC 是美國制度，審查時應確認文件沒有將其描述成台灣平台的法定程序。

### B. 自動處置與人工治理

- `docs/user/automated-enforcement.md`
- `docs/user/review-console.md`
- `docs/user/bulk-actioning.md`
- `docs/user/reports.md`
- `docs/user/appeals.md`
- `docs/api/actions.md`
- `docs/api/appeal.md`

需要內容治理流程與產品實作觀點，重點包括自動處置邊界、雙人確認、申訴可逆性、callback 冪等性與敏感欄位最小化。

### C. Authentication、部署與資料層

- `docs/user/administration.md`
- `docs/development/api-auth.md`
- `docs/development/local.md`
- `docs/development/docker.md`
- `docs/development/deployment.md`
- `docs/development/architecture.md`
- `docs/development/data-warehouse.md`

需要資安、平台工程與資料治理觀點，重點包括 secrets、signature verification、migration、destructive commands、sample credentials、SSO、backup、retention 與 disaster recovery。

### D. Signals、模型與第三方整合

- `docs/user/signals.md`
- `docs/integrations/openai-moderation.md`
- `docs/integrations/zentropi-cope.md`
- `docs/integrations/custom.md`

需要模型能力、資料流向與供應鏈觀點。任何英文限定、申請資格、外部 API 能力與費用都應以審查當下的官方資料重新確認。

### E. 核心概念、API 與導覽

其餘文件可在前四批之後進行語言與產品審查，並用來完成全站術語、導覽與交叉連結的一致性確認。

## 每份文件的審查步驟

1. 從 `sources.tsv` 取得 `source_path` 與 `source_commit`
2. 以該 commit 的英文來源逐段對照繁中檔案，不以最新網頁取代已記錄來源
3. 確認標題層級、段落順序、圖片、表格、code blocks、inline code、數字與限制條件均有對應
4. 依 [`STYLE_GUIDE.md`](STYLE_GUIDE.md) 檢查台灣繁體中文術語
5. 檢查繁中補充是否獨立標示，且沒有改寫成 ROOST 原始主張
6. 需要領域審查的文件，逐項記錄已確認範圍、未確認範圍與後續問題
7. 執行 `./localization/zh-Hant-TW/scripts/check-all.sh`
8. 將結果更新至 `sources.tsv`，並在 commit 或 review 記錄中保留審查者、日期與範圍

## 審查狀態值

`language_review` 與 `domain_review` 使用下列值。

- `pending` 尚未開始
- `in_review` 正在審查
- `changes_requested` 已提出需修正事項
- `approved` 已完成該欄位要求的審查
- `not_required` 已確認該文件不需要該類審查

不得只因 automated checks 通過，就將語言或領域審查標為 `approved`。

## `reviewed` 完成條件

文件只有在下列條件全部成立時，才能將 `status` 改為 `reviewed`。

- `language_review` 為 `approved`
- `domain_review` 為 `approved` 或經明確判斷後標為 `not_required`
- 所有 changes requested 已修正並重新確認
- Source 沒有在記錄的 commit 之後發生未核對變更
- 來源狀態、忠實度、mdBook build、內部連結與章節錨點檢查通過

若英文來源更新，應將受影響文件改為 `stale`，只在重新對照變動內容後恢復審查狀態。

## 審查記錄最小欄位

每次審查至少留下下列資訊，可放在 commit、GitHub review 或獨立 issue 中。

- 文件路徑與來源 commit
- 審查者名稱或可辨識的公開帳號
- 審查日期
- 審查角色與範圍
- 結果，包括 approved 或 changes requested
- 尚未確認的問題與需要的下一位審查角色

記錄中不得包含 API keys、credentials、兒少安全個案資料、私密媒體或未公開的內容治理事件細節。
