#!/usr/bin/env node
// Renders the /invite/ page in a headless browser and saves a full-page
// JPEG screenshot to invitation.jpg.
//
// Usage: bun run screenshot
// Requires the dev server to be running (bun run dev)

import puppeteer from 'puppeteer';

const URL    = 'http://localhost:3000/invite/#/side';
const OUTPUT = 'invitation.jpg';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 800, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

await page.screenshot({ path: OUTPUT, type: 'jpeg', quality: 90, fullPage: true });

await browser.close();
console.log(`Wrote ${OUTPUT}`);
