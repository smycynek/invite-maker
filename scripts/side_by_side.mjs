#!/usr/bin/env node
// Reads filename from src/res/film1.json and src/res/film2.json, loads those
// images from ./public/, combines them side by side, and saves ./public/preview.png.
//
// Usage: bun run side_by_side

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILM1_JSON = 'src/res/film1.json';
const FILM2_JSON = 'src/res/film2.json';
const PUBLIC_DIR = 'public';
const OUTPUT = 'public/preview.png';

const MAX_WIDTH = 900;
const DIVIDER_WIDTH = 20;
const BORDER_WIDTH = 3;
const BORDER_COLOR = { r: 0, g: 0, b: 0 };

for (const p of [FILM1_JSON, FILM2_JSON]) {
  if (!existsSync(p)) {
    // eslint-disable-next-line no-undef
    console.error(`Error: ${p} not found (run from project root)`);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

const film1 = JSON.parse(readFileSync(FILM1_JSON, 'utf8'));
const film2 = JSON.parse(readFileSync(FILM2_JSON, 'utf8'));
const singleEvent = film2.title === "<EMPTY>";

const name1 = film1.filename;
const path1 = join(PUBLIC_DIR, name1);

if (!existsSync(path1)) {
  // eslint-disable-next-line no-undef
  console.error(`Error: file not found: ${path1}`);
  // eslint-disable-next-line no-undef
  process.exit(1);
}

if (singleEvent) {
  // Single image with black border
  const meta1 = await sharp(path1).metadata();
  const finalW = Math.round(meta1.width * 1.0);
  const finalH = Math.round(meta1.height * 1.0);
  const totalW = finalW + 2 * BORDER_WIDTH;
  const totalH = finalH + 2 * BORDER_WIDTH;
  const imgBuf = await sharp(path1).resize(finalW, finalH).png().toBuffer();
  await sharp({
    create: { width: totalW, height: totalH, channels: 3, background: BORDER_COLOR },
  })
    .composite([{ input: imgBuf, left: BORDER_WIDTH, top: BORDER_WIDTH }])
    .png()
    .toFile(OUTPUT);
  // eslint-disable-next-line no-undef
  console.log(`Saved ${OUTPUT}  (${totalW}x${totalH})`);
} else {
  const name2 = film2.filename;
  const path2 = join(PUBLIC_DIR, name2);

  if (!existsSync(path2)) {
    // eslint-disable-next-line no-undef
    console.error(`Error: file not found: ${path2}`);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  const meta1 = await sharp(path1).metadata();
  const meta2 = await sharp(path2).metadata();

  // Scale both to the same height (the smaller of the two)
  const targetH = Math.min(meta1.height, meta2.height);

  function scaledWidth(meta, h) {
    return Math.round(meta.width * h / meta.height);
  }

  const w1 = meta1.height === targetH ? meta1.width : scaledWidth(meta1, targetH);
  const w2 = meta2.height === targetH ? meta2.width : scaledWidth(meta2, targetH);

  let finalH = targetH;
  let finalW1 = w1;
  let finalW2 = w2;

  // If combined width exceeds limit, scale both down proportionally
  const combinedW = w1 + DIVIDER_WIDTH + w2;
  if (combinedW > MAX_WIDTH) {
    const scale = (MAX_WIDTH - DIVIDER_WIDTH) / (w1 + w2);
    finalH = Math.round(targetH * scale);
    finalW1 = Math.round(w1 * scale);
    finalW2 = Math.round(w2 * scale);
  }

  const img1buf = await sharp(path1).resize(finalW1, finalH).png().toBuffer();
  const img2buf = await sharp(path2).resize(finalW2, finalH).png().toBuffer();

  const innerW = finalW1 + DIVIDER_WIDTH + finalW2;
  const totalW = innerW + 2 * BORDER_WIDTH;
  const totalH = finalH + 2 * BORDER_WIDTH;

  const whiteBuf = await sharp({
    create: { width: innerW, height: finalH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  }).png().toBuffer();

  const dividerBuf = await sharp({
    create: { width: DIVIDER_WIDTH, height: finalH, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).png().toBuffer();

  await sharp({
    create: { width: totalW, height: totalH, channels: 3, background: BORDER_COLOR },
  })
    .composite([
      { input: whiteBuf,   left: BORDER_WIDTH, top: BORDER_WIDTH },
      { input: img1buf,    left: BORDER_WIDTH, top: BORDER_WIDTH },
      { input: dividerBuf, left: BORDER_WIDTH + finalW1, top: BORDER_WIDTH },
      { input: img2buf,    left: BORDER_WIDTH + finalW1 + DIVIDER_WIDTH, top: BORDER_WIDTH },
    ])
    .png()
    .toFile(OUTPUT);
  // eslint-disable-next-line no-undef
  console.log(`Saved ${OUTPUT}  (${totalW}x${totalH})`);
}
