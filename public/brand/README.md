# Brand assets

Derived from `mla-logo-primary.svg` in the supplied logo kit. Regenerate with
`scripts/build_logo.py` if the master changes.

| File | Use |
| --- | --- |
| `logo-compact.svg` | Header and anything on a light ground. Icon + wordmark, no tagline. |
| `logo-compact-dark.svg` | Footer and dark grounds. Cream wordmark, lightened gold. |
| `logo-full.svg` / `-dark` | The complete lockup including the tagline. **Only at 350px wide or more** — below that the tagline stops being legible. |
| `logo-glyph.svg` / `-dark` | Icon alone, centred on a square with 10% padding. Favicons, avatars, stamps. |
| `logo.png` / `logo-on-dark.png` | Raster lockup. `logo.png` is what `Organization.logo` points at, since Google does not accept SVG there. |

`src/app/icon.svg` and `src/app/apple-icon.png` are generated from the glyph
and picked up by Next's file conventions.

## Rules carried over from the logo audit

- The gold `#9A6506` only reaches 3.7:1 on dark backgrounds, which is fine for
  a mark but below the 4.5:1 text needs. The dark variants use `#B57A0C`.
- Never place the logo directly on photography. The gold sits in the same
  luminance band as sandstone and desert imagery and dissolves into it. Use a
  solid block, or a scrim of at least 55%.
- The glyph is a smudge at 16px. It is fine from 32px up, which is what
  browsers actually request on modern displays.

## Share cards

`og-image.png` is the brand card used by every page that is not a product.
`og/<slug>.png` is one card per product, built by `scripts/build_og_cards.mjs`
— rerun it after changing a product photograph. Both are 1200 × 630 with no
alpha, which is the shape and format WhatsApp and Facebook expect.
