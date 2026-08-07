# Hasher-Matcher-Actioner（HMA）

Coop 整合 Meta 的開放原始碼 [Hasher-Matcher-Actioner（HMA）](https://github.com/facebook/ThreatExchange/tree/main/hasher-matcher-actioner)，針對已知 CSAM、非自願私密影像（NCII）、恐怖主義與暴力極端主義內容（TVEC），以及自行維護的 Hash Bank，提供感知雜湊比對。

雜湊比對會計算提交媒體的感知指紋，圖片使用 PDQ，影片使用 MD5，再與已知有害內容資料庫比對。與 AI 分類器相比，和 NCMEC 等經驗證資料庫中的雜湊符合，是強而可靠的 Signal。已知內容即使經過輕微修改，仍可可靠比對。

## 要求

1. Coop 伺服器可存取、正在執行的 HMA instance
2. 要使用之第三方 Hash Bank 的 API 憑證。例如，NCMEC 提供 Hash Sharing API 憑證，Tech Against Terrorism 則管理其 Hash Bank 存取權
3. 自有 Hash Bank，選填，例如組織自行保存的已知違規內容集合
4. 在 Coop 的 **Settings** → **Integrations** 設定 HMA 服務網址

連線後，HMA Signals 會顯示在 Coop Signal 函式庫，可供 Routing Rules 與 Proactive Rules 使用。

## 管理 Hash Banks

Hash Bank 是已知有害媒體指紋的集合，可供 Rule 引用。您可以透過 Coop 使用者介面建立及管理 Bank，也可從 NCMEC 等外部來源同步。

![Matching Banks 頁面，顯示在 Coop 使用者介面建立的測試 Hash Bank。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/hma.png)

### 透過 Coop 建立 Bank

建議從 Coop 的 **Settings** → **Matching Banks** 建立 Bank。Coop 會自動在 HMA 與 Coop 資料庫登記，立即可於 Rule builder 使用。

透過 Coop 建立的 Bank，會依 `COOP_<ORGID>_<NORMALIZED_NAME>` 慣例在 HMA 命名。例如，組織 `abcdef12345` 的「Test Bank」會成為 `COOP_ABCDEF12345_TEST_BANK`，這也是 HMA 使用者介面顯示的名稱。

### 直接在 HMA 建立 Bank

直接透過 HMA 使用者介面或 seed scripts 建立的 Bank，不會顯示在 Coop Matching Banks 使用者介面，除非也登記於 `hash_banks` table。若需要在 Coop Rule 使用 HMA 原生 Bank，請先從 Coop 使用者介面建立對應 Bank。

![HMA 使用者介面顯示從 Coop 建立的 Bank，以及手動上傳媒體至 Matching Bank 時出現的視窗。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/hma-ui-coop-banks.png)

無論 Bank 從何處建立，都可以使用 HMA 使用者介面手動加入內容，供本機測試。

## NCMEC Hash Sharing

若要讓 Coop 與 NCMEC 的已知 CSAM 雜湊資料庫比對，需要 NCMEC [Hash Sharing API](https://report.cybertip.org/ws-hashsharing/v2/documentation/) 憑證。

在 HMA 建立以 NCMEC exchange 為來源的 Bank。HMA 會依背景擷取排程開始同步雜湊，預設每五分鐘一次。同步完成後，NCMEC 來源 Bank 會顯示在 Coop **Matching Banks**。

詳情見英文版 [NCMEC CyberTipline 整合](https://roostorg.github.io/coop/latest/integrations/ncmec.html)。

## 在 Rules 中使用 HMA Signals

HMA 連線並設定 Hash Banks 後，圖片雜湊 Signal 可同時用於 Routing Rules 與 Proactive Rules。

- 若要路由來自[使用者 Report](https://roostorg.github.io/coop/latest/api/report.html) 的內容，請建立含雜湊比對邏輯的[路由規則](../user/automated-enforcement.md#路由規則)，並送至所需 Queue。若是 NCMEC 符合項目，應送至已設定的 NCMEC Queue

  ![使用 HMA 雜湊比對的 Routing Rule。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/routing-rule-hma.png)

- 對透過 [Items API](https://roostorg.github.io/coop/latest/api/items.html) 提交的內容，若希望 Coop 在沒有使用者 Report 時主動計算雜湊並標記符合項目，請建立含圖片雜湊條件及「Enqueue to NCMEC」Action 的[主動式規則](../user/automated-enforcement.md#主動式規則)

## 另請參閱

- [自動處置與路由](../user/automated-enforcement.md)，了解如何建立 Rule
- 英文版 [NCMEC CyberTipline](https://roostorg.github.io/coop/latest/integrations/ncmec.html)，了解 NCMEC 整合設定

## 台灣使用提醒

- 雜湊符合只能證明計算結果與資料庫項目相符，實際意義仍取決於資料庫品質、來源授權、hash type 與資料同步狀態
- 自有及第三方 Bank 應有明確來源、加入與移除程序、存取控制、稽核紀錄及誤比對處理方式
- 不應為測試而上傳真實 CSAM 或未經同意的私密影像。使用安全測試指紋或由資料提供者核准的測試集合
- Proactive Rule 直接搭配「Enqueue to NCMEC」前，應先確認錯誤路由、人工複核、資料彙整及跨境傳輸後果
