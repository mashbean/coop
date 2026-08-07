# 自動處置與路由

Coop 可透過[主動式規則](#主動式規則)自動對提交的 Item 執行 Action，並透過[路由規則](#路由規則)將 Report 送至正確的審查 Queue。使用者反覆違反 Policy 的情況，則由[使用者違規次數](#使用者違規次數)管理。

## Rules

兩種 Rule 都由相同構成要素建立，包括引用 [Signals](signals.md) 與[比對資料庫](#比對資料庫)的條件。每個 Rule 適用於一種或多種 Item Type，因此可為貼文及留言建立文字規則、為圖片及影片建立雜湊比對規則，或為附有地理中繼資料的使用者提交內容建立地點規則。

Rule 條件可設為 **AND**，表示所有條件都必須符合；也可設為 **OR**，表示任一條件符合即可。

### 主動式規則

Proactive Rules（主動式規則）會自動執行處置。Item 提交至 Coop 時，系統會逐一評估所有啟用的 Proactive Rule，並自動執行每個符合 Rule 所設定的 Action。請至 **Automated Enforcement** → **Proactive Rules** 設定。

![主動式規則](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/proactive-rules.png)

凡是符合 Item 的 Proactive Rule 都會觸發，不會只執行第一個。因此，同一項內容符合多個 Rule 時，可能觸發多項自動 Action。

![詐騙主動式規則](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/proactive-rule-scam.png)

Proactive Rule 的 Action 可設為 _Enqueue Item to Manual Review_。系統會將 Item 轉成 Report，再與 Routing Rules 比對並送至正確 Queue。

### 路由規則

Routing Rules（路由規則）會將新進 Report 送至正確的 Review Console Queue。請至 Coop 的 **Review Console** → **Routing** 設定。

![路由規則](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/routing-rules.png)

系統會依順序評估 Rule，並將 Report 送至第一個符合 Rule 的 Queue。若沒有符合的 Rule，Report 會進入預設 Queue。每個 Rule 包含一個或多個條件。

![HMA 路由規則](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/routing-rule-hma.png)

## 比對資料庫

Matching Bank（比對資料庫）是一組可重複使用的值，能供多個 Rule 引用，避免重複輸入。例如，需要在多個 Rule 使用同一份禁用關鍵字時，只需建立一個 Bank，再於需要之處引用。

![比對資料庫](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/banks.png)

### 文字資料庫

Text Bank 可保存完全相同的詞語、片語或正規表示式清單，用於文字欄位的關鍵字比對與模式偵測。

![文字字串資料庫](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/text-string-bank.png)

Coop 也支援變體比對，以找出規避嘗試。例如，比對 `hello` 時，也可將 `h3||0` 與 `helllllllloooo` 視為符合。文字 Signal 類型詳情見 [Signals 的文字分析](signals.md#文字分析)。

![正規表示式資料庫](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/regex-bank.png)

### 雜湊資料庫

Hash Bank 保存已知有害媒體的感知指紋。Coop 搭配 HMA 使用這些資料，將圖片與影片和已知的 CSAM、非自願私密影像（NCII）、暴力極端主義或恐怖主義內容（TVEC），以及自行建立指紋的內容資料庫比對。設定方式見英文版 [Hasher-Matcher-Actioner（HMA）](https://roostorg.github.io/coop/latest/integrations/hma.html)。

![雜湊資料庫](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/hma-ui-coop-banks.png)

### 地點資料庫

Location Bank 保存 [geohash](https://en.wikipedia.org/wiki/Geohash) 或 Google Maps Places 參照清單，可用來對特定地理區域套用不同 Rule，例如在大學校園實施較嚴格的內容政策，或對特定區域採取目標式處置。

![地點資料庫](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/location-bank.png)

若要使用地點比對，傳送至 Coop 的每個 Item 都需包含 geohash，代表建立內容之使用者的位置。

## 使用者違規次數

User Strikes 會追蹤平台個別使用者反覆違反 Policy 的情況，讓系統能自動採取逐步升級的回應。您可透過 Policy 與 Action 設定此功能。Coop 會累計違規分數，超過已設定門檻時觸發後續 Action。

![User Strikes 概覽，顯示 Policy Scores 分頁、Policy 與各自的違規分數權重。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/user-strikes.png)

請至 **Automated Enforcement** → **User Strikes** 設定。資訊儀表板有四個分頁。

### Policy Scores

每項 Policy 可對使用者違規分數提供不同權重。嚴重違規可能增加 3 分，輕微違規可能增加 1 分。違規分數是設定期間內所有違規的累計總和。

子 Policy 可繼承上層 Policy 的權重，也可自行覆寫。使用 **Apply to sub-policies** 切換繼承設定。

### Strike Enabled Actions

Strike Enabled Actions 分頁列出組織定義的所有 Action，並可切換哪些 Action 執行後會增加使用者違規分數。並非所有 Action 都應計分。例如，「傳送警告」可能不計分，「移除內容」或「停權帳號」則可能需要計分。

![Strike Enabled Actions 分頁，列出各 Action 及是否加入使用者違規分數的切換按鈕。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/user-strike-actions.png)

任何應增加分數的 Action，都應開啟 **Strike Enabled** 欄位。系統會結合前一分頁的 Policy 權重與實際 Action，計算違規分數。

### Thresholds & Settings

設定違規紀錄保存多久，以及使用者違規分數超過門檻時要採取的行動。

![Thresholds & Settings 分頁，顯示 Strike Window（TTL）及門檻與對應 Action 清單。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/user-strike-thresholds.png)

**Strike Window** 控制違規紀錄留在使用者資料上的時間。早於期間的紀錄不列入目前分數。相同數值也可從 [Settings → Other → User Strike TTL](administration.md#其他) 編輯。

**Thresholds** 是超過後會自動觸發 Action 的分數值，可依需要設定多個。例如下列設定。

- 5 分：將使用者送入人工審查
- 10 分：暫時限制發布內容
- 20 分：停權帳號

下拉選單中的 Action 來自組織[已定義的 Action](administration.md#actions)。

### Analytics

此分頁顯示組織內使用者違規分數的分布圖，可在啟用門檻前協助調整。例如，多數活躍使用者分數介於 0 至 2，只有少數位於 8 以上時，將門檻設為 8，可能找出最嚴重的違規者，同時避免影響一般使用者。

![Analytics 分頁，顯示組織內使用者違規分數的直方圖。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/user-strike-analytics.png)

## Signals

Rule 條件實際評估的是 Signal。Signal 接收 Item 欄位並回傳分數，Rule 條件再將分數與門檻比較。詳情見 [Signals](signals.md)。

## 台灣使用提醒

- 多個 Proactive Rule 可同時觸發，因此啟用前應測試 Action 組合是否會重複刪除、重複通知或產生互相衝突的結果
- 使用者違規分數與門檻屬於平台政策設計，不應只以技術預設值決定。高影響處置應保留理由、通知、人工複核與申訴路徑
- Hash Bank、Location Bank 與外部 Signals 可能涉及高度敏感資料。導入前應確認資料來源、存取權限、保存期限、跨境傳輸與誤比對處理方式
