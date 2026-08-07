#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultBookRoot = path.resolve(scriptDirectory, '..', 'book');
const bookRoot = path.resolve(process.argv[2] ?? defaultBookRoot);

function findHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }
  return files;
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, codePoint) =>
      String.fromCodePoint(Number(codePoint)),
    );
}

function readIds(filePath, cache) {
  if (!cache.has(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    cache.set(
      filePath,
      new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => decodeHtml(match[1]))),
    );
  }
  return cache.get(filePath);
}

if (!fs.existsSync(bookRoot)) {
  console.error(`Rendered book directory does not exist: ${bookRoot}`);
  process.exit(1);
}

const errors = [];
const idCache = new Map();

for (const sourcePath of findHtmlFiles(bookRoot)) {
  if (path.basename(sourcePath) === 'print.html') {
    continue;
  }

  const html = fs.readFileSync(sourcePath, 'utf8');
  for (const match of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const attribute = match[1];
    const reference = decodeHtml(match[2]);
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(reference)) {
      continue;
    }

    const [pathAndQuery, fragment] = reference.split('#', 2);
    const pathPart = decodeURIComponent(pathAndQuery.split('?', 1)[0]);
    let targetPath = pathPart
      ? path.resolve(path.dirname(sourcePath), pathPart)
      : sourcePath;

    if (
      pathPart.endsWith('/') ||
      (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory())
    ) {
      targetPath = path.join(targetPath, 'index.html');
    }

    const relativeTarget = path.relative(bookRoot, targetPath);
    if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
      continue;
    }

    const sourceLabel = path.relative(bookRoot, sourcePath);
    if (!fs.existsSync(targetPath)) {
      errors.push(`${sourceLabel}: missing target ${reference}`);
      continue;
    }

    if (
      attribute === 'href' &&
      path.extname(targetPath) === '.html' &&
      fragment
    ) {
      const decodedFragment = decodeURIComponent(fragment);
      if (!readIds(targetPath, idCache).has(decodedFragment)) {
        errors.push(`${sourceLabel}: missing anchor ${reference}`);
      }
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  console.error(`Rendered link checks failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log('Rendered internal link and anchor checks passed');
