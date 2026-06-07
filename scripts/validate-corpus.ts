/**
 * validate-corpus.ts
 *
 * Validates the shape of corpus.json and pairings.json.
 * Run with: pnpm validate:corpus
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let exitCode = 0;

function fail(msg: string) {
  console.error(`❌  ${msg}`);
  exitCode = 1;
}

function ok(msg: string) {
  console.log(`✓  ${msg}`);
}

// ── Load corpus ───────────────────────────────────────────────────────────────

const corpusPath = resolve(process.cwd(), 'src/lib/fonts/corpus.json');
let corpus: { generatedAt: string; count: number; fonts: Record<string, unknown>[] };

try {
  corpus = JSON.parse(readFileSync(corpusPath, 'utf-8')) as typeof corpus;
  ok(`corpus.json loaded (${corpus.fonts.length} fonts)`);
} catch (err) {
  fail(`Failed to read corpus.json: ${String(err)}`);
  process.exit(1);
}

// ── Validate corpus shape ─────────────────────────────────────────────────────

if (typeof corpus.generatedAt !== 'string') fail('corpus.generatedAt missing');
if (typeof corpus.count !== 'number') fail('corpus.count missing');
if (!Array.isArray(corpus.fonts)) fail('corpus.fonts is not an array');
if (corpus.count !== corpus.fonts.length) {
  fail(`corpus.count (${corpus.count}) !== fonts.length (${corpus.fonts.length})`);
} else {
  ok(`corpus.count matches fonts.length (${corpus.count})`);
}

const requiredFields = [
  'family', 'category', 'designer', 'license', 'licenseUrl',
  'weights', 'variable', 'subsets', 'metrics', 'traits', 'cssUrl',
];
const requiredMetrics = [
  'xHeightRatio', 'capHeightRatio', 'ascenderRatio', 'descenderRatio', 'strokeContrast',
];

const familySet = new Set<string>();
let fontErrors = 0;

for (const font of corpus.fonts) {
  const family = String(font['family'] ?? '');
  if (!family) { fail('Font missing family name'); fontErrors++; continue; }

  if (familySet.has(family)) { fail(`Duplicate family: ${family}`); fontErrors++; }
  familySet.add(family);

  for (const field of requiredFields) {
    if (!(field in font)) { fail(`${family}: missing field "${field}"`); fontErrors++; }
  }

  const metrics = font['metrics'] as Record<string, unknown> | undefined;
  if (metrics) {
    for (const m of requiredMetrics) {
      if (typeof metrics[m] !== 'number') {
        fail(`${family}: metrics.${m} is not a number`);
        fontErrors++;
      }
    }
  }
}

if (fontErrors === 0) ok(`All ${corpus.fonts.length} fonts have valid shape`);

// ── Load pairings ─────────────────────────────────────────────────────────────

const pairingsPath = resolve(process.cwd(), 'src/lib/fonts/pairings.json');
let pairings: { v: number; pairings: Record<string, Array<{ displayFamily: string; bodyFamily: string }>> };

try {
  pairings = JSON.parse(readFileSync(pairingsPath, 'utf-8')) as typeof pairings;
  ok(`pairings.json loaded`);
} catch (err) {
  fail(`Failed to read pairings.json: ${String(err)}`);
  process.exit(exitCode);
}

// ── Validate pairings ─────────────────────────────────────────────────────────

let pairingErrors = 0;
for (const [sourceFamily, entries] of Object.entries(pairings.pairings)) {
  for (const entry of entries) {
    if (!familySet.has(entry.displayFamily)) {
      fail(`Pairing for "${sourceFamily}": displayFamily "${entry.displayFamily}" not in corpus`);
      pairingErrors++;
    }
    if (!familySet.has(entry.bodyFamily)) {
      fail(`Pairing for "${sourceFamily}": bodyFamily "${entry.bodyFamily}" not in corpus`);
      pairingErrors++;
    }
  }
}

if (pairingErrors === 0) ok(`All pairing families exist in corpus`);

// ── Result ────────────────────────────────────────────────────────────────────

if (exitCode === 0) {
  console.log('\n✅  Corpus validation passed.');
} else {
  console.log('\n❌  Corpus validation failed — see errors above.');
}

process.exit(exitCode);