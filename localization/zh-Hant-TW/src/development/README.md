# 開始使用

本頁協助第一次進行 Coop 本機開發時快速完成設定。若要測試與展示，可改用 [Docker Images](docker.md)。

> [!NOTE]
> 建議先熟悉 Coop 的[基本概念](../user/concepts.md)，取得更多脈絡。

本指南假設讀者了解基本命令列操作，例如從 Terminal 使用 `bash` 或 `zsh`。Prerequisites、詳細設定、疑難排解等資訊，見英文版 [Local Development](https://roostorg.github.io/coop/latest/development/local.html)。也可閱讀英文版 [Architecture](https://roostorg.github.io/coop/latest/development/architecture.html)。

執行 Coop 的步驟如下。

0. 若尚未完成，使用 `git` **clone repository** 並進入 `coop` 資料夾

   ```sh
   git clone https://github.com/roostorg/coop.git && cd coop
   ```

1. 確認已安裝 **prerequisites**，包括 `nvm`、`docker` 與正確版本的 Node.js

   ```sh
   # coop/
   nvm --version && nvm install && nvm use
   docker --version
   ```

   應看到類似下列 output。

   ```text
   0.40.4
   Found '.nvmrc' with version <24.18.0>
   v24.18.0 is already installed.
   Now using node v24.18.0 (npm v11.11.0)
   Docker version 29.4.3, build 055a478
   ```

   若出現 error，請參閱英文版 [Prerequisites](https://roostorg.github.io/coop/latest/development/local.html#prerequisites)。版本範例只代表此文件來源當時狀態，實際版本應以 repository 的 `.nvmrc` 與目前文件為準。

2. 從 root folder 與各 sub-package 使用 `npm` **安裝 dependencies**

   ```sh
   # coop/
   npm install
   (cd db && npm install)
   (cd server && npm install)
   (cd client && npm install)
   ```

3. 在 `db/`、`server/` 與 `client/` **複製範例 environment files**。預設值可供本機開發與展示使用。詳情見英文版 [Environment Setup](https://roostorg.github.io/coop/latest/development/local.html#environment-setup)

   ```sh
   # coop/
   cp db/.env.example db/.env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **啟動所有 backing services**，包括 databases 與 Queues。Ports 與詳細資訊見英文版 [Docker Services](https://roostorg.github.io/coop/latest/development/local.html#docker-services)

   ```sh
   # coop/
   npm run up
   ```

   等待 PostgreSQL、ClickHouse、ScyllaDB 與 Redis 進入 healthy 狀態後再繼續。可使用 `docker ps` 查看進度。

5. **建立 databases** 並執行 migrations，確認設定正確

   ```sh
   # coop/
   npm run db:create -- --env staging --db api-server-pg
   npm run db:create -- --env staging --db scylla
   npm run db:create -- --env staging --db clickhouse

   npm run db:update -- --env staging --db api-server-pg
   npm run db:update -- --env staging --db scylla
   npm run db:update -- --env staging --db clickhouse
   ```

6. 使用 `server/` folder 中的 script **複製 static asset files**

   ```sh
   # coop/
   cd server

   # coop/server/
   npm run copy-assets
   ```

7. 從 `server/` folder 使用 `create-org` script，提供適當資訊，**建立 organization 與 admin user**

   範例如下。

   ```sh
   # coop/server/
   npm run create-org -- \
     --name "Your Organization" \
     --website "https://example.com" \
     --email "email@example.com" \
     --firstName "Jane" \
     --lastName "Doe" \
     --password "correct-horse-battery-staple"
   ```

   Script 會輸出 org ID 與初始 API key，請立即複製並保存在安全位置。

8. 最後**啟動 application**。其他選項，包括為除錯分別啟動不同 components，見英文版 [Running the Application](https://roostorg.github.io/coop/latest/development/local.html#running-the-application)

   若仍在 `server/`，先回到 project root，再啟動 server 與 client。

   ```sh
   # coop/server
   cd ..

   # coop/
   npm run start
   ```

   使用執行 `create-org` 時提供的 credentials，從 [localhost:3000](http://localhost:3000)登入。第一次載入可能需要一點時間。

## 本機安全提醒

- `.env`、初始 API key、admin password 與 signing keys 不得 commit、貼入 issue 或公開終端輸出
- 範例中的 `staging`、localhost 與預設 credentials 只適合隔離的本機環境，不應直接搬到正式環境
- 執行 migration 前應確認目標 database 與 environment，尤其避免將 staging seed data 寫入 production
- 本機媒體與兒少安全整合測試只能使用安全合成資料，不得使用真實 CSAM、私密影像或可識別個案
