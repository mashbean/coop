# 繁中化工作流程

## 狀態

- `not_started` 尚未開始
- `draft` 已有不完整草稿
- `translated` 已完成第一輪翻譯，等待審查
- `reviewed` 已完成語言與必要的領域審查
- `stale` 英文來源已有變更，需要重新核對
- `blocked` 因授權、術語、法律或上游架構問題暫停

## 每批步驟

1. 從最新 `upstream/main` 核對來源文件
2. 在 `sources.tsv` 記錄完整來源 commit 與狀態
3. 保留原文標題層級、連結目的、程式碼、欄位名稱與限制條件
4. 台灣情境另以「台灣使用提醒」標示，不寫成 ROOST 原文
5. 核對專案名稱、API 欄位、角色、數字、版本與功能狀態
6. 執行 `./localization/zh-Hant-TW/scripts/check.sh`
7. 執行 `mdbook build localization/zh-Hant-TW`
8. 分別記錄語言審查與領域審查結果

## 高風險文件

下列文件除台灣繁體中文審查外，還需要獨立的領域審查。

- `docs/user/child-safety.md`
- `docs/integrations/ncmec.md`
- 涉及自動停權、刪除或大規模批次處置的文件
- 涉及外部 AI API、個人資料、媒體檔案或地理位置的文件

## 英文來源更新

來源變動後，檢查程式會要求重新核對。只翻譯實際變動的段落，更新來源 commit，再重新進行需要的語言與領域審查。
