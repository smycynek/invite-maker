#!/usr/bin/env node
// Generates invite.txt — plain text version of the invite page.
//
// Usage: bun run make_text

import { readFileSync, writeFileSync, existsSync } from 'fs';
import sharp from 'sharp';

const FILES = [
  'src/res/general.json',
  'src/res/date-time.json',
  'src/res/film1.json',
  'src/res/film2.json',
];

for (const f of FILES) {
  if (!existsSync(f)) {
    console.error(`Error: ${f} not found (run from project root)`);
    process.exit(1);
  }
}

const g  = JSON.parse(readFileSync('src/res/general.json',   'utf8'));
const dt = JSON.parse(readFileSync('src/res/date-time.json', 'utf8'));
const f1 = JSON.parse(readFileSync('src/res/film1.json',     'utf8'));
const f2 = JSON.parse(readFileSync('src/res/film2.json',     'utf8'));

const hr = '---';

const text = [
  g.title1,
  g.title2,
  g.title3,
  hr,
  dt.date,
  g.address,
  hr,
  dt.time1,
  g.food,
  dt.time2,
  g.film,
  hr,
  g.rsvp,
  hr,
  g.featuredFilms,
  g.adults,
  f1.title,
  f1.desc,
  hr,
  g.kids,
  f2.title,
  f2.desc,
  hr,
  g.closing,
  hr,
  'See full invitation at https://<your website>/invite',
].join('\n') + '\n';

writeFileSync('invite.txt', text, 'utf8');
console.log('Wrote invite.txt');

await sharp('public/preview.png').resize(500).jpeg().toFile('invite.jpg');
console.log('Wrote invite.jpg');
