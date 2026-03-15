#!/usr/bin/env node
// Lists all available films by scanning JSON files in res/ for
// 'title' and 'filename' fields.
//
// Usage: bun run list_films

import { readFileSync, readdirSync } from 'fs';
import { join, basename, extname } from 'path';

const RES_DIR = 'filmdata';

const films = readdirSync(RES_DIR)
  .filter(f => f.endsWith('.json'))
  .sort()
  .flatMap(f => {
    const data = JSON.parse(readFileSync(join(RES_DIR, f), 'utf8'));
    if ('title' in data && 'filename' in data) {
      const key = basename(data.filename, extname(data.filename));
      return [{ title: data.title, key }];
    }
    return [];
  });

if (!films.length) {
  console.log('No film JSON files found.');
  process.exit(0);
}

console.log('Title'.padEnd(45) + ' Key');
console.log('-'.repeat(55));
for (const { title, key } of films) {
  console.log(title.padEnd(45) + ' ' + key);
}
