# 申訴

平台使用者不滿意內容治理決策並要求重新審查時，平台可以透過 Appeal API 將申訴送至 Coop。Coop 會把它送到審查 Queue，讓內容審查員檢查原始決策，並選擇維持或推翻。

## 申訴如何顯示在 Coop

若要讓申訴出現在審查 Queue，請將遭申訴的決策傳送至 Coop，並建立以申訴為目標的 Routing Rule。

![Coop Routing Rule 設定為將所有申訴送至專用申訴 Queue。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/appeal-routing.png)

申訴會以 Job 形式進入 Review Console，與 Report 類似。Job 會顯示原本遭處置的 Item、引用的 Policy、使用者申訴理由，以及提交申訴時加入的其他脈絡。

## 維持或推翻申訴

內容審查員可以查看原始內容治理決策，並選擇下列結果。

- **Uphold**：原始 Action 正確，駁回申訴
- **Overturn**：原始 Action 不正確，接受申訴

作成決策後，Coop 會透過 Appeal Decision Callback 將結果送回平台，讓平台把結果告知使用者。

## 實作

實作 Appeal API 前，請先完成[基本概念](concepts.md)所述設定。您需要先在 Coop 設定 [Item Types](concepts.md#item-type)、[Actions](concepts.md#actions) 與 [Policies](concepts.md#policy)。

完整 request schema 與驗證要求見 [Appeal API](../api/appeal.md)，Appeal Decision Callback 則見[處理 Actions](../api/actions.md#appeal-decision-callback)。

## 台灣使用提醒

申訴流程應與平台上的通知、理由說明、處理期限、權限及結果回覆方式一起設計。Coop 可協助路由與記錄，但平台仍需自行定義誰能複核、哪些資料可見，以及如何處理原決策已造成的影響。
