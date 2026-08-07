#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localeRoot = path.resolve(scriptDirectory, '..');
const contentRoot = path.join(localeRoot, 'src');

const disallowedTerms = [
  '你',
  '用户',
  '默认',
  '设置',
  '创建',
  '删除',
  '数据',
  '队列',
  '举报',
  '审核',
  '权限',
  '链接',
  '文件夹',
  '软件',
  '网络',
  '日志',
  '服务器',
  '点击',
  '帐号',
  '账号',
  '登录',
  '视频',
  '信息',
  '质量',
  '正则',
  '賬號',
  '封禁',
  '屏蔽',
  '——',
];

function findMarkdownFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'book') {
      continue;
    }
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }
  return files;
}

function maskMatch(match) {
  return match.replace(/[^\n]/g, ' ');
}

function proseOnly(markdown) {
  return markdown
    .replace(/^```[^\n]*\n.*?^```\s*$/gms, maskMatch)
    .replace(/(?<!`)`[^`\n]+`(?!`)/g, maskMatch)
    .replace(/https?:\/\/[^\s)>]+/g, maskMatch);
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

const errors = [];

for (const filePath of findMarkdownFiles(contentRoot)) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  const prose = proseOnly(markdown);
  const relativePath = path.relative(localeRoot, filePath);

  for (const term of disallowedTerms) {
    let index = prose.indexOf(term);
    while (index !== -1) {
      errors.push(`${relativePath}:${lineNumberAt(prose, index)}: disallowed term ${term}`);
      index = prose.indexOf(term, index + term.length);
    }
  }

  for (const match of prose.matchAll(/(?:這)?不是[^\n。]{0,80}而是/g)) {
    errors.push(
      `${relativePath}:${lineNumberAt(prose, match.index)}: disallowed contrast pattern`,
    );
  }

  if (
    path.basename(filePath) !== 'docs-home.md' &&
    /https:\/\/roostorg\.github\.io\/coop\/latest\/(?:user|api|integrations|development)/.test(
      markdown,
    )
  ) {
    errors.push(`${relativePath}: links to an English page that has a local translation`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  console.error(`Localization language checks failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log('Traditional Chinese language checks passed');
