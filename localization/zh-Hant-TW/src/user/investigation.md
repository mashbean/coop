# 調查

Investigation 工具可讓您使用唯一 ID，在 Coop 查找任何 Item 或使用者，並查看 Coop 所知的全部資訊，不必先進入審查 Queue。

![Coop 的 Investigation 工具，使用者資料已遮蔽，畫面顯示 Coop 所知的實體或使用者資訊。](https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/investigation.png)

輸入 Item 或使用者的唯一 ID 後，可查看下列資訊。

- Item 本身，包括 Coop 所保存的全部 Fields 與中繼資料
- 建立 Item 的使用者及其相關中繼資料，若適用
- 對 Item 及其建立者採取 Action 的完整歷程，包括每項 Decision 的作成者
- 相關 Item，例如同一 Thread 中前後相鄰的留言，以提供脈絡

您也可以從 Review Console 的 Job 直接進入 Investigation，方法是在 Job 檢視點選 Item 或使用者。

## 採取 Action

即使不在審查 Queue 中，也可以直接從 Investigation 對 Item 採取 Action。使用 **Take action on this item** 表單，選擇 Action，依需要選擇 Policy，再按下 **Submit Actions**。

這適合用來處理一般審查流程以外的內容，例如從其他管道收到 Report 後調查使用者，或在先前 Decision 之後採取後續 Action。

## 反向處理 Action

Coop 沒有內建復原功能。若要反向處理 Action，例如解除使用者停權，需要先在 Settings 建立呼叫平台反向端點的自訂 Action。例如建立「Unban user」Action，呼叫平台的解除停權 API。

設定完成後，可從 Investigation 執行該 Action，或透過 Recent Decisions 紀錄前往 Item。執行 Action 時，Coop 會將 callback 傳送至平台，由平台完成反向處理。

## 台灣使用提醒

Investigation 可能集中顯示內容、帳號、中繼資料、處置歷程與相關 Item。應依職務限制存取、記錄查詢與 Action，並避免為了「提供脈絡」而無限制擴張資料範圍。反向處理 Action 也應保留與原始 Decision 的關聯，避免稽核紀錄斷裂。
