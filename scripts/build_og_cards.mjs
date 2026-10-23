/**
 * Builds a 1200x630 share card for every product.
 *
 * A shared product link previews the piece, but the photographs are square
 * and WhatsApp's card is 1.91:1 — so left to itself it centre-crops, which
 * clips the top and bottom off anything tall. These put the photograph whole,
 * uncropped, on a tile over the brand ground, so the card is deliberate at the
 * right shape rather than a square squeezed into a letterbox.
 *
 *   node scripts/build_og_cards.mjs
 */
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.join(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/brand/og');
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 630;
const TILE = { x: 84, y: 75, size: 480, radius: 10 };
const PAD = 26; // breathing room inside the tile

// Pull the logo artwork out of the dark compact lockup.
const logoSvg = readFileSync(path.join(ROOT, 'public/brand/logo-compact-dark.svg'), 'utf8');
const logoPaths = [...logoSvg.matchAll(/<path[^>]*fill="(#[0-9a-fA-F]{6})"[^>]*d="([^"]+)"/g)]
  .map((m) => ({ fill: m[1], d: m[2] }));
if (logoPaths.length !== 2) throw new Error('expected 2 logo layers, got ' + logoPaths.length);

const LOGO_W = 300;
const k = LOGO_W / 573;
const logoX = 660;
const logoY = H / 2 - (283 * k) / 2;

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<pattern id="pin" width="7" height="7" patternUnits="userSpaceOnUse">
<rect width="1" height="7" fill="#ECD89B" opacity="0.07"/>
</pattern>
</defs>
<rect width="${W}" height="${H}" fill="#0E2444"/>
<rect width="${W}" height="${H}" fill="url(#pin)"/>
<rect x="${TILE.x}" y="${TILE.y}" width="${TILE.size}" height="${TILE.size}" rx="${TILE.radius}" fill="#FBF8F1"/>
<g transform="translate(${logoX} ${logoY.toFixed(1)}) scale(${k.toFixed(5)})">
${logoPaths.map((p) => `<path fill="${p.fill}" fill-rule="nonzero" d="${p.d}"/>`).join('')}
</g>
<rect x="${logoX}" y="${(logoY + 283 * k + 26).toFixed(1)}" width="${LOGO_W}" height="1.5" fill="#C9A227" opacity="0.6"/>
</svg>`;

const products = JSON.parse(
  readFileSync(path.join(ROOT, 'scripts/og-products.json'), 'utf8'),
);

let made = 0;
for (const slug of products) {
  const photo = path.join(ROOT, 'public/products', slug, '1.jpg');
  if (!existsSync(photo)) {
    console.warn('  no photo for', slug);
    continue;
  }
  const inner = TILE.size - PAD * 2;
  const fitted = await sharp(photo)
    .resize(inner, inner, { fit: 'contain', background: '#FBF8F1' })
    .toBuffer();

  await sharp(Buffer.from(background))
    .composite([{ input: fitted, left: TILE.x + PAD, top: TILE.y + PAD }])
    .flatten({ background: '#0E2444' })
    // JPEG, not PNG: these are photographs, and PNG pushed the busiest of
    // them past 300KB — the size where WhatsApp starts declining to fetch a
    // preview at all. mozjpeg holds the quality at a third of the bytes.
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(path.join(OUT, `${slug}.jpg`));
  made += 1;
}
console.log(`built ${made} product share cards in public/brand/og/`);
