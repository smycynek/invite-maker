#!/usr/bin/env node
// Generates flyer.pdf
// Usage: bun run make_flyer

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';

const OUTPUT = 'flyer.pdf';
const { title: filmTitle1 } = JSON.parse(readFileSync('src/res/film1.json', 'utf8'));
const { title: filmTitle2 } = JSON.parse(readFileSync('src/res/film2.json', 'utf8'));

// eslint-disable-next-line no-undef
const inkSave     = process.argv.includes('-inksave');
const bg          = inkSave ? 'white'       : '#192e44';
const borderColor = inkSave ? 'transparent' : '#8c3200';
const textColor   = inkSave ? 'black'       : 'white';
const filmColor   = inkSave ? 'black'       : '#1a3550';
const circleFill  = inkSave ? 'none'        : '#e6c000';
const circleExtra = inkSave ? 'stroke="black" stroke-width="0.5"' : '';

// Split titles > 20 chars at the word boundary nearest the middle.
function splitTitle(title) {
  if (title.length <= 20) return title;
  const mid = Math.floor(title.length / 2);
  let lo = mid, hi = mid;
  while (lo >= 0 || hi < title.length) {
    if (lo >= 0 && title[lo] === ' ') return title.slice(0, lo) + '<br>' + title.slice(lo + 1);
    if (hi < title.length && title[hi] === ' ') return title.slice(0, hi) + '<br>' + title.slice(hi + 1);
    lo--;
    hi++;
  }
  return title;
}

// All dimensions in CSS px (96dpi: 1in = 96px)
const PX       = 96;
const borderPx = 0.375  * PX;
const boxWpx   = 5.85   * PX;
const boxHpx   = 1.9125 * PX;
const outerW   = boxWpx + 2 * borderPx;
const outerH   = boxHpx + 2 * borderPx;
const half     = borderPx / 2;

// Circle geometry: 0.85 * 0.9^5 * 1.1 collapsed to single factor
const circleDiam = 0.552 * borderPx;
const circleR    = circleDiam / 2;
const circleStep = circleDiam * 1.125;  // diam + 12.5% gap

// Corner centers (clockwise from top-left)
const corners = [
  [half,          half         ],
  [outerW - half, half         ],
  [outerW - half, outerH - half],
  [half,          outerH - half],
];

// One circle per corner + evenly-spaced interior circles per segment
const circlePositions = [...corners];
for (let si = 0; si < 4; si++) {
  const a = corners[si], b = corners[(si + 1) % 4];
  const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(0, Math.floor(segLen / circleStep - 1));
  const spacing = segLen / (n + 1);
  for (let j = 1; j <= n; j++) {
    const t = (j * spacing) / segLen;
    circlePositions.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
  }
}

// Spike geometry: 20 equilateral triangles per circle, 0.375mm side
const spikeSide = 0.375 * (PX / 25.4);
const spikeH    = spikeSide * Math.sqrt(3) / 2;

const svgDots = circlePositions.map(([cx, cy]) => {
  const parts = [`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${circleR.toFixed(1)}" fill="${circleFill}" ${circleExtra}/>`];
  for (let i = 0; i < 20; i++) {
    const theta = (2 * Math.PI * i) / 20;
    const cos = Math.cos(theta), sin = Math.sin(theta), sh = spikeSide / 2;
    const ax  = cx + (circleR + spikeH) * cos;
    const ay  = cy + (circleR + spikeH) * sin;
    const bx1 = cx + circleR * cos - sh * sin,  by1 = cy + circleR * sin + sh * cos;
    const bx2 = cx + circleR * cos + sh * sin,  by2 = cy + circleR * sin - sh * cos;
    parts.push(`<polygon points="${bx1.toFixed(2)},${by1.toFixed(2)} ${bx2.toFixed(2)},${by2.toFixed(2)} ${ax.toFixed(2)},${ay.toFixed(2)}" fill="${circleFill}" ${circleExtra}/>`);
  }
  return parts.join('\n    ');
}).join('\n    ');

const boxSVG = `<svg width="${outerW.toFixed(1)}" height="${outerH.toFixed(1)}" style="position:absolute;top:0;left:0;pointer-events:none;">
    ${svgDots}
  </svg>`;

const stripes = `linear-gradient(to bottom,
      white calc(20% - 0.25mm), #bbb calc(20% - 0.25mm), #bbb calc(20% + 0.25mm), white calc(20% + 0.25mm),
      white calc(40% - 0.25mm), #bbb calc(40% - 0.25mm), #bbb calc(40% + 0.25mm), white calc(40% + 0.25mm),
      white calc(60% - 0.25mm), #bbb calc(60% - 0.25mm), #bbb calc(60% + 0.25mm), white calc(60% + 0.25mm),
      white calc(80% - 0.25mm), #bbb calc(80% - 0.25mm), #bbb calc(80% + 0.25mm), white calc(80% + 0.25mm))`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Montserrat:wght@300;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: sans-serif;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8.5in;
    height: 11in;
  }
  .content { background-color: ${bg}; width: 8.5in; height: 10.5in; }
  .header {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    color: ${textColor};
    text-transform: uppercase;
    letter-spacing: 0.1287em;
  }
  .title    { font-size: 0.405in; padding-top: 1in; }
  .presents { font-size: 0.319in; margin-top: 0.08in; }
  .box-wrapper {
    position: relative;
    width: ${outerW.toFixed(1)}px;
    height: ${outerH.toFixed(1)}px;
    margin: 0.5in auto 0 auto;
  }
  .box-wrapper.second { margin-top: 0.9in; }
  .white-box {
    position: absolute;
    top: 0; left: 0;
    width: ${boxWpx}px;
    height: ${boxHpx}px;
    box-sizing: content-box;
    border: ${borderPx}px solid ${borderColor};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${stripes};
  }
  .film-title {
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    font-family: 'League Gothic', sans-serif;
    font-weight: 400;
    color: ${filmColor};
    padding: 0 0.2in;
    letter-spacing: 0.075em;
    transform: scaleY(1.2);
    display: inline-block;
  }
  .page-border {
    position: fixed;
    top: 0.375in;
    left: 0.25in;
    right: 0.25in;
    bottom: 0.375in;
    border: 0.5mm solid black;
    pointer-events: none;
  }
  .cinema-label {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.25in;
    line-height: 1;
    margin-top: 0.2in;
    font-weight: 300;
    color: ${textColor};
    letter-spacing: 0.2499em;
  }
</style>
</head>
<body>
<div class="page-border"></div>
<div class="content">
  <div class="header title">MYCYNEK MOVIE NIGHTS</div>
  <div class="header presents">PRESENTS</div>
  <div class="box-wrapper">
    <div class="white-box">
      <div class="film-title" id="film-title-1">${splitTitle(filmTitle1)}</div>
    </div>
    ${boxSVG}
  </div>
  <div class="cinema-label">CINEMA 1</div>
  <div class="box-wrapper second">
    <div class="white-box">
      <div class="film-title" id="film-title-2">${splitTitle(filmTitle2)}</div>
    </div>
    ${boxSVG}
  </div>
  <div class="cinema-label">CINEMA 2</div>
  <script>
    function fitTitle(elId, boxEl) {
      const el = document.getElementById(elId);
      let lo = 30, hi = 80;
      while (lo < hi - 1) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = mid + 'px';
        if (el.scrollWidth <= boxEl.clientWidth && el.scrollHeight <= boxEl.clientHeight) lo = mid;
        else hi = mid;
      }
      el.style.fontSize = lo + 'px';
    }
    const boxes = document.querySelectorAll('.white-box');
    fitTitle('film-title-1', boxes[0]);
    fitTitle('film-title-2', boxes[1]);
  </script>
</div>
</body>
</html>`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: OUTPUT,
  width: '8.5in',
  height: '11in',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  printBackground: true,
});
await browser.close();
// eslint-disable-next-line no-undef
console.log(`Wrote ${OUTPUT}`);
