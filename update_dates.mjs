#!/usr/bin/env node
// Reads the date from src/res/date-time.json and rewrites the <title> tag plus
// the two title-bearing <meta> tags in index.html to:
//   'Movie Night Invitation: <date>'

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DATE_TIME_JSON = 'src/res/date-time.json';
const INDEX_HTML = 'index.html';

for (const p of [DATE_TIME_JSON, INDEX_HTML]) {
  if (!existsSync(p)) {
    console.error(`Error: ${p} not found (run from the project root)`);
    process.exit(1);
  }
}

const { date } = JSON.parse(readFileSync(DATE_TIME_JSON, 'utf8'));
const newTitle = `Movie Night Invitation: ${date}`;
console.log(`Setting title to: "${newTitle}"`);

const original = readFileSync(INDEX_HTML, 'utf8');

let updated = original
  .replace(/(<title>)[^<]*(<\/title>)/, `$1${newTitle}$2`)
  .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`)
  .replace(/(<meta\s+name="apple-mobile-web-app-title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`);

if (updated === original) {
  console.log('No date changes needed — dates already correct in titles');
} else {
  writeFileSync(INDEX_HTML, updated, 'utf8');
  console.log('index.html updated.');
}
