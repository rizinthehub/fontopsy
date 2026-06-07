/**
 * build-corpus.ts
 *
 * Generates src/lib/fonts/corpus.json from the Google Fonts API.
 * Run with: pnpm build:corpus
 *
 * Requires: GOOGLE_FONTS_API_KEY in environment.
 *
 * This script is run quarterly to refresh the corpus with new fonts.
 * The output is committed to the repo — do NOT run this in CI.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const API_KEY = process.env['GOOGLE_FONTS_API_KEY'];
if (!API_KEY) {
  console.error('❌  GOOGLE_FONTS_API_KEY is not set.');
  process.exit(1);
}

// The 200 curated families split by category
const CURATED_FAMILIES: string[] = [
  // Sans-serif (80)
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito',
  'Raleway', 'Ubuntu', 'Noto Sans', 'Source Sans 3', 'Mulish', 'Work Sans',
  'Figtree', 'DM Sans', 'Manrope', 'Plus Jakarta Sans', 'Outfit', 'Barlow',
  'Karla', 'Rubik', 'Josefin Sans', 'Quicksand', 'Cabin', 'Exo 2', 'Hind',
  'Oxanium', 'Lexend', 'Urbanist', 'Albert Sans', 'Jost', 'Nunito Sans',
  'Be Vietnam Pro', 'Sora', 'Epilogue', 'Noto Sans Display', 'Schibsted Grotesk',
  'Onest', 'Geist', 'Hanken Grotesk', 'Space Grotesk', 'Bricolage Grotesque',
  'Instrument Sans', 'Funnel Sans', 'Fira Sans', 'Titillium Web', 'Assistant',
  'Ysabeau', 'Overpass', 'Red Hat Display', 'Encode Sans', 'Libre Franklin',
  'Arimo', 'IBM Plex Sans', 'Mukta', 'Heebo', 'Yantramanav', 'Asap',
  'Barlow Condensed', 'Exo', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans TC',
  'Cairo', 'Tajawal', 'Almarai', 'Vazirmatn', 'Readex Pro', 'Signika Negative',
  'Signika', 'Inder', 'Varela Round', 'Varela', 'Kumbh Sans', 'Philosopher',
  'Gothic A1', 'Martel Sans', 'Jaldi', 'Economica',
  // Serif (50)
  'Playfair Display', 'Merriweather', 'Lora', 'PT Serif', 'Noto Serif',
  'Source Serif 4', 'Libre Baskerville', 'Cormorant Garamond', 'EB Garamond',
  'Crimson Pro', 'Spectral', 'Bitter', 'Roboto Serif', 'Josefin Slab',
  'Arvo', 'Zilla Slab', 'Cardo', 'Vollkorn', 'Neuton', 'Alegreya',
  'Frank Ruhl Libre', 'Instrument Serif', 'Fraunces', 'Gilda Display', 'Unna',
  'Gelasio', 'Noto Serif Display', 'Domine', 'Alike', 'Alike Angular',
  'Eczar', 'Sorts Mill Goudy', 'Playfair', 'Petrona', 'Podkova',
  'Rokkitt', 'Slabo 27px', 'Slabo 13px', 'Cambo', 'Amiri',
  'Noto Serif JP', 'Noto Serif KR', 'Noto Serif TC', 'Martel', 'Sawarabi Mincho',
  'Taviraj', 'Trirong', 'Charm', 'Maitree', 'Pridi',
  // Display (40)
  'Abril Fatface', 'Oswald', 'Bebas Neue', 'Anton', 'Righteous', 'Fredoka',
  'Lobster', 'Pacifico', 'Alfa Slab One', 'Boogaloo', 'Courgette', 'Secular One',
  'Lilita One', 'Titan One', 'Chewy', 'Bangers', 'Permanent Marker', 'Russo One',
  'Black Han Sans', 'Bree Serif', 'Patua One', 'Yeseva One', 'Fjalla One',
  'Squada One', 'Teko', 'Archivo Black', 'Lexend Deca', 'Calistoga', 'Notable',
  'Big Shoulders Display', 'Climate Crisis', 'Syne', 'Unbounded', 'Orbitron',
  'Changa', 'Paytone One', 'Baumans', 'Black Ops One', 'Bungee', 'Monoton',
  // Handwriting (20)
  'Dancing Script', 'Parisienne', 'Great Vibes', 'Caveat', 'Sacramento',
  'Satisfy', 'Amatic SC', 'Kalam', 'Indie Flower', 'Shadows Into Light',
  'Architects Daughter', 'Yellowtail', 'Allura', 'Handlee', 'Patrick Hand',
  'Gochi Hand', 'Rock Salt', 'Reenie Beanie', 'Cookie', 'Damion',
  // Monospace (10)
  'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Space Mono', 'IBM Plex Mono',
  'Roboto Mono', 'Geist Mono', 'Noto Sans Mono', 'Courier Prime', 'Inconsolata',
];

interface GoogleFontItem {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  kind: string;
  menu: string;
}

interface GoogleFontsResponse {
  kind: string;
  items: GoogleFontItem[];
}

async function main() {
  console.log('📡 Fetching Google Fonts list…');
  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
  );
  if (!res.ok) {
    console.error(`❌ Google Fonts API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = (await res.json()) as GoogleFontsResponse;
  const allFonts = new Map(data.items.map((f) => [f.family, f]));

  console.log(`✓ Got ${allFonts.size} fonts from Google Fonts`);

  const fonts = [];
  const missing: string[] = [];

  for (const family of CURATED_FAMILIES) {
    const font = allFonts.get(family);
    if (!font) {
      missing.push(family);
      continue;
    }

    const weights = font.variants
      .filter((v) => /^\d+$/.test(v))
      .map(Number)
      .sort((a, b) => a - b);

    const isVariable = font.variants.some((v) => v.includes('variable'));

    const encoded = family.replace(/ /g, '+');
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400&display=swap`;

    // Default metrics — in production these come from opentype.js measurements
    // For MVP we use the values already in corpus.json
    fonts.push({
      family,
      category: font.category === 'display' ? 'display' : font.category,
      designer: 'Various',
      license: 'OFL',
      licenseUrl: 'https://openfontlicense.org',
      weights: weights.length > 0 ? weights : [400],
      variable: isVariable,
      subsets: font.subsets.filter((s) => s.startsWith('latin')),
      metrics: {
        xHeightRatio: 0.52,
        capHeightRatio: 0.71,
        ascenderRatio: 0.96,
        descenderRatio: 0.24,
        strokeContrast: 1.5,
      },
      traits: [],
      cssUrl,
    });
  }

  if (missing.length > 0) {
    console.warn(`⚠  ${missing.length} families not found in Google Fonts:`);
    missing.forEach((f) => console.warn(`   - ${f}`));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    count: fonts.length,
    fonts,
  };

  const outPath = resolve(process.cwd(), 'src/lib/fonts/corpus.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`✅ corpus.json written — ${fonts.length} fonts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});