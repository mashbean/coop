# Coop 台灣繁體中文化工作藍圖

本目錄是 Coop 文件的台灣繁體中文在地化工作區。現階段在 `open-safety-tw/coop` fork 運作，先建立可追溯、可審查的翻譯版本，再與 ROOST 上游討論正式多語文件架構。

## 目標讀者

- 沒有專職信任與安全團隊的小型平台與社群
- 負責內容審查、申訴、事件處理與社群規範的管理者或志工
- 評估自行託管內容治理工具的工程與治理工作者
- 研究平台治理、兒少安全及審查員身心健康的人員

## 翻譯順序

### 第一階段：理解與操作

1. 專案概覽與文件入口
2. 使用者指南與基本概念
3. 人工審查、signals、檢舉與申訴
4. 自動處置、批次處置、調查、指標與管理設定

### 第二階段：高風險流程與整合

1. 兒少安全與 NCMEC 流程
2. Google Content Safety API、HMA、OpenAI Moderation 與 CoPE
3. 自訂整合與資料處理邊界

兒少安全、法定通報與高風險資料處理文件，完成翻譯後仍須由具相關資格或實務經驗者獨立審查。美國 NCMEC 流程不直接改寫成台灣制度。

### 第三階段：技術導入

1. API 參考
2. 本機開發、Docker 與部署
3. 架構、認證與資料倉儲抽象層

## 目前狀態

完整來源盤點已登記於 [`sources.tsv`](sources.tsv)。37 份上游 Markdown 來源均已完成第一輪翻譯，下一階段是由第二位語言審查者與必要的領域審查者逐份確認。在審查完成前，內容維持 `translated`，不標示為 `reviewed`。NCMEC 文件另需法律、兒少安全、資安與事件應變審查。

審查角色、批次、狀態值與完成條件見 [`REVIEW_GUIDE.md`](REVIEW_GUIDE.md)。邀請協作者時，可使用 [`REVIEW_REQUEST_TEMPLATE.md`](REVIEW_REQUEST_TEMPLATE.md)。

ROOST 公開組織目前八個具明確專案授權或已建立翻譯工作區的 repository，均已納入繁中入口與來源監測。組織層級的 `roostorg/.github` 尚未確認可供衍生翻譯的授權條款，因此不以自動化方式複製或翻譯；待 ROOST 明確授權後再納入。

跨專案清單記錄於 [`ecosystem-sources.json`](ecosystem-sources.json)，可執行下列 command 檢查實際翻譯來源是否在上游發生變動。檢查會略過只影響程式碼或其他非翻譯來源的提交，避免把所有上游活動都誤判成譯文過期。

```sh
node localization/zh-Hant-TW/scripts/check-ecosystem-freshness.mjs
```

## 完整驗證

```sh
./localization/zh-Hant-TW/scripts/check-all.sh
```

此 command 會檢查來源與審查狀態、台灣繁體中文用語、code blocks、inline code、圖片、表格、style blocks、mdBook build，以及產生後的內部連結與章節錨點。若 `mdbook` 不在 PATH，可透過 `MDBOOK_BIN` 指定 executable path。

## 重要限制

- 翻譯不等同於繁中模型或 signals 的效能驗證
- 文件描述功能，不代表已替使用者完成政策設計、法律判斷或人工作業配置
- 導入前仍須自行確認資料保存、權限、申訴、稽核與事件應變安排
- 不在翻譯測試中使用真實兒少性影像、私密影像或可識別個案資料
