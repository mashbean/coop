#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, '..');
const repoRoot = path.resolve(localeRoot, '..', '..');
const manifestPath = path.join(localeRoot, 'sources.tsv');

const manifestLines = fs
  .readFileSync(manifestPath, 'utf8')
  .trimEnd()
  .split('\n');
const headers = manifestLines[0].split('\t');
const rows = manifestLines.slice(1).map((line) => {
  const values = line.split('\t');
  return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
});

function fencedCodeBlocks(markdown) {
  return [...markdown.matchAll(/^```([^\n]*)\n(.*?)^```\s*$/gms)].map(
    (match) => match[2].trimEnd(),
  );
}

function inlineCodeTokens(markdown) {
  const withoutFencedCode = markdown.replace(
    /^```[^\n]*\n.*?^```\s*$/gms,
    '',
  );
  return [...withoutFencedCode.matchAll(/(?<!`)`([^`\n]+)`(?!`)/g)].map(
    (match) => match[1],
  );
}

function countMatches(markdown, pattern) {
  return [...markdown.matchAll(pattern)].length;
}

function isSubsequence(sourceBlocks, localizedBlocks) {
  let sourceIndex = 0;
  for (const block of localizedBlocks) {
    if (sourceBlocks[sourceIndex] === block) {
      sourceIndex += 1;
    }
  }
  return sourceIndex === sourceBlocks.length;
}

const errors = [];

for (const row of rows) {
  if (!['translated', 'reviewed'].includes(row.status)) {
    continue;
  }

  const sourcePath = path.join(repoRoot, row.source_path);
  const localizedPath = path.join(repoRoot, row.localized_path);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const localized = fs.readFileSync(localizedPath, 'utf8');

  const sourceBlocks = fencedCodeBlocks(source);
  const localizedBlocks = fencedCodeBlocks(localized);
  if (!isSubsequence(sourceBlocks, localizedBlocks)) {
    errors.push(`${row.source_path}: source code blocks were removed or modified`);
  }

  const localizedTokens = new Set(inlineCodeTokens(localized));
  const missingTokens = [
    ...new Set(
      inlineCodeTokens(source).filter((token) => !localizedTokens.has(token)),
    ),
  ];
  if (missingTokens.length > 0) {
    errors.push(
      `${row.source_path}: missing inline code tokens: ${missingTokens.join(', ')}`,
    );
  }

  const sourceImages = countMatches(source, /!\[[^\]]*\]\([^)]*\)/g);
  const localizedImages = countMatches(localized, /!\[[^\]]*\]\([^)]*\)/g);
  if (sourceImages !== localizedImages) {
    errors.push(
      `${row.source_path}: image count differs (${sourceImages} source, ${localizedImages} localized)`,
    );
  }

  const sourceStyles = countMatches(source, /<style>/g);
  const localizedStyles = countMatches(localized, /<style>/g);
  if (sourceStyles !== localizedStyles) {
    errors.push(
      `${row.source_path}: style block count differs (${sourceStyles} source, ${localizedStyles} localized)`,
    );
  }

  const sourceTables = countMatches(source, /^\|.*\|\n\|\s*:?-+/gm);
  const localizedTables = countMatches(localized, /^\|.*\|\n\|\s*:?-+/gm);
  if (sourceTables !== localizedTables) {
    errors.push(
      `${row.source_path}: table count differs (${sourceTables} source, ${localizedTables} localized)`,
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  console.error(`Localization fidelity checks failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log('Localization fidelity checks passed');
