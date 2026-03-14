#!/usr/bin/env node
// Reads the date from src/res/date-time.json and the website from src/res/general.json,
// then rewrites index.html: title/meta tags and all website URL references.

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DATE_TIME_JSON = 'src/res/date-time.json';
const GENERAL_JSON   = 'src/res/general.json';
const INDEX_HTML     = 'index.html';

for (const p of [DATE_TIME_JSON, GENERAL_JSON, INDEX_HTML]) {
  if (!existsSync(p)) {
    console.error(`Error: ${p} not found (run from the project root)`);
    process.exit(1);
  }
}

const { date }    = JSON.parse(readFileSync(DATE_TIME_JSON, 'utf8'));
const { website } = JSON.parse(readFileSync(GENERAL_JSON,   'utf8'));
const newTitle    = `Movie Night Invitation: ${date}`;

console.log(`Setting title to: "${newTitle}"`);
console.log(`Setting website to: "${website}"`);

const original = readFileSync(INDEX_HTML, 'utf8');

let updated = original
  .replace(/(<title>)[^<]*(<\/title>)/, `$1${newTitle}$2`)
  .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`)
  .replace(/(<meta\s+name="apple-mobile-web-app-title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`)
  .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,       `$1${website}$2`)
  .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/,     `$1${website}/preview.png$2`)
  .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,    `$1${website}/preview.png$2`)
  .replace(/(<link\s+rel="apple-touch-icon"\s+href=")[^"]*(")/,     `$1${website}/preview.png$2`);

if (updated === original) {
  console.log('No changes needed — index.html already up to date.');
} else {
  writeFileSync(INDEX_HTML, updated, 'utf8');
  console.log('index.html updated.');
}
