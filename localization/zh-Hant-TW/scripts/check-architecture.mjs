#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const bookRoot = path.resolve(process.argv[2] ?? "book");
const [page, css, js, landing] = await Promise.all([
  readFile(path.join(bookRoot, "matters-roost.html"), "utf8"),
  readFile(path.join(bookRoot, "architecture.css"), "utf8"),
  readFile(path.join(bookRoot, "architecture.js"), "utf8"),
  readFile(path.join(bookRoot, "index.html"), "utf8"),
]);

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};
const count = (pattern) => (page.match(pattern) ?? []).length;

expect(page.includes('class="architecture-page"'), "missing architecture page");
expect(page.includes('href="architecture.css"'), "missing architecture stylesheet");
expect(page.includes('src="architecture.js"'), "missing architecture script");
expect(page.includes("gsap@3.13.0"), "missing pinned GSAP runtime");
expect(page.includes("ScrollTrigger.min.js"), "missing ScrollTrigger runtime");
expect(!page.includes('id="mdbook-sidebar"'), "mdBook sidebar remains");
expect(!page.includes('id="mdbook-menu-bar"'), "mdBook toolbar remains");
expect(count(/class="architecture-step(?: |")/g) === 4, "expected four comparison steps");
expect(count(/class="architecture-zone architecture-zone-/g) === 4, "expected four platform zones");
expect(count(/class="architecture-owner-panel/g) === 6, "expected six owner overlays");
expect(page.includes('class="architecture-foundation"'), "missing shared foundation");
expect(count(/data-scene-trigger=/g) === 4, "expected four narrative scenes");
expect(count(/class="architecture-module-card"/g) === 8, "expected eight Matters modules");
expect(count(/class="architecture-comparison-row"/g) === 7, "expected seven comparison rows");
expect(page.includes("沒有直接對應工具"), "missing ROOST distribution gap");
expect(page.includes("小黑屋"), "missing visibility restriction module");
expect(page.includes("守望相助隊"), "missing Community Watch module");
expect(landing.includes('href="matters-roost.html"'), "landing does not link to architecture page");
expect(css.includes("@media (max-width: 620px)"), "missing mobile layout");
expect(css.includes("@media (prefers-reduced-motion: reduce)"), "missing reduced-motion layout");
expect(css.includes(":focus-visible"), "missing keyboard focus styles");
expect(js.includes("gsap.matchMedia()"), "missing GSAP responsive context");
expect(js.includes("gsap.registerPlugin(ScrollTrigger)"), "ScrollTrigger is not registered");
expect(js.includes(".timeline("), "missing GSAP timeline");
expect(js.includes("ScrollTrigger.refresh()"), "missing layout refresh");

console.log("Architecture page checks passed");
