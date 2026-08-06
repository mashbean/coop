# 基本概念

以下是 Coop 的核心構成要素。了解這些概念，能協助您快速開始並建立工作流程。理解後，應能完成 Coop 設定，並開始使用各項功能。

**這些概念依照建立 Coop 設定時的建議順序排列。** 部分概念建立在前面的概念上，因此建議依序讀完。

## Item

**Item** 是平台上的任何實體，可包含單項內容，例如貼文、留言、私訊、商品刊登與商品評論；內容討論串，例如留言串與群組聊天；或使用者及其個人檔案。即使一個實體內含其他 Item，仍可將其視為獨立 Item。

### Item Type

Item Type 代表平台上的不同 Item 類型。例如，社群網路可能有 _Profile_、_Post_、_Comment_ 與 _Comment Thread_。市集平台可能包含 _Buyer_、_Seller_、_Product Listing_、_Product Review_、_Direct Message_ 與 _Transaction_ 等。傳送至 Coop 的每個 Item，都必須只屬於其中一種 Item Type。

設定流程的第一步，是在 Coop 的 **Settings** → **Item Types** 中[定義 Item Types](https://roostorg.github.io/coop/latest/user/administration.html#item-types)。

### Item Type 的類別

Item Type 是通用概念，可代表平台上的任何項目，從單獨的內容、使用者及其個人檔案，到包含多項相關內容的討論串皆可。

為了讓 Coop 針對不同 Item Type 提供更實用的功能，Item Type 分成三類。

1. **Content**：單項內容，例如訊息、留言、貼文、商品刊登與評論等

2. **User**：平台上的個別使用者。部分平台只有一種 User Item Type，也有平台會有多種。例如，市集可能把買家與賣家設為不同的 User Item Type，共乘服務也可能把駕駛與乘客設為不同類型

3. **Thread**：依順序排列的內容清單。例如包含大量訊息的群組聊天、包含大量貼文的留言板，以及包含大量留言的留言串。這些都屬於按指定順序包含多項內容的 Thread

Coop 會以不同方式處理及顯示這些 Item Type，因此建立每種 Item Type 時，Coop 都需要知道它屬於三類中的哪一類。

### Item Type Schema

Schema 代表 Item Type 的資料形狀。例如，平台上的 Profile 若包含使用者名稱、個人圖片、簡介與興趣清單，Coop 就需要知道這些資訊，才能在規則中引用資料，並於 Coop 使用者介面中正確顯示。

每個 Item Type Schema 都由 Field 清單構成，每個 Field 代表 Schema 中的一項資料。前述 Profile Item Type 的 Schema 可能包含下列 Fields。

- `username`（`string`）
- `profile_picture`（`image`）
- `bio`（`string`）
- `interests`（`Array<string>`）

您可以加入所需數量的 Field，再於規則中使用。

#### Coop 如何唯一識別 Item 的重要說明

在 Coop 中，使用（Item ID, Item Type ID）組合唯一識別特定 Item。有些平台無法保證留言 ID 與使用者 ID 不會重複，也有平台營運者同時擁有及經營多個平台，無法保證不同平台的 Item ID 不會互相重複。

在這些情況下，需要使用（Item ID, Item Type ID）組合，才能唯一識別正確的 Item。在 API request 中，兩者表示為同層欄位 `id` 與 `typeId`。建議以下列結構傳送 Item。

```ts
item: {
  id: string;
  typeId: string;
}
```

`id` 欄位是平台對該 Item 使用的唯一識別碼，`typeId` 則是 Coop 為對應 Item Type 產生的 ID。在 Coop 資訊儀表板建立 Item Type 後，便會看到產生的 ID。向 Coop 傳送 API request 時，可用它填入 `typeId` 欄位。

## Actions

Coop 中的 Action 代表任何可對 Item 執行的動作。常見的信任與安全範例包括 _Delete_、_Ban_、_Mute_ 與 _Send to Moderator_。也可以加入非信任與安全用途的動作，例如 _Promote_、_Add to Trending_、_Mark as Trustworthy_ 或 _Approve Transaction_。任何自動化動作都能加入 Coop。

Action 會顯示在 Proactive Rules 中，供符合條件的 Item 使用。在 Review Console 中，可用的 Action 會以 Decision 形式提供給審查員，讓審查員針對每個 Job 作成決定。

每個 Action 都對應至組織開放給 Coop 的 API 端點。例如，在 Coop 建立 _Delete_ Action 時，必須提供一個 API 端點，也就是網址，並最好附有驗證機制，讓 Coop 能送出 POST request。如此一來，當 Coop 透過主動式規則或審查員決策觸發 Action 時，便會送出對應的 POST request，實際在平台伺服器上執行該 Action。

設定流程的第二步，是在 Coop 的 **Settings** → **Actions** 定義這些 Action。

Coop 傳送至 Action API 端點的 webhook payload 詳情，見英文版 [Handling Actions](https://roostorg.github.io/coop/latest/api/actions.html)。

## Policy

Policy 是平台用來治理使用者行為的一組規則與指引。常見範例包括 _Spam_、_Nudity_、_Fraud_、_Harassment_ 與 _Violence_。更多資訊見 [Trust & Safety Professional Association](https://www.tspa.org/curriculum/ts-fundamentals/policy/policy-development/)。

Policy 可包含子政策。例如，_Spam_ 政策可有 _Commercial Spam_、_Repetitive Content_、_Fake Engagement_ 與 _Scams & Phishing_ 等子政策。

將每個 Action 對應至一項或多項特定 Policy 通常很實用，在某些情況下也是必要要求，例如歐盟《數位服務法》。同一則留言可能依 _Hate Speech_ 政策遭到 _Delete_，也可能依 _Spam_ 政策遭到 _Delete_。Coop 可分別追蹤這些差異，並計算各 Policy 下採取的 Action 數量。如此可以觀察各 Policy 長期執行成效、辨識處置成效不佳或惡化的 Policy，並向組織管理層或主管機關報告成效指標，例如製作 DSA 透明度報告。

您可以從 **Policies** 資訊儀表板建立及管理 Policy，也可以透過英文版 [Policies API](https://roostorg.github.io/coop/latest/api/policies.html) 以程式存取。從 Coop 使用者介面加入的 Policy，也會直接顯示在 Review Console 的英文版 [Job view](https://roostorg.github.io/coop/latest/user/review-console.html#job-view)，供審查員查看。

> **台灣使用提醒**
> 上述《數位服務法》範例描述歐盟制度，不代表台灣平台適用相同義務。即使法律沒有要求，把處置與明確政策依據連結，仍有助於一致性、申訴、稽核與透明度。

## Jobs

Report 被送至 Review Console 的 Queue 時，系統會建立 Job。每個 Job 顯示 Report、遭檢舉的 Item，以及 Item 作者的資訊。審查員可以略過 Job，讓它留在 Queue，也可以作成 Decision。Decision 包括 _Ignore_，也就是不採取行動；_Enqueue to NCMEC_，前提是已設定 NCMEC；_Move_ 至其他 Queue；以及該 Queue 可用的所有 Action。

## Reports

平台使用者標記 Item 時，系統會建立 Report。Report API 用於人工審查，無論來源是使用者標記，或只是為了觸發人工標記流程。平台使用者標記 Item 並由平台傳送至 Report API 後，Coop 會把它送到 Review Console，供內容審查員決定如何處理。

更多資訊見英文版[檢舉文件](https://roostorg.github.io/coop/latest/user/reports.html)。

## Appeals

平台使用者不同意內容治理決策時，可能希望「申訴」，也就是要求平台重新查看並確認最初決策是否正確。如果平台支援此功能，Coop 可協助處理完整申訴流程。對部分受歐盟《數位服務法》規範的平台而言，提供申訴是必要要求。

平台使用者要求團隊複核內容治理決策時，可以在 Coop 建立 Appeal。使用者在平台提出申訴後，平台可將申訴要求傳送至英文版 [Appeal API](https://roostorg.github.io/coop/latest/api/appeal.html)。Coop 會將其加入 Review Queue，讓內容審查員決定維持或推翻原始決策。

更多資訊見英文版[申訴文件](https://roostorg.github.io/coop/latest/user/appeals.html)。

> **台灣使用提醒**
> 上述申訴義務範例同樣描述歐盟制度。台灣社群仍應依服務類型、契約、社群規範與適用法令，確認申訴、通知及救濟安排。
