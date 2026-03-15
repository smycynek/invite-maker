#!/usr/bin/env node
// Renders the /invite/ page in a headless browser and saves a full-page
// JPEG screenshot to invitation.jpg.
//
// Usage: bun run make_screenshot [standard|side]  (default: standard)
// Requires the dev server to be running (bun run dev)

import puppeteer from 'puppeteer';

let arg = process.argv[2] ?? 'standard';
if (arg !== 'standard' && arg !== 'side') {
  arg = 'standard'
}

console.log('Note usage: \n bun run make_screenshot [standard|side] (default: standard)');
console.log(`Generating screenshot for ${arg} view...`);

const BASE   = 'http://localhost:3000/invite/';
const URL    = arg === 'side' ? `${BASE}#/side` : BASE;
const OUTPUT = 'invitation.jpg';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 800, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

await page.screenshot({ path: OUTPUT, type: 'jpeg', quality: 90, fullPage: true });

await browser.close();
console.log(`Wrote ${OUTPUT}`);
