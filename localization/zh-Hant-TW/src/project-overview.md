# Coop

**用自己的方式進行審查與內容治理。**

![Coop 概覽，顯示已採取的處置總數、等待審查的工作、自動與人工處置比例，以及最常見的政策違規](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/overview.png)

Coop 是 [ROOST](https://roost.tools) 推出的開放原始碼審查與內容治理工具，為網路安全提供完整解決方案。

- **審查主控台**：供人工處理複雜內容治理決策的介面
- **內容處理**：支援貼文、留言、媒體與自訂內容類型
- **分析**：提供內容治理成效與趨勢的詳細資訊
- **規則引擎**：依照可自訂的政策自動評估內容
- **API 整合**：提供簡易 REST 與 GraphQL API，與平台順暢整合

## Coop 適用對象

Coop 適合任何需要作成網路安全決策的人，包括各種規模的平台、獨立開發者，以及沒有專職信任與安全人員的社群團隊。

多數內容治理工具採專有授權，定價也以原本就負擔得起的平台為對象。Coop 免費且開放原始碼，讓資料保留在自己的基礎設施中，也能依社群需要自訂。

下列原則影響 Coop 的開發方式。

- **平台擁有自己的政策。** Coop 提供實作及執行自有規範所需的管線。
- **兒少安全是優先工作流程。** Coop 以成為第一套免費、端對端的網路兒少安全系統為目標，這也是專案存在的原因之一。
- **程式碼可供稽核。** 沒有隱藏邏輯，也不會被單一供應商綁定。

## 正式環境採用情形

Coop 由下列組織使用。

| ![Kyodo](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/adopters/kyodo.png) | ![Notion](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/adopters/notion.png) | ![Musubi](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/adopters/musubi.png) |
| --- | --- | --- |

正在使用 Coop，並希望把專案或組織加入清單嗎？請[建立 pull request](https://github.com/roostorg/coop/edit/main/README.md)。

## 公開開發

Coop 是持續積極開發的開放原始碼專案。功能與文件會依社群回饋演進。

無論正在測試、遇到問題，或有改善想法，都歡迎[建立 issue](https://github.com/roostorg/coop/issues)、[加入或發起 discussion](https://github.com/roostorg/coop/discussions)，或加入 [Discord](https://discord.gg/5Csqnw2FSQ)。

您的回饋會直接影響 ROOST 的[專案路線圖](https://roostorg.github.io/community/roadmap)。

## 快速開始

使用 Docker Compose，以單一指令執行 Coop。設定方式與已發布映像檔的詳細資訊，見英文版 [Docker 指南](https://github.com/roostorg/coop/blob/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/development/docker.md)。

## 深入了解

請參閱[繁中使用者指南](user/)。完整英文文件另包含使用者指南、開發指南、API 參考與整合資訊，可從 [Coop 官方文件網站](https://roostorg.github.io/coop/latest)取得。

## 台灣使用提醒

「資料保留在自己的基礎設施中」以自行託管與正確設定為前提。外部 signals、API 整合、備份、紀錄與部署方式仍可能把資料傳送到其他服務或地區，導入時需逐項確認。
