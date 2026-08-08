<div class="architecture-page" data-scene="base">
  <header class="architecture-nav">
    <a class="architecture-brand" href="./" aria-label="回到 ROOST 繁中指南首頁">
      <span aria-hidden="true">R</span>
      <strong>ROOST 繁中指南</strong>
    </a>
    <nav aria-label="本頁導覽">
      <a href="#architecture-map">架構圖</a>
      <a href="#matters-modules">Matters 模組</a>
      <a href="#roost-modules">ROOST 對位</a>
      <a href="#architecture-differences">差異盤點</a>
    </nav>
    <a class="architecture-nav-cta" href="toc.html">完整文件</a>
  </header>
  <main>
    <section class="architecture-hero" aria-labelledby="architecture-title">
      <div class="architecture-hero-copy">
        <p class="architecture-eyebrow">Matters × ROOST 架構盤點</p>
        <h1 id="architecture-title">Matters 怎麼治理社群，ROOST 可以接在哪裡</h1>
        <p class="architecture-lead">這張圖先畫出使用者、平台、治理與發布之間的關係，再逐步放入 Matters 的垃圾偵測、社群審查、申訴與抗審查發布，最後對照 ROOST 的 Model Community、Osprey 與 Coop。</p>
        <div class="architecture-actions">
          <a class="architecture-button architecture-button-primary" href="#architecture-map">開始看架構圖</a>
          <a class="architecture-button architecture-button-secondary" href="#architecture-differences">直接比較差異</a>
        </div>
      </div>
      <aside class="architecture-scope" aria-label="盤點範圍">
        <p>盤點基準</p>
        <strong>2026 年 8 月 8 日</strong>
        <span>依公開程式庫、繁中化文件與可公開存取頁面整理</span>
        <ul>
          <li><i class="status-dot status-code"></i>程式碼可定位</li>
          <li><i class="status-dot status-public"></i>公開頁可驗證</li>
          <li><i class="status-dot status-check"></i>正式環境狀態另查</li>
        </ul>
      </aside>
    </section>
    <aside class="architecture-method">
      <strong>閱讀原則</strong>
      <p>圖上標成「程式碼可定位」的項目，只代表在公開 repository 找得到實作。模型門檻、功能開關、排程與自動處置是否啟用，仍要查看正式環境設定。</p>
    </aside>
    <section class="architecture-scrolly" id="architecture-map" aria-labelledby="architecture-map-title">
      <div class="architecture-visual-column">
        <figure class="architecture-map">
          <div class="architecture-map-header">
            <div><p>共同架構底圖</p><h2 id="architecture-map-title">一則內容在社群平台裡怎麼走</h2></div>
            <span class="architecture-scene-label" aria-live="polite">01 平台骨架</span>
          </div>
          <ol class="architecture-step-rail" aria-label="四個比較步驟">
            <li class="architecture-step is-active" data-scene-step="base"><span class="architecture-step-number">01</span><i class="architecture-step-icon step-icon-map" aria-hidden="true"><b></b><b></b><b></b><b></b></i><strong>平台骨架</strong></li>
            <li class="architecture-step" data-scene-step="matters"><span class="architecture-step-number">02</span><i class="architecture-step-icon step-icon-matters" aria-hidden="true"><b></b><b></b><b></b></i><strong>Matters 模組</strong></li>
            <li class="architecture-step" data-scene-step="roost"><span class="architecture-step-number">03</span><i class="architecture-step-icon step-icon-roost" aria-hidden="true"><b></b><b></b><b></b></i><strong>ROOST 工具</strong></li>
            <li class="architecture-step" data-scene-step="compare"><span class="architecture-step-number">04</span><i class="architecture-step-icon step-icon-compare" aria-hidden="true"><b></b><b></b></i><strong>並排比較</strong></li>
          </ol>
          <div class="architecture-platform" aria-label="社群平台共同架構">
            <div class="architecture-platform-label"><span>固定不動的底圖</span><strong>使用者 → 產品 → 治理 → 對外發布</strong></div>
            <div class="architecture-zone-flow">
              <article class="architecture-zone architecture-zone-entry">
                <span class="architecture-zone-index">A</span><i class="architecture-zone-icon zone-icon-entry" aria-hidden="true"></i><small>使用者</small><strong>閱讀與發言</strong><p>發文、留言、檢舉、申訴</p>
              </article>
              <article class="architecture-zone architecture-zone-product">
                <span class="architecture-zone-index">B</span><i class="architecture-zone-icon zone-icon-product" aria-hidden="true"></i><small>產品</small><strong>介面與平台核心</strong><p>內容、帳號、排序、通知</p>
                <div class="architecture-owner-panel architecture-owner-matters" data-owner="matters"><b>Matters</b><span>matters-web</span><span>matters-server</span></div>
                <div class="architecture-owner-panel architecture-owner-roost" data-owner="roost"><b>ROOST</b><span>Action callback</span></div>
              </article>
              <article class="architecture-zone architecture-zone-governance">
                <span class="architecture-zone-index">C</span><i class="architecture-zone-icon zone-icon-governance" aria-hidden="true"></i><small>治理</small><strong>判斷與處置</strong><p>偵測、調查、審查、救濟</p>
                <div class="architecture-owner-panel architecture-owner-matters" data-owner="matters"><b>Matters</b><span>垃圾模型／集團偵測</span><span>里長室／守望相助</span><span>小黑屋／救濟</span></div>
                <div class="architecture-owner-panel architecture-owner-roost" data-owner="roost"><b>ROOST</b><span>Model Community</span><span>Osprey</span><span>Coop</span></div>
              </article>
              <article class="architecture-zone architecture-zone-publish">
                <span class="architecture-zone-index">D</span><i class="architecture-zone-icon zone-icon-publish" aria-hidden="true"></i><small>發布</small><strong>內容送往站外</strong><p>保存、存取、跨站流通</p>
                <div class="architecture-owner-panel architecture-owner-matters" data-owner="matters"><b>Matters</b><span>IPFS／IPNS</span><span>Onion／Fediverse</span></div>
                <div class="architecture-owner-panel architecture-owner-roost architecture-owner-gap" data-owner="roost"><b>ROOST</b><span>沒有直接對應工具</span></div>
              </article>
            </div>
            <div class="architecture-foundation"><span>共同底座</span><strong>PostgreSQL</strong><strong>Redis</strong><strong>搜尋與推薦</strong><strong>背景工作</strong></div>
          </div>
          <div class="architecture-map-legend"><span><i class="legend-base"></i>平台底圖</span><span><i class="legend-matters"></i>Matters</span><span><i class="legend-roost"></i>ROOST</span><span><i class="legend-gap"></i>沒有對應</span></div>
          <figcaption>四個步驟都使用同一張底圖。往下捲動時，只會增加或切換模組標籤，方便直接比較。</figcaption>
        </figure>
      </div>
      <div class="architecture-story-column" aria-label="架構圖分段說明">
        <article class="architecture-story is-active" data-scene-trigger="base" data-scene-title="01 平台骨架">
          <div class="architecture-story-heading"><span>01</span><i class="architecture-step-icon step-icon-map" aria-hidden="true"><b></b><b></b><b></b><b></b></i></div>
          <p class="architecture-kicker">先看共同底圖</p>
          <h2>使用者發文後，平台要處理哪些事</h2>
          <p>讀者在前台發文、留言或檢舉，平台核心負責權限、內容狀態、排序與通知。資料庫和工作佇列保存紀錄，發布元件再把部分內容送到站外。</p>
          <p>治理決定最後都要回到產品。摺疊留言、降低曝光、凍結帳號或恢復內容，都必須改變平台裡的實際狀態。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="matters" data-scene-title="02 Matters 模組">
          <div class="architecture-story-heading"><span>02</span><i class="architecture-step-icon step-icon-matters" aria-hidden="true"><b></b><b></b><b></b></i></div>
          <p class="architecture-kicker">加上 Matters 的做法</p>
          <h2>偵測、審查與申訴直接接在產品上</h2>
          <p>垃圾模型找單篇內容，集團偵測找跨帳號行為，海巡把已知樣態送進候選清單。站務人員在里長室處理較廣的案件，守望相助隊則只處理權限範圍內的垃圾留言。</p>
          <p>小黑屋調整內容曝光，救濟機制負責申訴、覆核與恢復。IPFS、Onion 與 Fediverse 位在發布端，處理保存、存取與跨站流通。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="roost" data-scene-title="03 ROOST 工具">
          <div class="architecture-story-heading"><span>03</span><i class="architecture-step-icon step-icon-roost" aria-hidden="true"><b></b><b></b><b></b></i></div>
          <p class="architecture-kicker">換看 ROOST</p>
          <h2>Model Community、Osprey、Coop 各接一段</h2>
          <p>Model Community 提供模型與評估材料。Osprey 接收平台事件，套用規則並協助調查。Coop 接收內容與檢舉，安排自動規則或人工審查，保存決定與申訴，再用 callback 請平台執行處置。</p>
          <p>ROOST 不會替平台決定政策，也不會自動補上審查人員、權限、使用者通知或發布系統。這些工作仍由採用工具的平台負責。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="compare" data-scene-title="04 並排比較">
          <div class="architecture-story-heading"><span>04</span><i class="architecture-step-icon step-icon-compare" aria-hidden="true"><b></b><b></b></i></div>
          <p class="architecture-kicker">把兩邊放在一起</p>
          <h2>ROOST 補工具，Matters 保留平台規則</h2>
          <p>Matters 的模組知道文章、留言、帳號、推薦面與社群角色。ROOST 提供可在不同平台重用的模型資源、事件調查與審查工具。</p>
          <p>若要整合，可以先把 Model Community 與 Osprey 接到偵測、調查層，再用 Coop 管理 Queue、Decision 與 Appeal。最終處置、社群制度與抗審查發布仍由 Matters 負責。</p>
        </article>
      </div>
    </section>
    <section class="architecture-section architecture-section-matters" id="matters-modules" aria-labelledby="matters-modules-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">Matters 治理模組</p>
        <h2 id="matters-modules-title">Matters 的治理模組各放在哪裡</h2>
        <p>這些名稱有的是程式模組，有的是操作介面或社群制度。以下逐項說明用途，以及從公開資料還無法確認的部分。</p>
      </div>
      <div class="architecture-module-grid">
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>偵測</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>垃圾模型</h3>
          <p>文章、留言與動態可保存 <code>spam_score</code> 及人工標記。模型適合提供排序、分流與候選線索，實際排除範圍仍取決於內容類型、功能開關及產品查詢。</p>
          <p>管理員標記、守望相助結果與申訴翻案可以留在本地資料中，繼續用來整理華語社群的垃圾樣態。</p>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>調查</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>集團偵測</h3>
          <p>內容模型只看單篇文本，容易漏掉多個新帳號反覆張貼相似模板的行為。集團偵測改看跨帳號重複、近似內容、外部實體與帳號特徵，再建立可審查的 ring 候選。</p>
          <p>後端已有候選、成員、事件、凍結、解凍與誤判處理資料流，里長室也有集團清單。自動凍結門檻與排程是否啟用仍屬正式環境設定。</p>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>營運介面</span><i class="status-dot status-check"></i>上線狀態另查</div>
          <h3>Matters 里長室</h3>
          <p><code>matters-oss-next</code> 是站務控制面，整理文章、留言、動態、帳號、垃圾排行、守望相助、集團偵測、限制名單、聯邦宇宙佇列與功能開關。</p>
          <p>它把既有 GraphQL 能力變成可操作介面。程式庫可確認功能範圍，實際部署位置、權限與新舊後台切換仍需分開驗證。</p>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>社群審查</span><i class="status-dot status-public"></i>公開頁可驗證</div>
          <h3>守望相助隊</h3>
          <p>受信任成員可處理範圍明確的垃圾留言，公開紀錄包含理由、時間、執行者顯示名稱、申訴與站方覆核狀態。這項權限不包含刪除文章或停權帳號。</p>
          <p>公開紀錄讓外界看得到處置，有限權限避免志工碰到過重的決定，站方則保留覆核與恢復權。</p>
          <a href="https://community-watch.matters.town/">查看公開頁 <span aria-hidden="true">↗</span></a>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>自動化</span><i class="status-dot status-check"></i>運行狀態另查</div>
          <h3>海巡與 Coastguard</h3>
          <p>海巡機器人使用留言垃圾模型與守望相助的既有移除樣本掃描候選，並保留候選來源及處置紀錄。社群過去做過的判斷因此可以再次用於篩選。</p>
          <p>候選池、精度門檻、執行環境與人為核准模式會影響實際覆蓋率，不能只用模型檔案推斷目前自動處置範圍。</p>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>能見度</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>小黑屋</h3>
          <p><code>user_restriction</code> 可限制作者進入熱門或最新等發現面。內容與帳號仍存在，治理介入點落在排序及曝光，與直接刪除內容不同。</p>
          <p>它也與帳號 <code>frozen</code> 狀態不同。前者調節特定發現面，後者是更重的帳號狀態，兩者不應在政策說明或後台操作中混為一談。</p>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>救濟</span><i class="status-dot status-public"></i>公開頁可驗證</div>
          <h3>申訴、覆核與透明度</h3>
          <p>救濟包含案件、事件、通知、申訴、人工覆核、恢復及透明度彙整。後端已有 moderation case／event 與彙整服務，公開頁也提供申訴入口及制度說明。</p>
          <p>仍要確認三件事，原處置能否撤回、使用者是否收到結果，以及透明度數字是否排除敏感資料。</p>
          <a href="https://matters.town/appeals">查看申訴與救濟中心 <span aria-hidden="true">↗</span></a>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>發布韌性</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>抗審查與跨站流通</h3>
          <p>IPFS／IPNS 處理可驗證的靜態發布，Onion Gateway 提供 Tor 存取入口，Fediverse Gateway 承擔 ActivityPub 投遞、狀態與重試。三者處理的是保存、存取與互通，不是內容分類。</p>
          <p>這些元件保護合法內容免於單點封鎖，也讓作者保有較長期的內容可攜性。</p>
        </article>
      </div>
    </section>
    <section class="architecture-section architecture-section-roost" id="roost-modules" aria-labelledby="roost-modules-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">ROOST 工具對位</p>
        <h2 id="roost-modules-title">三個核心專案各自負責什麼</h2>
        <p>ROOST 的工具不綁定單一社群產品。可以只導入目前缺少的一段，也可以依序接上偵測資源、事件調查與審查處置。</p>
      </div>
      <div class="architecture-roost-flow" aria-label="ROOST 核心工具資料流">
        <article>
          <span>01</span><small>Detection resources</small><h3>Model Community</h3>
          <p>提供開放安全模型、政策套件、評估方法及導入資源。它供應偵測材料，本身不是平台的即時處置服務。</p>
          <a href="https://mashbean.github.io/model-community/">閱讀繁中資料 <b aria-hidden="true">↗</b></a>
        </article>
        <i aria-hidden="true">→</i>
        <article>
          <span>02</span><small>Rules & investigation</small><h3>Osprey</h3>
          <p>接收事件串流，以 SML 規則擷取 Features、辨識 Entities、套用 Labels、產生 Effects 與 Verdicts，並讓分析人員查詢及回看事件。</p>
          <a href="https://mashbean.github.io/osprey/">閱讀繁中指南 <b aria-hidden="true">↗</b></a>
        </article>
        <i aria-hidden="true">→</i>
        <article>
          <span>03</span><small>Review & enforcement</small><h3>Coop</h3>
          <p>管理 Item、Policy、Signal、Rule、Report、Queue、Decision、Action 與 Appeal。Action 透過 callback 回到平台，因此最終產品狀態仍由平台掌握。</p>
          <a href="user/concepts.html">閱讀 Coop 概念 <b aria-hidden="true">→</b></a>
        </article>
      </div>
      <aside class="architecture-ecosystem-note">
        <strong>生態系資源的角色</strong>
        <p>Awesome Safety Tools 是工具清單，ROOST Community 收錄協作與專案治理資料，Playground 和 Integration Example 提供示範。它們可用來研究與試作，但不會直接處理平台上的內容。</p>
      </aside>
    </section>
    <section class="architecture-section architecture-section-differences" id="architecture-differences" aria-labelledby="architecture-differences-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">差異盤點</p>
        <h2 id="architecture-differences-title">同一項工作，Matters 與 ROOST 怎麼做</h2>
        <p>兩邊有不少相似功能，負責的範圍卻不同。以下直接比較誰掌握產品資料、誰執行處置，以及整合時還要補哪些工作。</p>
      </div>
      <div class="architecture-comparison" role="table" aria-label="Matters 與 ROOST 差異比較">
        <div class="architecture-comparison-head" role="row">
          <span role="columnheader">比較面向</span><span role="columnheader">Matters</span><span role="columnheader">ROOST</span><span role="columnheader">實際接點</span>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">系統範圍</strong><p role="cell">完整社群產品，治理直接連到內容、帳號、排序、通知與發布。</p><p role="cell">可獨立部署的治理工具與社群資源，不提供完整社群產品。</p><p role="cell">ROOST 接入 Matters API，產品狀態仍由 Matters 決定。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">偵測模型</strong><p role="cell">使用在地資料與人工回饋，模型與內容類型、查詢及功能開關緊密相連。</p><p role="cell">Model Community 提供跨平台模型、政策套件與評估資源，Coop 可接外部 Signals。</p><p role="cell">先用繁中資料重新評估，再把模型輸出轉成 Signal，不能直接沿用他處門檻。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">協同行為</strong><p role="cell">集團偵測理解 Matters 的文章、動態、帳號歷史、發現面與凍結狀態。</p><p role="cell">Osprey 提供 Events、Entities、Labels、Rules 與調查能力，平台需自行定義資料及關係。</p><p role="cell">把 Matters 事件與帳號關係映射成 Osprey Entity schema，再保留本地護欄。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">人為治理</strong><p role="cell">里長室服務站務人員，守望相助隊另有社群角色、有限權限與公開紀錄。</p><p role="cell">Coop 提供組織內 Queue、審查權限、Decision 與 Action，不預設志工制度。</p><p role="cell">可以用 Coop 管理工作流，成員資格、公開程度與問責規則仍由社群制定。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">處置控制</strong><p role="cell">原生 mutation 可直接改變內容、帳號、限制與推薦查詢。</p><p role="cell">Coop 以 callback 要求平台執行 Action，Osprey 回傳 Verdict 或 Effect。</p><p role="cell">Action handler 必須冪等、有權限檢查，並可回報成功或失敗。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">申訴與透明度</strong><p role="cell">案件、事件、公開紀錄、站方覆核、恢復與透明度頁面都在產品內。</p><p role="cell">Coop 可路由 Appeal、記錄決策及回傳結果，外部通知與反向 Action 由平台完成。</p><p role="cell">將 Matters 案件識別、原決策及恢復結果對應到 Coop Appeal，避免稽核斷裂。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">抗審查發布</strong><p role="cell">另有 IPFS／IPNS、Onion 與 Fediverse 元件，處理保存、存取及互通。</p><p role="cell">目前核心工具聚焦線上安全工作流，沒有直接對應的內容發布韌性層。</p><p role="cell">保留 Matters 發布元件。Mirror 只處理程式庫鏡像，不能代替內容可用性。</p>
        </div>
      </div>
    </section>
    <section class="architecture-section architecture-integration" aria-labelledby="architecture-integration-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">整合草圖</p>
        <h2 id="architecture-integration-title">如果 Matters 要接 ROOST，資料可以這樣走</h2>
      </div>
      <ol class="architecture-integration-flow">
        <li><span>01</span><div><strong>送出事件與內容</strong><p>Matters 將必要且最小化的 Item、Report 或事件送至 Osprey／Coop。</p></div></li>
        <li><span>02</span><div><strong>加入本地訊號</strong><p>垃圾模型、集團線索與社群處理結果轉成可追溯的 Signals 或 Labels。</p></div></li>
        <li><span>03</span><div><strong>調查與分流</strong><p>Osprey 找出事件模式，Coop Rules 將案件送往站務、守望相助或專門 Queue。</p></div></li>
        <li><span>04</span><div><strong>回到產品執行</strong><p>Matters Server 驗證 callback，再執行摺疊、限制、凍結、恢復或通知。</p></div></li>
        <li><span>05</span><div><strong>完成救濟與公開</strong><p>把 Appeal、覆核、反向動作與匿名化透明度指標接回既有制度。</p></div></li>
      </ol>
      <aside>
        <strong>整合時不要漏掉</strong>
        <p>守望相助隊的有限權限與公開紀錄、小黑屋和凍結的政策區分、華語垃圾樣態，以及 IPFS／Onion／Fediverse 發布流程，都是 Matters 已有的規則。接入通用工具時，需要逐項保留。</p>
      </aside>
    </section>
    <section class="architecture-sources" aria-labelledby="architecture-sources-title">
      <div>
        <p class="architecture-kicker">來源與限制</p>
        <h2 id="architecture-sources-title">本頁查了哪些來源</h2>
        <p>本頁以 2026 年 8 月 8 日取得的公開程式庫預設分支為基準，也檢查公開頁面是否可存取。程式碼可用來確認功能放在哪裡，正式環境設定、資料品質與實際處置仍需營運端證據。</p>
      </div>
      <div class="architecture-source-groups">
        <details open>
          <summary>Matters 核心與治理來源</summary>
          <ul>
            <li><a href="https://github.com/thematters/matters-server/tree/12adb2dfd346dff705a47bbc1439a6b94c5d3b50">matters-server</a>　GraphQL、領域服務、限制、案件、透明度、IPFS 發布</li>
            <li><a href="https://github.com/thematters/matters-web/tree/4dfc916ec72f1b268e90c32fc56c900b877c6a55">matters-web</a>　公開社群產品介面</li>
            <li><a href="https://github.com/thematters/matters-oss-next/tree/726c54e58cea6a147686a93c7ccec9668f8be376">matters-oss-next</a>　里長室與站務工作流</li>
            <li><a href="https://github.com/thematters/community-watch/tree/b4e282b04c218c024c670f60d2f18258f7323cba">community-watch</a>　守望相助規則與公開紀錄</li>
            <li><a href="https://github.com/thematters/spam-detection-scaffold/tree/f66d301e6409f2776bd31205c636c28d3b25e26c">spam-detection-scaffold</a>　垃圾模型與集團偵測</li>
            <li><a href="https://github.com/thematters/matters-coastguard-bot/tree/115a32b9e8ac3b84d0687f9bfaf39cb635acb5d6">matters-coastguard-bot</a>　留言候選與海巡自動化</li>
          </ul>
        </details>
        <details>
          <summary>發布韌性與互通來源</summary>
          <ul>
            <li><a href="https://github.com/thematters/matters-ipfs/tree/a8a6c9e1a5a6d381870bfc0d119f57db5541c39c">matters-ipfs</a></li>
            <li><a href="https://github.com/thematters/ipns-site-generator/tree/c849b53fb8e1577fdb7f7239764d39f04c1da744">ipns-site-generator</a></li>
            <li><a href="https://github.com/thematters/matters-onion-gateway/tree/9153d97653630437cbeb2b99d483983281fce520">matters-onion-gateway</a></li>
            <li><a href="https://github.com/thematters/matters-fediverse-gateway/tree/ac2f2d21397b6dc671e35fb4ea86799750d8f864">matters-fediverse-gateway</a></li>
          </ul>
        </details>
        <details>
          <summary>ROOST 對位來源</summary>
          <ul>
            <li><a href="https://github.com/roostorg/coop">Coop</a>　審查、規則、處置與申訴</li>
            <li><a href="https://github.com/roostorg/osprey/tree/699ff64b6ef7891f948a921b05a5d47c91d743e8">Osprey</a>　事件規則與調查</li>
            <li><a href="https://github.com/roostorg/model-community/tree/41b6f1306893bd4e088e1866844efde4e16c6fc6">Model Community</a>　開放安全模型與政策資源</li>
          </ul>
        </details>
      </div>
    </section>
  </main>
  <footer class="architecture-footer">
    <p>非官方、由 mashbean 維護的台灣繁體中文架構盤點</p>
    <div><a href="./">回到介紹頁</a><a href="attribution.html">授權與翻譯聲明</a><a href="https://github.com/mashbean/coop">查看 repository</a></div>
  </footer>
</div>
