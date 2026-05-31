import { writeFileSync, mkdirSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const FONTS_DIR = 'public/fonts';
mkdirSync(FONTS_DIR, { recursive: true });

// Inter — download zip, extract, find the variable woff2
console.log('Downloading Inter v4.1...');
const interZip = join(FONTS_DIR, 'inter.zip');
const interRes = await fetch('https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip');
if (!interRes.ok) throw new Error(`Inter download failed: ${interRes.status}`);
await pipeline(interRes.body, createWriteStream(interZip));
execSync(`powershell -Command "Expand-Archive -Path '${interZip}' -DestinationPath '${FONTS_DIR}/inter-temp' -Force"`);
// Find and copy the variable woff2 (InterVariable.woff2 or Inter-roman.var.woff2)
execSync(`powershell -Command "$src = Get-ChildItem -Path '${FONTS_DIR}/inter-temp' -Recurse -Filter 'InterVariable*.woff2' | Select-Object -First 1; if ($src) { Copy-Item $src.FullName '${FONTS_DIR}/inter-variable.woff2' -Force } else { throw 'Inter variable woff2 not found' }"`);
execSync(`powershell -Command "Remove-Item -Recurse -Force '${FONTS_DIR}/inter-temp', '${interZip}'"`);
console.log('✓ Inter done');

// JetBrains Mono — download zip, extract, find variable woff2
console.log('Downloading JetBrains Mono v2.304...');
const jbZip = join(FONTS_DIR, 'jb.zip');
const jbRes = await fetch('https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip');
if (!jbRes.ok) throw new Error(`JetBrains Mono download failed: ${jbRes.status}`);
await pipeline(jbRes.body, createWriteStream(jbZip));
execSync(`powershell -Command "Expand-Archive -Path '${jbZip}' -DestinationPath '${FONTS_DIR}/jb-temp' -Force"`);
execSync(`powershell -Command "$src = Get-ChildItem -Path '${FONTS_DIR}/jb-temp' -Recurse -Filter 'JetBrainsMono*.woff2' | Where-Object { $_.Name -match '\\[wght\\]' } | Select-Object -First 1; if ($src) { Copy-Item $src.FullName '${FONTS_DIR}/jetbrains-mono-variable.woff2' -Force } else { $src2 = Get-ChildItem -Path '${FONTS_DIR}/jb-temp' -Recurse -Filter 'JetBrainsMono*.woff2' | Select-Object -First 1; if ($src2) { Copy-Item $src2.FullName '${FONTS_DIR}/jetbrains-mono-variable.woff2' -Force } else { throw 'JB Mono variable woff2 not found' } }"`);
execSync(`powershell -Command "Remove-Item -Recurse -Force '${FONTS_DIR}/jb-temp', '${jbZip}'"`);
console.log('✓ JetBrains Mono done');

console.log('Both fonts downloaded!');