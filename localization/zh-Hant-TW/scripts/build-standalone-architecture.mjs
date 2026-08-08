#!/usr/bin/env node

import { access, copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, "..");
const bookRoot = path.resolve(process.argv[2] ?? path.join(localeRoot, "book"));
const pagePath = path.join(bookRoot, "matters-roost.html");
const sourceCssPath = path.join(localeRoot, "theme", "architecture.css");
const sourceJsPath = path.join(localeRoot, "theme", "architecture.js");
const outputCssPath = path.join(bookRoot, "architecture.css");
const outputJsPath = path.join(bookRoot, "architecture.js");

const pageUrl = "https://roost.mashbean.net/matters-roost.html";
const title = "Matters 治理架構與 ROOST 工具對照";
const description =
  "查看 Matters 平台骨架與治理模組，並比較 Model Community、Osprey、Coop 分別能接在哪裡。";

await Promise.all([
  access(pagePath),
  access(sourceCssPath),
  access(sourceJsPath),
]);

const generatedHtml = await readFile(pagePath, "utf8");
const fragmentStart = generatedHtml.indexOf('<div class="architecture-page"');
const fragmentEnd = generatedHtml.indexOf("</main>", fragmentStart);

if (fragmentStart === -1 || fragmentEnd === -1) {
  throw new Error("Unable to find the rendered architecture page fragment");
}

const architectureFragment = generatedHtml
  .slice(fragmentStart, fragmentEnd)
  .trim();
const standaloneHtml = `<!doctype html>
<html lang="zh-Hant-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#142f38">
    <title>${title}</title>
    <link rel="icon" href="favicon-de23e50b.svg" type="image/svg+xml">
    <link rel="canonical" href="${pageUrl}">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="zh_TW">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${pageUrl}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <link rel="stylesheet" href="architecture.css">
    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
    <script defer src="architecture.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#architecture-map">跳到架構圖</a>
    ${architectureFragment}
  </body>
</html>
`;

await Promise.all([
  writeFile(pagePath, standaloneHtml),
  copyFile(sourceCssPath, outputCssPath),
  copyFile(sourceJsPath, outputJsPath),
]);

console.log("Standalone architecture page built");
