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
        <h1 id="architecture-title">同一張社群平台底圖，看懂兩套治理方法</h1>
        <p class="architecture-lead">先把一個社群平台拆成介面、產品、治理、資料與發布五個層次，再把 Matters 已建立的治理模組及 ROOST 開放工具放回正確位置。這樣能看見哪些能力可以互相對位，哪些差異源自平台制度與社群脈絡。</p>
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
      <p>程式庫中存在的模組，代表可以定位實作與責任邊界，不等同每項功能都已在正式環境啟用。模型門檻、功能開關、排程及自動處置狀態仍需由營運端另行確認。</p>
    </aside>
    <section class="architecture-scrolly" id="architecture-map" aria-labelledby="architecture-map-title">
      <div class="architecture-visual-column">
        <figure class="architecture-map">
          <div class="architecture-map-header">
            <div>
              <p>共同架構底圖</p>
              <h2 id="architecture-map-title">一個社群平台如何運作</h2>
            </div>
            <span class="architecture-scene-label" aria-live="polite">平台基礎</span>
          </div>
          <div class="architecture-stack">
            <section class="architecture-layer architecture-layer-surface" data-layer="surface">
              <header><span>01</span><div><small>Surface</small><strong>使用者與產品介面</strong></div></header>
              <div class="architecture-node-grid architecture-node-grid-three">
                <article class="architecture-node" data-node="people">
                  <small>People</small><strong>讀者、作者與社群</strong><p>閱讀、創作、互動、檢舉及申訴</p>
                </article>
                <article class="architecture-node" data-node="public-web">
                  <small>Public product</small><strong>Matters Web</strong><p>文章、動態、留言、個人頁與探索介面</p>
                  <div class="architecture-tags"><span class="architecture-tag architecture-tag-matters" data-owner="matters">matters-web</span></div>
                </article>
                <article class="architecture-node" data-node="admin">
                  <small>Operations</small><strong>管理與社群協作介面</strong><p>工作清單、審查、設定與公開紀錄</p>
                  <div class="architecture-tags">
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">里長室</span>
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">守望相助隊</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Coop Review Console</span>
                  </div>
                </article>
              </div>
            </section>
            <div class="architecture-flow" aria-hidden="true"><span></span></div>
            <section class="architecture-layer architecture-layer-core" data-layer="core">
              <header><span>02</span><div><small>Product core</small><strong>平台核心與領域服務</strong></div></header>
              <div class="architecture-node-grid architecture-node-grid-two">
                <article class="architecture-node" data-node="api">
                  <small>API gateway</small><strong>GraphQL 與服務入口</strong><p>驗證請求、權限與平台資料契約</p>
                  <div class="architecture-tags"><span class="architecture-tag architecture-tag-matters" data-owner="matters">matters-server</span></div>
                </article>
                <article class="architecture-node" data-node="domains">
                  <small>Domain services</small><strong>內容、帳號、社交與交易</strong><p>決定文章狀態、帳號權限、排序及通知</p>
                  <div class="architecture-tags"><span class="architecture-tag architecture-tag-roost" data-owner="roost">Coop Action callback</span></div>
                </article>
              </div>
            </section>
            <div class="architecture-flow" aria-hidden="true"><span></span></div>
            <section class="architecture-layer architecture-layer-governance" data-layer="governance">
              <header><span>03</span><div><small>Governance plane</small><strong>治理決策層</strong></div></header>
              <div class="architecture-node-grid architecture-node-grid-four">
                <article class="architecture-node" data-node="detect">
                  <small>Detect</small><strong>偵測與訊號</strong><p>內容分數、行為特徵與已知樣態</p>
                  <div class="architecture-tags">
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">垃圾模型</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Model Community</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Coop Signals</span>
                  </div>
                </article>
                <article class="architecture-node" data-node="investigate">
                  <small>Investigate</small><strong>關聯與調查</strong><p>跨帳號模式、事件查詢與群集線索</p>
                  <div class="architecture-tags">
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">集團偵測</span>
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">海巡</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Osprey</span>
                  </div>
                </article>
                <article class="architecture-node" data-node="review">
                  <small>Review</small><strong>人為審查</strong><p>取得脈絡、記錄理由並作成決定</p>
                  <div class="architecture-tags">
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">里長室</span>
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">守望相助</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Coop Queues</span>
                  </div>
                </article>
                <article class="architecture-node" data-node="enforce">
                  <small>Enforce & remedy</small><strong>處置、救濟與稽核</strong><p>限制能見度、恢復內容、通知與透明度</p>
                  <div class="architecture-tags">
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">小黑屋</span>
                    <span class="architecture-tag architecture-tag-matters" data-owner="matters">救濟機制</span>
                    <span class="architecture-tag architecture-tag-roost" data-owner="roost">Coop Appeals</span>
                  </div>
                </article>
              </div>
            </section>
            <div class="architecture-flow" aria-hidden="true"><span></span></div>
            <section class="architecture-layer architecture-layer-data" data-layer="data">
              <header><span>04</span><div><small>Data & async</small><strong>資料與非同步基礎設施</strong></div></header>
              <div class="architecture-node-grid architecture-node-grid-four architecture-node-grid-compact">
                <article class="architecture-node"><small>Records</small><strong>PostgreSQL</strong><p>產品、治理與稽核資料</p></article>
                <article class="architecture-node"><small>Queue & cache</small><strong>Redis</strong><p>快取、工作佇列與事件協調</p></article>
                <article class="architecture-node"><small>Discovery</small><strong>搜尋與推薦</strong><p>內容索引、排序及可見度</p></article>
                <article class="architecture-node"><small>Workers</small><strong>Lambda 與排程</strong><p>模型、發布、通知與背景工作</p></article>
              </div>
            </section>
            <div class="architecture-flow" aria-hidden="true"><span></span></div>
            <section class="architecture-layer architecture-layer-distribution" data-layer="distribution">
              <header><span>05</span><div><small>Distribution</small><strong>發布、互通與抗審查</strong></div></header>
              <div class="architecture-node-grid architecture-node-grid-three architecture-node-grid-compact">
                <article class="architecture-node"><small>Durability</small><strong>IPFS／IPNS</strong><p>靜態內容保存與可驗證發布</p></article>
                <article class="architecture-node"><small>Access</small><strong>Onion Gateway</strong><p>Tor 入口與內容擷取邊界</p></article>
                <article class="architecture-node"><small>Interoperability</small><strong>Fediverse Gateway</strong><p>ActivityPub 投遞與聯邦狀態</p></article>
              </div>
              <div class="architecture-tags architecture-layer-tags">
                <span class="architecture-tag architecture-tag-matters" data-owner="matters">抗審查發布</span>
                <span class="architecture-tag architecture-tag-roost architecture-tag-gap" data-owner="roost">ROOST 無直接對應</span>
              </div>
            </section>
          </div>
          <figcaption>箭頭代表主要資料與決策方向。實際系統包含同步與非同步回路，為了閱讀清楚而省略部分內部連線。</figcaption>
        </figure>
      </div>
      <div class="architecture-story-column" aria-label="架構圖分段說明">
        <article class="architecture-story is-active" data-scene-trigger="base" data-scene-title="平台基礎">
          <span class="architecture-story-number">01</span>
          <p class="architecture-kicker">先看平台本體</p>
          <h2>治理必須接在產品行為上</h2>
          <p>讀者看到的文章、動態與留言由 Matters Web 呈現，Matters Server 管理內容、帳號、社交關係、排序與通知。資料庫與工作佇列支撐日常操作，發布層再把部分內容送往 IPFS、Onion 或聯邦宇宙。</p>
          <p>因此，「移除」、「摺疊」、「降低排序」、「凍結」與「恢復」都不是抽象標籤。每項決定最後都要回到平台核心，改變某個內容或帳號在產品中的實際狀態。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="matters" data-scene-title="Matters 治理模組">
          <span class="architecture-story-number">02</span>
          <p class="architecture-kicker">放入 Matters 標籤</p>
          <h2>治理能力分散在產品、後台與社群制度</h2>
          <p>垃圾模型提供內容分數，集團偵測補足跨帳號行為線索，海巡把已知樣態轉成候選或處置。里長室讓站務人員檢視清單及採取動作，守望相助隊則把一部分明確垃圾留言交由受信任社群成員處理。</p>
          <p>小黑屋影響內容能否進入特定發現面，救濟機制串起案件、理由、申訴、覆核、恢復與透明度。抗審查發布位於更外圍，處理內容如何保存、存取及跨站流通。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="roost" data-scene-title="ROOST 對位">
          <span class="architecture-story-number">03</span>
          <p class="architecture-kicker">放入 ROOST 標籤</p>
          <h2>三組工具覆蓋治理迴路的不同位置</h2>
          <p>Model Community 提供開放安全模型、政策套件與評估資源，可成為偵測層的輸入。Osprey 接收平台事件，運行規則、標記實體、回傳結果並支援調查。Coop 接收內容與檢舉，執行規則、路由人工審查、記錄決策，再透過 callback 要求平台執行 Action。</p>
          <p>ROOST 的強項在可拆裝與跨平台重用。平台仍需提供資料契約、權限、政策、審查人員、反向動作及使用者通知。</p>
        </article>
        <article class="architecture-story" data-scene-trigger="compare" data-scene-title="差異與接點">
          <span class="architecture-story-number">04</span>
          <p class="architecture-kicker">最後疊在一起</p>
          <h2>可以互補，不能直接互換</h2>
          <p>Matters 的治理模組長在單一社群產品裡，理解文章、動態、留言、帳號、頻道、推薦與社群角色。ROOST 把偵測、事件調查與審查流程抽象成可移植元件，適合在不同平台之間重用。</p>
          <p>若 Matters 導入 ROOST，最自然的方式是保留既有社群制度與產品處置，將 Osprey 或 Model Community 接入訊號與調查層，再用 Coop 統整 Queue、Decision、Appeal 與稽核。抗審查發布仍由 Matters 的 IPFS、Onion 與 Fediverse 元件承擔。</p>
        </article>
      </div>
    </section>
    <section class="architecture-section architecture-section-matters" id="matters-modules" aria-labelledby="matters-modules-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">Matters 治理模組</p>
        <h2 id="matters-modules-title">一套從發現異常到恢復權利的產品內治理</h2>
        <p>以下名稱有些是程式模組，有些是操作介面或社群制度。把它們放回架構層次後，責任邊界會比只看功能清單清楚。</p>
      </div>
      <div class="architecture-module-grid">
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>偵測</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>垃圾模型</h3>
          <p>文章、留言與動態可保存 <code>spam_score</code> 及人工標記。模型適合提供排序、分流與候選線索，實際排除範圍仍取決於內容類型、功能開關及產品查詢。</p>
          <p>Matters 的特色是能把管理員標記、守望相助結果與申訴翻案帶回本地資料迴路，形成貼近華語社群的樣本。</p>
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
          <p>受信任成員可處理範圍明確的垃圾留言，公開紀錄包含理由、時間、執行者顯示名稱、申訴與站方覆核狀態。權限刻意不延伸到文章刪除或帳號停權。</p>
          <p>這是一項制度設計，也是一條可稽核資料流。公開紀錄、範圍限制與站方恢復權限共同降低志工治理的風險。</p>
          <a href="https://community-watch.matters.town/">查看公開頁 <span aria-hidden="true">↗</span></a>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>自動化</span><i class="status-dot status-check"></i>運行狀態另查</div>
          <h3>海巡與 Coastguard</h3>
          <p>海巡機器人使用留言垃圾模型與守望相助的既有移除樣本掃描候選。這條路徑的價值在於把社群判斷轉成可重複使用的樣態，同時保留候選來源及處置紀錄。</p>
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
          <p>救濟橫跨案件、事件、通知、申訴、人工覆核、恢復及透明度彙整，不只是一張申訴表單。後端已有 moderation case／event 與彙整服務，公開頁提供申訴入口及制度說明。</p>
          <p>完整閉環仍要確認原處置能否被反向執行、使用者是否收到結果，以及透明度數字是否排除敏感資料。</p>
          <a href="https://matters.town/appeals">查看申訴與救濟中心 <span aria-hidden="true">↗</span></a>
        </article>
        <article class="architecture-module-card">
          <div class="architecture-module-meta"><span>發布韌性</span><i class="status-dot status-code"></i>程式碼可定位</div>
          <h3>抗審查與跨站流通</h3>
          <p>IPFS／IPNS 處理可驗證的靜態發布，Onion Gateway 提供 Tor 存取入口，Fediverse Gateway 承擔 ActivityPub 投遞、狀態與重試。三者處理的是保存、存取與互通，不是內容分類。</p>
          <p>這一層說明平台治理不只涉及刪除有害內容，也包括保護合法內容免於單點封鎖及讓作者保有更長期的可攜性。</p>
        </article>
      </div>
    </section>
    <section class="architecture-section architecture-section-roost" id="roost-modules" aria-labelledby="roost-modules-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">ROOST 工具對位</p>
        <h2 id="roost-modules-title">用三個核心專案組合出治理管線</h2>
        <p>ROOST 專案刻意降低對單一產品資料模型的依賴。採用者可以只導入其中一段，也可以把三者接成偵測、調查、審查與處置迴路。</p>
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
        <p>Awesome Safety Tools 協助尋找可評估工具，ROOST Community 提供協作與專案治理資料，Playground 與 Integration Example 用於示範及學習。這些資源支援採用流程，並不會直接進入平台的即時內容治理資料流。</p>
      </aside>
    </section>
    <section class="architecture-section architecture-section-differences" id="architecture-differences" aria-labelledby="architecture-differences-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">差異盤點</p>
        <h2 id="architecture-differences-title">Matters 的在地治理，與 ROOST 的通用基礎設施</h2>
        <p>兩者處理的問題有大量交集，抽象層次與責任範圍則不同。以下比較採用系統邊界，不以功能名稱是否相似作為唯一判斷。</p>
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
          <strong role="cell">申訴與透明度</strong><p role="cell">案件、事件、公開紀錄、站方覆核、恢復與透明度頁面形成產品內閉環。</p><p role="cell">Coop 可路由 Appeal、記錄決策及回傳結果，外部通知與反向 Action 由平台完成。</p><p role="cell">將 Matters 案件識別、原決策及恢復結果對應到 Coop Appeal，避免稽核斷裂。</p>
        </div>
        <div class="architecture-comparison-row" role="row">
          <strong role="cell">抗審查發布</strong><p role="cell">另有 IPFS／IPNS、Onion 與 Fediverse 元件，處理保存、存取及互通。</p><p role="cell">目前核心工具聚焦線上安全工作流，沒有直接對應的內容發布韌性層。</p><p role="cell">保留 Matters 發布元件。Mirror 只處理程式庫鏡像，不能代替內容可用性。</p>
        </div>
      </div>
    </section>
    <section class="architecture-section architecture-integration" aria-labelledby="architecture-integration-title">
      <div class="architecture-section-heading">
        <p class="architecture-kicker">可能的組合方式</p>
        <h2 id="architecture-integration-title">保留 Matters 的制度，把 ROOST 放進可重用的位置</h2>
      </div>
      <ol class="architecture-integration-flow">
        <li><span>01</span><div><strong>送出事件與內容</strong><p>Matters 將必要且最小化的 Item、Report 或事件送至 Osprey／Coop。</p></div></li>
        <li><span>02</span><div><strong>加入本地訊號</strong><p>垃圾模型、集團線索與社群處理結果轉成可追溯的 Signals 或 Labels。</p></div></li>
        <li><span>03</span><div><strong>調查與分流</strong><p>Osprey 找出事件模式，Coop Rules 將案件送往站務、守望相助或專門 Queue。</p></div></li>
        <li><span>04</span><div><strong>回到產品執行</strong><p>Matters Server 驗證 callback，再執行摺疊、限制、凍結、恢復或通知。</p></div></li>
        <li><span>05</span><div><strong>完成救濟與公開</strong><p>把 Appeal、覆核、反向動作與匿名化透明度指標接回既有制度。</p></div></li>
      </ol>
      <aside>
        <strong>最重要的保留項</strong>
        <p>守望相助隊的有限權限與公開問責、小黑屋和凍結的政策區分、華語垃圾樣態的資料迴路，以及 IPFS／Onion／Fediverse 的發布韌性，都屬於 Matters 的平台知識。導入通用工具時應將其明確建模，不宜被預設設定覆蓋。</p>
      </aside>
    </section>
    <section class="architecture-sources" aria-labelledby="architecture-sources-title">
      <div>
        <p class="architecture-kicker">來源與限制</p>
        <h2 id="architecture-sources-title">可追溯的時間點盤點</h2>
        <p>本頁以 2026 年 8 月 8 日取得的公開程式庫預設分支為基準，並檢查公開頁面是否可存取。程式碼存在用於確認責任邊界，正式環境設定、資料品質與實際處置仍需營運端證據。</p>
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
