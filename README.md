# MLA — Antiquities of the Nile

A bilingual (English / Arabic) storefront for an Egyptian antiquities and gift
shop selling into the GCC from Oman. Next.js 16 App Router, TypeScript,
Tailwind v4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerenders every page
python tests/test_storefront.py   # 99 end-to-end checks, see tests/README.md
```

> **Read [LAUNCH.md](LAUNCH.md) before trading.** The photographs and the
> prices both still belong to other people.

## What is in here

| | |
| --- | --- |
| 53 products | Curated from a 285-product scrape, in six collections |
| 262 photographs | Self-hosted in `public/products/`, served through `next/image` |
| 2 languages | Full RTL mirroring for Arabic, not just translated strings |
| 7 currencies | The six GCC currencies plus USD, defaulting to OMR |
| 147 pages | Prerendered. Two routes are dynamic — see below |

## Architecture

Everything is statically prerendered except the shared-order route, which
cannot be: the order lives in the URL. There is no database and no session.

| Route | Rendering |
| --- | --- |
| Everything else | Prerendered at build |
| `/[locale]/order/[code]` | Dynamic — the basket is encoded in the path |
| `…/order/[code]/opengraph-image` | Dynamic — share card generated per order |

- **Routing** — `src/app/[locale]/…`. `[locale]` is the root layout, so
  `<html lang>` and `dir` are set per language. Unknown locales 404; `/`
  redirects to `/en`.
- **Copy** — every UI string in `src/lib/i18n.ts`, typed so the Arabic
  dictionary cannot drift out of shape from the English one. Longer prose
  (legal documents, FAQ) lives in `src/content/`.
- **Products** — generated into `src/data/products.ts` by the pipeline in
  `scripts/`. Prices are stored in USD and converted at display time.
- **Currency** — `src/lib/currency.ts`. Five of the six GCC pegs are fixed by
  their central banks, so the rates are exact and need no FX API. KWD floats
  slightly; refresh it and `ratesAsOf` when it moves. First-time visitors are
  matched to a currency from their browser time zone.
- **Tax** — Oman VAT at 5%. Catalogue prices are VAT-inclusive, as Oman
  requires, so the tax is backed out of the total rather than added to it.
- **Cart** — client-side only, in a module-level store read through
  `useSyncExternalStore`, persisted to `localStorage` and synced across tabs.
- **Orders** — `src/lib/order.ts` builds an `Order` with a reference, frozen
  totals and tax. Checkout is a real link to `api.whatsapp.com`, never a
  popup. Nothing is charged on the site and no order is stored anywhere.
- **Search** — `src/lib/search.ts`. Matches across both languages at once,
  with Arabic folded for diacritics, the alef forms, ta marbuta and tatweel.
- **Design** — tokens in `src/app/globals.css`. Palette taken from the
  pigments the Egyptians ground: limestone and papyrus grounds, carbon black
  text, lapis for the primary, carnelian for sale, malachite for success, gold
  for ornament only. Gold never carries body text — it fails contrast on every
  light ground used here. Ornament is real Unicode hieroglyphs
  (U+13000–U+1342F), not a picture font.
- **Brand** — `public/brand/`, derived from the supplied logo kit. See
  [public/brand/README.md](public/brand/README.md) for which variant goes
  where and why.

## Configuring the shop

`src/lib/store-config.ts` holds the company identity, contact details and VAT
rate. It is the only file to edit to point the storefront at a real business,
and `launchBlockers()` in it lists what is still unset. Each contact channel is
gated on its own: a placeholder email stays out of the footer and the
structured data rather than being published dead.

## Repository map

| Path | What |
| --- | --- |
| `src/app/[locale]/` | Routes |
| `src/components/` | UI |
| `src/lib/` | Currency, i18n, search, orders, SEO, config |
| `src/data/` | Generated catalogue and collections |
| `src/content/` | Legal documents and FAQ |
| `scripts/` | Catalogue pipeline and brand asset builders |
| `tests/` | End-to-end suite |
| `public/brand/` | Logo variants and share cards |

## Image rights

The photographs in `public/products/` were taken from the public product feeds
of the stores in the original scrape (Egyptian Imports, Statue.com, The Ancient
Home) and belong to them. They are here so the site can be built and reviewed
with real content. **Replace them with your own photography before trading.**
`scripts/README.md` explains how — it is a drop-in swap at the same paths.
