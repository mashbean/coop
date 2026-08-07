# 自訂整合

Coop 支援 **plugin 形式的整合**。作者可將整合發布為獨立套件，例如 npm package；採用者不需修改 Coop 原始碼，只要透過**設定檔**啟用。平台啟動時會載入每個啟用的 plugin，並使用 manifest 提供的 metadata，包括標題、文件、標誌、model card 與設定欄位。採用者不需編輯 enums、server registries 或 client logo maps，只需安裝套件並編輯 integrations 設定檔。

## 給整合作者

您需要建立匯出 **plugin** 的套件，包括 manifest 與選用 Signals。Manifest 描述整合的 id、名稱、版本、文件連結、標誌、設定欄位，以及所提供的 Signals。標誌可以是套件內由平台提供的檔案，也可以使用網址。若整合需要每個組織個別設定，例如 API keys，請在 manifest 定義欄位，平台會產生設定表單並保存值。

完整參考實作見範例套件 [**`coop-integration-example`**](https://github.com/roostorg/coop-integration-example)。其中包含 manifest、設定欄位、model card、標誌與範例 Signal。建立自訂整合時請以此為範本，contract 與 types 位於 `@roostorg/coop-types`。

## 給採用者

1. 在 server app **安裝**整合套件，例如 `npm install @roostorg/coop-integration-example`
2. 從 integrations 設定檔**啟用**。Server 預設讀取 `server/integrations.config.json`，也可讀取 `INTEGRATIONS_CONFIG_PATH` 指定的路徑。結構範例如下

   ```json
   {
     "integrations": [
       { "package": "@roostorg/coop-integration-example", "enabled": true }
     ]
   }
   ```

   本機開發若使用本機套件，可設定為 `"package": "../coop-integration-example"`，路徑相對於設定檔所在目錄。不要把 secrets 放入設定檔。API keys 等資料應使用應用程式內的整合設定流程。

3. 從使用者介面**使用**。整合會顯示在 integrations 頁面，組織可以設定內容。若 plugin 提供 Signals，這些 Signals 會與內建 Signals 一樣顯示在 Rule builder

## 安全與維護提醒

- 安裝 plugin 等同將第三方程式碼加入 Coop server。導入前應檢查來源、授權、維護狀態、相依套件、已知漏洞與發布完整性
- 依 Coop 專案規則，新增或升級任何套件都需要人工核准，並應提交對應 lockfile 變更
- Manifest 的外部標誌網址與文件連結會產生對外 request，應確認內容安全政策與隱私影響
- Plugin 可取得的設定與 Item 資料應採最小權限。卸載時也需規劃 secrets、設定值、紀錄與衍生資料的清理方式
