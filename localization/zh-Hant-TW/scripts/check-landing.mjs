#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, "..");
const bookRoot = path.resolve(process.argv[2] ?? path.join(localeRoot, "book"));
const indexHtml = await readFile(path.join(bookRoot, "index.html"), "utf8");
const landingCss = await readFile(path.join(localeRoot, "theme", "landing.css"), "utf8");
const socialImage = await readFile(
  path.join(bookRoot, "assets", "coop-zh-hant-tw-social.png"),
);

const errors = [];

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function count(pattern) {
  return [...indexHtml.matchAll(pattern)].length;
}

expect(indexHtml.includes('class="landing-local-nav"'), "missing local navigation");
expect(indexHtml.includes('aria-label="本頁導覽"'), "missing navigation label");
expect(count(/class="landing-path-card\b/g) === 4, "expected four role cards");
expect(count(/<li><span>0[1-5]<\/span>/g) === 5, "expected five governance steps");
expect(indexHtml.includes('class="landing-disclosure"'), "missing review disclosure");
expect(indexHtml.includes("<!-- Coop landing metadata -->"), "missing landing metadata");
expect(indexHtml.includes('property="og:image"'), "missing Open Graph image");
expect(indexHtml.includes('name="twitter:card" content="summary_large_image"'), "missing social card metadata");
expect(!indexHtml.includes("4 道 gate"), "untranslated gate label remains");
expect(!indexHtml.includes("仍為 pending"), "untranslated review status remains");

for (const anchor of ["landing-paths-title", "landing-flow-title", "landing-proof-title"]) {
  expect(indexHtml.includes(`href="#${anchor}"`), `missing navigation link for ${anchor}`);
  expect(indexHtml.includes(`id="${anchor}"`), `missing navigation target for ${anchor}`);
}

expect(landingCss.includes("@media (max-width: 620px)"), "missing mobile layout rules");
expect(landingCss.includes("@media (prefers-reduced-motion: reduce)"), "missing reduced-motion rules");
expect(landingCss.includes(":focus-visible"), "missing keyboard focus styles");

expect(socialImage.subarray(1, 4).toString("ascii") === "PNG", "social card is not a PNG");
expect(socialImage.readUInt32BE(16) === 1200, "social card width must be 1200px");
expect(socialImage.readUInt32BE(20) === 630, "social card height must be 630px");

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  console.error(`Landing page checks failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log("Landing page structure and metadata checks passed");
