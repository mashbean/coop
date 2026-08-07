#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const bookRoot = path.resolve(process.argv[2] ?? "localization/zh-Hant-TW/book");
const indexPath = path.join(bookRoot, "index.html");
const imagePath = path.join(bookRoot, "assets", "coop-zh-hant-tw-social.png");
const pageUrl = "https://mashbean.github.io/coop/";
const imageUrl = `${pageUrl}assets/coop-zh-hant-tw-social.png`;
const title = "Coop 台灣繁體中文指南｜小型社群的開放內容治理工具";
const description = "ROOST Coop 的台灣繁體中文指南，協助小型社群理解內容治理、人工審查、申訴、稽核與技術導入。";
const marker = "<!-- Coop landing metadata -->";

await access(imagePath);

let html = await readFile(indexPath, "utf8");

if (!html.includes(marker)) {
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace('<meta name="description" content="">', `<meta name="description" content="${description}">`)
    .replace('<meta name="theme-color" content="#ffffff">', '<meta name="theme-color" content="#fffdf8">')
    .replace(
      "    </head>",
      `        ${marker}
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
    </head>`,
    );
}

if (!html.includes(marker) || !html.includes(imageUrl)) {
  throw new Error("Unable to inject landing page metadata");
}

await writeFile(indexPath, html);
console.log("Landing page metadata injected");
