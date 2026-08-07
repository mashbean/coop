<div class="coop-landing">
  <header class="landing-local-nav">
    <a class="landing-brand" href="./" aria-label="Coop 台灣繁體中文指南首頁">
      <span class="landing-brand-mark" aria-hidden="true">C</span>
      <span><strong>Coop</strong><small>台灣繁體中文指南</small></span>
    </a>
    <nav aria-label="本頁導覽">
      <a href="#landing-paths-title">依角色開始</a>
      <a href="#landing-flow-title">治理流程</a>
      <a href="#landing-proof-title">驗證方式</a>
      <a class="landing-nav-cta" href="toc.html">完整目錄</a>
    </nav>
  </header>

  <section class="landing-hero" aria-labelledby="landing-title">
    <div class="landing-hero-copy">
      <p class="landing-eyebrow">ROOST 開放原始碼工具 × 台灣繁體中文</p>
      <h1 id="landing-title">讓小型社群，也能開始建立可被檢查的安全治理流程</h1>
      <p class="landing-lead">Coop 將自動規則、人工審查、檢舉、申訴與稽核集中在同一套開放原始碼工具。這份繁中指南協助社群管理者、志工與工程團隊理解流程，再判斷哪些部分適合自己的平台。</p>
      <div class="landing-actions" aria-label="主要入口">
        <a class="landing-button landing-button-primary" href="user/">從使用者指南開始</a>
        <a class="landing-button landing-button-secondary" href="development/">評估技術導入</a>
      </div>
      <ul class="landing-status" aria-label="繁中化狀態">
        <li><strong>37 / 37</strong><span>上游文件完成第一輪翻譯</span></li>
        <li><strong>4 道檢查</strong><span>用語、忠實度、建置與連結</span></li>
        <li><strong>版本可追溯</strong><span>對應固定的英文來源版本</span></li>
      </ul>
    </div>
    <figure class="landing-product-shot">
      <div class="landing-shot-label"><span></span> Coop 內容治理工作台</div>
      <img src="https://raw.githubusercontent.com/roostorg/coop/6e4a158af00c27cdefb01f37c95f7e67f7b27c23/docs/images/overview.png" alt="Coop 儀表板，顯示處置總數、等待審查工作、自動與人工處置比例及常見政策違規">
      <figcaption>規則、審查 Queue 與治理指標維持在自己管理的基礎設施中。</figcaption>
    </figure>
  </section>

  <aside class="landing-disclosure" aria-label="版本與審查狀態">
    <div class="landing-disclosure-mark"><span aria-hidden="true"></span>透明狀態</div>
    <p><strong>第一輪翻譯與自動檢查已完成。</strong>第二位語言審查及法律、兒少安全、資安等領域審查仍為待審查；本文尚未獲 ROOST 上游採納。</p>
    <a href="https://github.com/mashbean/coop/tree/codex/zh-hant-tw-foundation/localization/zh-Hant-TW">查看來源與審查紀錄</a>
  </aside>

  <section class="landing-fit" aria-labelledby="landing-fit-title">
    <p id="landing-fit-title">適合拿來開始評估</p>
    <ul>
      <li><span aria-hidden="true">01</span>志工型社群與論壇</li>
      <li><span aria-hidden="true">02</span>小型內容平台</li>
      <li><span aria-hidden="true">03</span>公民科技專案</li>
    </ul>
  </section>

  <section class="landing-section" aria-labelledby="landing-paths-title">
    <div class="landing-section-heading">
      <p class="landing-kicker">依角色開始</p>
      <h2 id="landing-paths-title">從眼前需要處理的問題進入</h2>
      <p>不必先讀完所有技術文件。可依目前負責的治理工作，選擇最接近的入口。</p>
    </div>
    <div class="landing-path-grid">
      <a class="landing-path-card landing-path-coral" href="user/">
        <div class="landing-card-meta"><span class="landing-card-number">01</span><span>治理團隊</span></div>
        <h3>社群管理與內容審查</h3>
        <p>理解 Item、Policy、Rule、Queue、Decision 與 Action，建立人工審查的共同語言。</p>
        <span class="landing-card-link">前往使用者指南 <b aria-hidden="true">→</b></span>
      </a>
      <a class="landing-path-card landing-path-teal" href="api/">
        <div class="landing-card-meta"><span class="landing-card-number">02</span><span>產品團隊</span></div>
        <h3>產品與平台整合</h3>
        <p>串接內容提交、檢舉、申訴、Partial Items 與 Action callbacks。</p>
        <span class="landing-card-link">查看 API 參考 <b aria-hidden="true">→</b></span>
      </a>
      <a class="landing-path-card landing-path-blue" href="development/">
        <div class="landing-card-meta"><span class="landing-card-number">03</span><span>工程團隊</span></div>
        <h3>工程、資安與維運</h3>
        <p>評估本機開發、驗證機制、Docker、部署、架構與資料倉儲。</p>
        <span class="landing-card-link">閱讀開發指南 <b aria-hidden="true">→</b></span>
      </a>
      <a class="landing-path-card landing-path-gold" href="integrations/">
        <div class="landing-card-meta"><span class="landing-card-number">04</span><span>技術評估</span></div>
        <h3>Signals 與外部服務</h3>
        <p>檢視 HMA、NCMEC、Google、OpenAI、CoPE 與自訂整合的能力及限制。</p>
        <span class="landing-card-link">比較整合方式 <b aria-hidden="true">→</b></span>
      </a>
    </div>
  </section>

  <section class="landing-section landing-flow-section" aria-labelledby="landing-flow-title">
    <div class="landing-section-heading">
      <p class="landing-kicker">完整治理迴路</p>
      <h2 id="landing-flow-title">一套工具，串起決策前後的責任</h2>
      <p>Coop 的價值涵蓋自動化、人工判斷、對外處置、申訴與稽核，不只提供內容分類結果。</p>
    </div>
    <ol class="landing-flow">
      <li><span>01</span><div><strong>接收內容與檢舉</strong><p>平台提交 Items，使用者 Reports 帶入需要處理的脈絡。</p></div></li>
      <li><span>02</span><div><strong>規則評估與路由</strong><p>Signals 與 Rules 協助自動處理，或將工作送入適當 Queue。</p></div></li>
      <li><span>03</span><div><strong>人工審查與照護</strong><p>內容審查員取得必要脈絡，並使用身心健康功能降低暴露風險。</p></div></li>
      <li><span>04</span><div><strong>執行 Action</strong><p>透過 callback 將警告、限制或其他治理決策送回平台。</p></div></li>
      <li><span>05</span><div><strong>申訴與稽核</strong><p>保存決策紀錄、處理 Appeals，讓結果可追蹤且可被複核。</p></div></li>
    </ol>
  </section>

  <section class="landing-section landing-proof-section" aria-labelledby="landing-proof-title">
    <div class="landing-proof-copy">
      <p class="landing-kicker">可驗證，不只可閱讀</p>
      <h2 id="landing-proof-title">每次更新都經過同一組自動檢查</h2>
      <p>繁中內容以來源清單追蹤英文版本，並用單一指令檢查翻譯結構與產生後頁面。自動化結果不會取代人類的語言、法律或領域判斷。</p>
      <a class="landing-text-link" href="https://github.com/mashbean/coop/blob/codex/zh-hant-tw-foundation/localization/zh-Hant-TW/WORKFLOW.md">查看完整工作流程 <span aria-hidden="true">↗</span></a>
    </div>
    <ul class="landing-proof-list">
      <li><span aria-hidden="true">✓</span><div><strong>來源狀態</strong><p>37 份 Markdown 對應固定 commit 與明確審查狀態。</p></div></li>
      <li><span aria-hidden="true">✓</span><div><strong>台灣繁體中文</strong><p>攔截簡體詞候選、語氣混用與已完成頁面的舊英文連結。</p></div></li>
      <li><span aria-hidden="true">✓</span><div><strong>技術忠實度</strong><p>核對 code blocks、inline tokens、圖片、表格與 style blocks。</p></div></li>
      <li><span aria-hidden="true">✓</span><div><strong>可用頁面</strong><p>完成 mdBook build，再檢查內部頁面、錨點與靜態資源。</p></div></li>
    </ul>
  </section>

  <section class="landing-safety" aria-labelledby="landing-safety-title">
    <div class="landing-safety-icon" aria-hidden="true">!</div>
    <div>
      <p class="landing-kicker">使用前請留意</p>
      <h2 id="landing-safety-title">工具與翻譯都不能代替組織責任</h2>
      <p>NCMEC 是美國制度；文件內容不構成台灣法律意見，也不代表平台已完成權限、資料保存、事件應變、申訴及正式部署驗證。任何兒少安全整合測試都不得使用真實 CSAM、私密影像或可識別個案資料。</p>
    </div>
  </section>

  <section class="landing-final-cta" aria-labelledby="landing-cta-title">
    <p class="landing-kicker">開始建立共同語言</p>
    <h2 id="landing-cta-title">先理解治理元件，再決定要自動化多少</h2>
    <p>從基本概念認識 Coop 的資料模型與流程，或直接查看完整目錄。</p>
    <div class="landing-actions landing-actions-centered">
      <a class="landing-button landing-button-primary" href="user/concepts.html">閱讀基本概念</a>
      <a class="landing-button landing-button-secondary" href="toc.html">查看完整目錄</a>
    </div>
  </section>

  <footer class="landing-footer">
    <p>Coop 由 <a href="https://roost.tools">ROOST</a> 推出。本繁中工作區維護於 <a href="https://github.com/mashbean/coop">mashbean/coop</a> fork。</p>
    <p><a href="attribution.html">授權與翻譯聲明</a> · <a href="project-overview.html">專案概覽</a></p>
  </footer>
</div>
