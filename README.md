# MLA — Antiquities of the Nile

A bilingual (English / Arabic) storefront for an Egyptian antiquities and gift
shop selling into the GCC. Next.js 16 App Router, TypeScript, Tailwind v4,
statically rendered end to end — 131 prerendered pages, no database, no
server-side runtime.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerenders every page
```

## What is in here

| | |
| --- | --- |
| 53 products | Curated from a 285-product scrape, in six collections |
| 262 photographs | Self-hosted in `public/products/`, served through `next/image` |
| 2 languages | Full RTL mirroring for Arabic, not just translated strings |
| 7 currencies | The six GCC currencies plus USD, defaulting to OMR |

## How it is put together

- **Routing** — `src/app/[locale]/…`. `[locale]` is the root layout, so `<html lang>`
  and `dir` are set per language. Unknown locales 404; `/` redirects to `/en`.
- **Copy** — every string lives in `src/lib/i18n.ts`, typed so that the Arabic
  dictionary cannot drift out of shape from the English one.
- **Products** — generated into `src/data/products.ts` by the pipeline in
  `scripts/`. Prices are stored in USD and converted at display time.
- **Currency** — `src/lib/currency.ts`. Five of the six GCC pegs are fixed by
  their central banks, so the rates are exact and need no FX API. KWD floats
  slightly against a basket; refresh it and `ratesAsOf` when it moves. First-time
  visitors are matched to a currency from their browser time zone.
- **Cart** — client-side only, persisted to `localStorage`. Checkout composes
  the order into a WhatsApp message; no payment is taken on the site.
- **Design** — tokens in `src/app/globals.css`. Palette taken from the pigments
  the Egyptians ground: limestone and papyrus grounds, carbon black text, lapis
  for the primary, carnelian for sale, malachite for success, gold for ornament
  only. Gold never carries body text — it fails contrast on every light ground
  used here. Ornament is real Unicode hieroglyphs (U+13000–U+1342F) in Noto Sans
  Egyptian Hieroglyphs, not a picture font.

## Configuring the shop

`src/lib/store-config.ts` holds the company identity, contact details and VAT
rate. It is the only file to edit to point the storefront at a real business,
and `launchBlockers()` in it lists what is still unset.

**Read `LAUNCH.md` before trading.** The photographs and the prices both still
belong to other people.

## Image rights

The photographs in `public/products/` were taken from the public product feeds
of the stores in the original scrape (Egyptian Imports, Statue.com, The Ancient
Home) and belong to them. They are here so the site can be built and reviewed
with real content. **Replace them with your own photography before trading.**
`scripts/README.md` explains how — it is a drop-in swap at the same paths.
