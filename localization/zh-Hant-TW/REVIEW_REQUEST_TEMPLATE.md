# Coop 繁中版審查請求與紀錄範本

本範本可複製到 GitHub issue、discussion 或其他公開協作工具。使用前請依 [`REVIEW_GUIDE.md`](REVIEW_GUIDE.md) 選擇審查批次與所需角色。

## 審查請求

```md
# Coop 繁中版審查請求，批次 <A-E 或自訂名稱>

## 審查目標

請逐段對照下列 Coop 英文來源與台灣繁體中文譯文，確認語意、限制條件、技術字串與操作流程。這次審查不代表對 Coop production deployment、法律義務或第三方服務能力作出保證。

## 來源版本

- Upstream repository：`roostorg/coop`
- Source commit：`<sources.tsv 所列 40-character commit>`
- Localization branch：`<branch name>`

## 文件範圍

- `<source_path>` → `<localized_path>`
- `<source_path>` → `<localized_path>`

## 需要的審查角色

- [ ] 台灣繁體中文語言審查
- [ ] Coop 產品或工程審查
- [ ] 內容治理流程審查
- [ ] 兒少安全審查
- [ ] 台灣法律專業審查
- [ ] 資安與事件應變審查
- [ ] 平台部署與資料治理審查
- [ ] 模型、Signals 或第三方服務審查

## 請確認

- [ ] 每段原文都有對應譯文，原文的不確定性與限制條件均保留
- [ ] 標題、圖片、表格、code blocks、inline code、數字、版本與欄位名稱正確
- [ ] 術語符合 `STYLE_GUIDE.md`
- [ ] 繁中補充與 ROOST 原文清楚區隔
- [ ] 美國或歐盟制度沒有被直接寫成台灣義務
- [ ] 高風險操作具備適當警告、權限、復原與人工確認脈絡
- [ ] 已執行 `./localization/zh-Hant-TW/scripts/check-all.sh`

## 不在本次範圍

- 未列出的文件
- 未經實測的 production readiness
- 未經資格確認的法律結論
- 使用真實兒少性影像、私密媒體或可識別個案進行測試

## 回覆方式

請逐項列出需要修改之處，包含文件路徑、段落或行號、原因與建議。若沒有修改要求，請明確記錄 approved 的角色與範圍。
```

## 審查結果紀錄

```md
# Coop 繁中版審查結果，批次 <名稱>

## 基本資料

- 審查者：<公開姓名或帳號>
- 審查日期：<YYYY-MM-DD>
- 審查角色：<語言、產品、法律、兒少安全、資安、部署或其他>
- Source commit：<40-character commit>
- 審查文件：<paths>

## 結果

- [ ] approved
- [ ] changes_requested
- [ ] 只完成部分範圍

## 已確認範圍

- <已逐項確認的內容>

## 需要修正

1. `<file path>`，<段落或行號>
   - 問題：<問題說明>
   - 建議：<修正方向>

## 尚未確認

- <仍需其他角色或證據確認的問題>

## 檢查結果

- [ ] `check-all.sh` 通過
- [ ] 英文來源未漂移
- [ ] Changes requested 已重新確認

## `sources.tsv` 更新

- `language_review`：`<pending|in_review|changes_requested|approved|not_required>`
- `domain_review`：`<pending|in_review|changes_requested|approved|not_required>`
- `status`：`<translated|reviewed|stale|blocked>`
```

## 記錄限制

- 不在審查紀錄貼入 API keys、credentials、private URLs 或 production secrets
- 不附上真實 CSAM、私密影像、未公開檢舉內容或可識別個案資料
- 法律、費用、申請資格與第三方服務能力若需即時查核，應附審查當下的官方來源與日期
- 審查者只核准自己實際確認的角色與範圍
