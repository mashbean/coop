#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, "..");
const projects = JSON.parse(
  fs.readFileSync(path.join(localeRoot, "ecosystem-sources.json"), "utf8"),
);

const requestHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "mashbean-roost-localization-freshness-check",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (process.env.GITHUB_TOKEN) {
  requestHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.json();
}

function rawUrl(project, filePath) {
  return `https://raw.githubusercontent.com/${project.fork}/${project.localizationBranch}/${filePath}`;
}

function parseTsv(tsv) {
  const lines = tsv.trimEnd().split("\n");
  const headers = lines[0].split("\t");
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = line.split("\t");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function groupSources(rows, project, sourceCommit) {
  const groups = new Map();
  for (const row of rows) {
    const commit = row.source_commit || sourceCommit;
    if (!commit || !/^[0-9a-f]{40}$/.test(commit)) {
      throw new Error(`${project.name} has an invalid source commit for ${row.source_path}`);
    }
    if (!groups.has(commit)) groups.set(commit, []);
    groups.get(commit).push(row.source_path);
  }
  return groups;
}

async function inspectProject(project) {
  const manifest = await fetchText(rawUrl(project, project.manifestPath));
  const rows = parseTsv(manifest);
  if (rows.length === 0 || !rows.every((row) => row.source_path)) {
    throw new Error(`${project.name} has an empty or invalid source manifest`);
  }

  const sourceCommit = project.sourceCommitPath
    ? (await fetchText(rawUrl(project, project.sourceCommitPath))).trim()
    : "";
  const groups = groupSources(rows, project, sourceCommit);
  const changedSources = new Set();
  let upstreamCommit = "";

  for (const [baseCommit, sourcePaths] of groups) {
    const compareUrl = `https://api.github.com/repos/${project.upstream}/compare/${baseCommit}...${project.defaultBranch}`;
    const comparison = await fetchJson(compareUrl);
    upstreamCommit = comparison.head_commit?.sha ?? upstreamCommit;

    if (comparison.total_commits >= 250) {
      throw new Error(`${project.name} is more than 250 upstream commits behind and needs a full audit`);
    }

    const changedPaths = new Set((comparison.files ?? []).map((file) => file.filename));
    for (const sourcePath of sourcePaths) {
      if (changedPaths.has(sourcePath)) changedSources.add(sourcePath);
    }
  }

  return {
    ...project,
    sourceCount: rows.length,
    changedSources: [...changedSources].sort(),
    upstreamCommit,
  };
}

const results = [];
const failures = [];

for (const project of projects) {
  try {
    results.push(await inspectProject(project));
  } catch (error) {
    failures.push(`${project.name}: ${error.message}`);
  }
}

const lines = [
  "## ROOST 繁中來源新鮮度",
  "",
  "| 專案 | 追蹤來源 | 結果 |",
  "| --- | ---: | --- |",
];

for (const result of results) {
  const resultLabel = result.changedSources.length === 0
    ? "最新"
    : `需同步 ${result.changedSources.length} 份`;
  lines.push(`| [${result.name}](${result.publicUrl}) | ${result.sourceCount} | ${resultLabel} |`);
}

if (failures.length > 0) {
  lines.push("", "### 無法完成的檢查", "", ...failures.map((failure) => `- ${failure}`));
}

const staleResults = results.filter((result) => result.changedSources.length > 0);
if (staleResults.length > 0) {
  lines.push("", "### 已變動的翻譯來源", "");
  for (const result of staleResults) {
    lines.push(`- ${result.name}`, ...result.changedSources.map((sourcePath) => `  - \`${sourcePath}\``));
  }
}

const report = `${lines.join("\n")}\n`;
process.stdout.write(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
}

if (failures.length > 0 || staleResults.length > 0) {
  process.exitCode = 1;
}
