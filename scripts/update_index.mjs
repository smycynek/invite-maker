#!/usr/bin/env node
// Reads the date from src/res/date-time.json and the website from src/res/general.json,
// then rewrites index.html: title/meta tags and all website URL references.

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DATE_TIME_JSON      = 'src/res/date-time.json';
const GENERAL_JSON        = 'src/res/general.json';
const INVITEDATA_GENERAL  = 'invitedata/general.json';
const INDEX_HTML          = 'index.html';
const VITE_CONFIG         = 'vite.config.ts';
const SITEVARS            = 'scripts/sitevars.sh';

for (const p of [DATE_TIME_JSON, GENERAL_JSON, INVITEDATA_GENERAL, INDEX_HTML, VITE_CONFIG, SITEVARS]) {
  if (!existsSync(p)) {
    console.error(`Error: ${p} not found (run from the project root)`);
    process.exit(1);
  }
}

const { date }    = JSON.parse(readFileSync(DATE_TIME_JSON, 'utf8'));
const { website, website_path } = JSON.parse(readFileSync(GENERAL_JSON,   'utf8'));
const { website_path: vite_base } = JSON.parse(readFileSync(INVITEDATA_GENERAL, 'utf8'));
const newTitle    = `Movie Night Invitation: ${date}`;

console.log(`Setting title to: "${newTitle}"`);
console.log(`Setting website to: "${website}/${website_path}"`);

const original = readFileSync(INDEX_HTML, 'utf8');

let updated = original
  .replace(/(<title>)[^<]*(<\/title>)/, `$1${newTitle}$2`)
  .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`)
  .replace(/(<meta\s+name="apple-mobile-web-app-title"\s+content=")[^"]*(")/,  `$1${newTitle}$2`)
  .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,       `$1${website}/${website_path}$2`)
  .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/,     `$1${website}/${website_path}/preview.png$2`)
  .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,    `$1${website}/${website_path}/preview.png$2`)
  .replace(/(<link\s+rel="apple-touch-icon"\s+href=")[^"]*(")/,     `$1${website}/${website_path}/preview.png$2`);

if (updated === original) {
  console.log('No changes needed — index.html already up to date.');
} else {
  writeFileSync(INDEX_HTML, updated, 'utf8');
  console.log('index.html updated.');
}

const viteOriginal = readFileSync(VITE_CONFIG, 'utf8');
const viteUpdated  = viteOriginal.replace(/(base:\s*')[^']*(')/,  `$1/${vite_base}/$2`);

console.log(`Setting vite base to: "/${vite_base}/"`);
if (viteUpdated === viteOriginal) {
  console.log('No changes needed — vite.config.ts already up to date.');
} else {
  writeFileSync(VITE_CONFIG, viteUpdated, 'utf8');
  console.log('vite.config.ts updated.');
}

const sitevarsOriginal = readFileSync(SITEVARS, 'utf8');
const sitevarsUpdated  = sitevarsOriginal
  .replace(/(export APP=).*/,    `$1${vite_base}`)
  .replace(/(export FOLDER=).*/, `$1${vite_base}`);

console.log(`Setting APP and FOLDER to: "${vite_base}"`);
if (sitevarsUpdated === sitevarsOriginal) {
  console.log('No changes needed — scripts/sitevars.sh already up to date.');
} else {
  writeFileSync(SITEVARS, sitevarsUpdated, 'utf8');
  console.log('scripts/sitevars.sh updated.');
}
