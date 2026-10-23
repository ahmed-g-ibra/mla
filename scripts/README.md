# Data pipeline

The catalogue in `src/data/products.ts` is generated, not hand-written. These
four scripts rebuild it from the original scrape.

| Script | What it does |
| --- | --- |
| `xlsx_dump.py` | Prints the raw sheets of the scrape workbook (no openpyxl needed) |
| `curate.py` | Holds the curation table — which 53 pieces are in the shop, with their English and Arabic names and copy — and matches each to its scraped row |
| `fetch_images.py` | Downloads the selected photographs into `public/products/<slug>/` |
| `gen_data.py` | Emits the typed `src/data/products.ts` |

Run them in that order. `curate.py` and `gen_data.py` read and write paths that
point at the scrape workbook and this repo — edit the constants at the top of
each before running them elsewhere.

## Changing the catalogue

Add or remove an entry in the `C` table in `curate.py`, then re-run `curate.py`,
`fetch_images.py` and `gen_data.py`. Editing `src/data/products.ts` directly
works but will be overwritten the next time the pipeline runs.

## Replacing the photographs

Every image path in `products.ts` is `/products/<slug>/<n>.jpg`. Drop your own
photographs in at those paths, keeping the numbering, and nothing else needs to
change. See the note on image rights in the main README.
