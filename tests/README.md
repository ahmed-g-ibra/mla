# End-to-end tests

`test_storefront.py` exercises the deployed site: every route, the
navigation, search in both languages including the Arabic folds, the filters
and sort, all seven currencies, the language switch and RTL mirroring, the
product page, the cart through add / quantity / remove / reload, the legal and
FAQ pages, mobile layout, the WCAG 2.2 target sizes, and a full order through
checkout. 99 assertions.

It runs against production rather than a local server, so it tests what a
customer actually gets — the CDN, the dynamic order route and the generated
share cards included.

```bash
pip install playwright && python -m playwright install chromium
python tests/test_storefront.py
```

Exits non-zero if any assertion fails or any console error appears. The one
expected console line is the 404 it deliberately requests.

Change `BASE` at the top of the file to test a local `npm start` instead.
