#!/usr/bin/env node

import { access, copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, "..");
const bookRoot = path.resolve(process.argv[2] ?? path.join(localeRoot, "book"));
const indexPath = path.join(bookRoot, "index.html");
const socialImagePath = path.join(
  bookRoot,
  "assets",
  "coop-zh-hant-tw-social.png",
);
const sourceCssPath = path.join(localeRoot, "theme", "landing.css");
const outputCssPath = path.join(bookRoot, "landing.css");

const pageUrl = "https://roost.mashbean.net/";
const imageUrl = `${pageUrl}assets/coop-zh-hant-tw-social.png`;
const title = "Coop 台灣繁體中文指南｜小型社群的開放內容治理工具";
const description =
  "ROOST Coop 的台灣繁體中文指南，協助小型社群理解內容治理、人工審查、申訴、稽核與技術導入。";

await Promise.all([access(socialImagePath), access(sourceCssPath)]);

const generatedHtml = await readFile(indexPath, "utf8");
const fragmentStart = generatedHtml.indexOf('<div class="coop-landing">');
const fragmentEnd = generatedHtml.indexOf("</main>", fragmentStart);

if (fragmentStart === -1 || fragmentEnd === -1) {
  throw new Error("Unable to find the rendered landing page fragment");
}

const landingFragment = generatedHtml.slice(fragmentStart, fragmentEnd).trim();
const standaloneHtml = `<!doctype html>
<html lang="zh-Hant-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#102734">
    <title>${title}</title>
    <link rel="icon" href="favicon-de23e50b.svg" type="image/svg+xml">
    <link rel="canonical" href="${pageUrl}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="zh_TW">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Coop 台灣繁體中文指南">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <link rel="stylesheet" href="landing.css">
  </head>
  <body>
    <a class="skip-link" href="#main-content">跳到主要內容</a>
    <main class="landing-site" id="main-content">
      ${landingFragment}
    </main>
  </body>
</html>
`;

await Promise.all([
  writeFile(indexPath, standaloneHtml),
  copyFile(sourceCssPath, outputCssPath),
]);

console.log("Standalone landing page built");
