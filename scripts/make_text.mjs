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
    // eslint-disable-next-line no-undef
    console.error(`Error: ${f} not found (run from project root)`);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

const g  = JSON.parse(readFileSync(FILES[0],   'utf8'));
const dt = JSON.parse(readFileSync(FILES[1], 'utf8'));
const f1 = JSON.parse(readFileSync(FILES[2],     'utf8'));
const f2 = JSON.parse(readFileSync(FILES[3],     'utf8'));

const hr = '---';

const text = [
  g.subject + ': ' + dt.date,
  hr,
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
  ...(f2.title === '<EMPTY>' ? [] : [
    hr,
    g.kids,
    f2.title,
    f2.desc,
  ]),
  hr,
  g.closing,
  hr,
  `See full invitation at ${g.website}/${g.website_path}`,
].join('\n') + '\n';

writeFileSync('invite.txt', text, 'utf8');
// eslint-disable-next-line no-undef
console.log('Wrote invite.txt');

await sharp('public/preview.png').resize(500).jpeg().toFile('invite.jpg');
// eslint-disable-next-line no-undef
console.log('Wrote invite.jpg');
