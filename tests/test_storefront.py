"""End-to-end functional test of the MLA storefront against production."""
import json, re, sys
from playwright.sync_api import sync_playwright

BASE = 'https://mla-kappa.vercel.app'
results, console_errors = [], []

def check(section, name, ok, detail=''):
    results.append((section, name, bool(ok), str(detail)[:120]))

def settle(page, ms=900):
    try:
        page.wait_for_load_state('networkidle', timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(ms)

def attach(page):
    page.on('console', lambda m: console_errors.append(
        f'{page.url.replace(BASE,"")} :: {m.text[:110]}') if m.type == 'error' else None)
    page.on('pageerror', lambda e: console_errors.append(
        f'{page.url.replace(BASE,"")} :: PAGEERROR {str(e)[:110]}'))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900},
                              locale='en-GB')
    page = ctx.new_page()
    attach(page)

    # ---------------------------------------------------------- 1. ROUTES
    routes = ['/', '/en', '/ar', '/en/collections', '/ar/collections',
              '/en/collections/gods', '/ar/collections/afterlife',
              '/en/products/ankh-statue', '/ar/products/nefertiti-gold',
              '/en/search', '/ar/search', '/en/faq', '/ar/faq',
              '/en/story', '/ar/story', '/en/shipping', '/ar/shipping',
              '/en/legal/terms', '/en/legal/privacy', '/en/legal/returns',
              '/ar/legal/terms', '/en/cart', '/ar/cart']
    for r in routes:
        resp = page.goto(BASE + r, wait_until='domcontentloaded')
        check('routes', f'{r} responds 200', resp and resp.status == 200,
              resp.status if resp else 'no response')
    resp = page.goto(BASE + '/en/this-does-not-exist', wait_until='domcontentloaded')
    check('routes', '404 for unknown path', resp and resp.status == 404,
          resp.status if resp else '?')

    # ------------------------------------------------------ 2. NAVIGATION
    page.goto(BASE + '/en'); settle(page)
    nav_links = page.eval_on_selector_all(
        'header nav a', 'els => els.map(e => ({t:e.textContent.trim(), h:e.getAttribute("href")}))')
    check('nav', 'desktop nav has 5 entries', len(nav_links) == 5, nav_links)
    for l in nav_links:
        r = page.goto(BASE + l['h'], wait_until='domcontentloaded')
        check('nav', f'nav "{l["t"]}" works', r and r.status == 200, l['h'])
    page.goto(BASE + '/en'); settle(page)
    h1 = page.eval_on_selector_all('h1', 'e => e.length')
    check('nav', 'home has exactly one h1', h1 == 1, h1)

    # ---------------------------------------------------------- 3. SEARCH
    page.goto(BASE + '/en/search'); settle(page)
    box = page.locator('input[type=search]')
    check('search', 'search input focused on load',
          page.evaluate('document.activeElement?.type === "search"'))
    cases = [('bastet', 3), ('scarab', 11), ('alabaster', 1), ('canopic', 8),
             ('xyzzy', 0), ('scarab blue', 2)]
    for q, expected in cases:
        box.fill(q); page.wait_for_timeout(450)
        n = page.locator('article').count()
        check('search', f'"{q}" returns {expected}', n == expected, f'got {n}')
    box.fill('xyzzy'); page.wait_for_timeout(400)
    check('search', 'empty state shown',
          page.locator('text=Nothing matches').count() > 0)
    box.fill('bastet'); page.wait_for_timeout(400)
    check('search', 'query written to URL', 'q=bastet' in page.url, page.url)

    # Arabic search, including the diacritic / hamza folds
    page.goto(BASE + '/ar/search'); settle(page)
    box = page.locator('input[type=search]')
    ar_cases = [('أنوبيس', 4), ('انوبيس', 4), ('إيزيس', 2), ('ايزيس', 2),
                ('باستت', 3), ('بَاسْتت', 3), ('كانوبية', 8), ('كانوبيه', 8),
                ('bastet', 3)]
    for q, expected in ar_cases:
        box.fill(q); page.wait_for_timeout(450)
        n = page.locator('article').count()
        check('search-ar', f'"{q}" returns {expected}', n == expected, f'got {n}')

    # -------------------------------------------------- 4. FILTERS / SORT
    page.goto(BASE + '/en/collections'); settle(page)
    check('filters', 'all 53 products listed', page.locator('article').count() == 53,
          page.locator('article').count())
    sels = page.locator('main select')
    sels.nth(0).select_option('scarabs'); page.wait_for_timeout(600)
    check('filters', 'collection filter narrows', page.locator('article').count() == 9,
          page.locator('article').count())
    check('filters', 'collection in URL', 'collection=scarabs' in page.url, page.url)
    sels.nth(3).select_option('priceAsc'); page.wait_for_timeout(600)
    prices = page.eval_on_selector_all(
        'article', 'els => els.map(e => parseFloat((e.textContent.match(/OMR ([\\d.]+)/)||[0,0])[1]))')
    check('filters', 'price ascending sorted', prices == sorted(prices), prices[:4])
    check('filters', 'sort in URL', 'sort=priceAsc' in page.url, page.url)
    page.goto(BASE + '/en/collections?collection=gods&sort=priceDesc'); settle(page)
    prices = page.eval_on_selector_all(
        'article', 'els => els.map(e => parseFloat((e.textContent.match(/OMR ([\\d.]+)/)||[0,0])[1]))')
    check('filters', 'shared filter URL restores state',
          page.locator('article').count() == 16 and prices == sorted(prices, reverse=True),
          f'{page.locator("article").count()} items')
    clear = page.locator('button:has-text("Clear filters")')
    if clear.count():
        clear.click(); page.wait_for_timeout(600)
        check('filters', 'clear resets to 53', page.locator('article').count() == 53,
              page.locator('article').count())

    # -------------------------------------------------------- 5. CURRENCY
    page.goto(BASE + '/en/products/ankh-statue'); settle(page)
    cur = page.locator('header select').first
    seen = {}
    for code in ['OMR', 'AED', 'SAR', 'QAR', 'BHD', 'KWD', 'USD']:
        cur.select_option(code); page.wait_for_timeout(450)
        txt = page.locator('h1').first.evaluate(
            'el => el.parentElement.textContent.match(/[A-Z$]{1,3}\\s?[\\d.,]+/)[0]')
        seen[code] = txt
        check('currency', f'{code} renders a price', bool(re.search(r'[\d.]', txt)), txt)
    check('currency', 'prices differ between currencies', len(set(seen.values())) >= 6, seen)
    cur.select_option('OMR'); page.wait_for_timeout(400)
    page.reload(); settle(page)
    check('currency', 'choice survives reload',
          page.locator('header select').first.input_value() == 'OMR')

    # ---------------------------------------------- 6. LANGUAGE AND RTL
    page.goto(BASE + '/en/collections/gods?sort=priceAsc'); settle(page)
    page.locator('a[aria-label*="Language"]').first.click(); settle(page)
    check('i18n', 'language switch keeps page and query',
          '/ar/collections/gods' in page.url and 'sort=priceAsc' in page.url, page.url)
    check('i18n', 'dir flips to rtl', page.evaluate('document.documentElement.dir') == 'rtl')
    check('i18n', 'lang attribute is ar', page.evaluate('document.documentElement.lang') == 'ar')
    logo_side = page.evaluate(
        '''() => { const l = document.querySelector('header img[alt=MLA]');
             return l.getBoundingClientRect().left > window.innerWidth/2; }''')
    check('i18n', 'logo mirrors to the right in RTL', logo_side)
    page.goto(BASE + '/ar'); settle(page)
    check('i18n', 'arabic hero renders arabic',
          'هدية' in page.locator('h1').first.inner_text())

    # ------------------------------------------------------ 7. PRODUCT PAGE
    page.goto(BASE + '/en/products/bastet-cat-collection'); settle(page)
    check('product', 'gallery has thumbnails',
          page.locator('ul[aria-label] button').count() >= 3)
    first_src = page.locator('main img').first.get_attribute('src')
    page.locator('ul[aria-label] button').nth(2).click(); page.wait_for_timeout(700)
    check('product', 'thumbnail changes main image',
          page.locator('main img').first.get_attribute('src') != first_src)
    check('product', 'scale reference present',
          'about the height of' in page.locator('body').inner_text().lower())
    check('product', 'VAT notice present',
          'include 5% VAT' in page.locator('body').inner_text())
    check('product', 'returns link present',
          page.locator('a[href*="legal/returns"]').count() > 0)
    check('product', 'breadcrumb present', page.locator('nav[aria-label=Breadcrumb]').count() == 1)

    # ------------------------------------------------------------ 8. CART
    page.locator('button[aria-label="Increase quantity"]').first.click()
    page.wait_for_timeout(250)
    page.locator('button:has-text("Add to cart")').first.click()
    page.wait_for_timeout(800)
    check('cart', 'badge shows 2 after qty 2',
          '2' in (page.locator('a[href$="/cart"]').first.get_attribute('aria-label') or ''))
    page.goto(BASE + '/en/products/scarab-blue'); settle(page)
    page.locator('button:has-text("Add to cart")').first.click(); page.wait_for_timeout(800)
    page.goto(BASE + '/en/cart'); settle(page)
    check('cart', 'two lines in cart', page.locator('main ul > li').count() == 2,
          page.locator('main ul > li').count())
    check('cart', 'unit price shown on qty>1 line',
          'each' in page.locator('main ul > li').first.inner_text())
    page.reload(); settle(page)
    check('cart', 'cart survives reload', page.locator('main ul > li').count() == 2)
    page.locator('button[aria-label="Increase quantity"]').first.click()
    page.wait_for_timeout(600)
    check('cart', 'quantity increments',
          '3' in page.locator('main ul > li').first.inner_text())
    page.locator('button:has-text("Remove")').nth(1).click(); page.wait_for_timeout(700)
    check('cart', 'remove deletes a line', page.locator('main ul > li').count() == 1,
          page.locator('main ul > li').count())

    # -------------------------------------------------- 9. LEGAL / FAQ
    page.goto(BASE + '/en/faq'); settle(page)
    check('content', 'FAQ has 10 questions', page.locator('dl > div').count() == 10,
          page.locator('dl > div').count())
    check('content', 'FAQ publishes FAQPage schema',
          'FAQPage' in page.content())
    for doc in ['terms', 'privacy', 'returns']:
        page.goto(BASE + f'/en/legal/{doc}'); settle(page)
        check('content', f'{doc} has h1 + sections',
              page.locator('h1').count() == 1 and page.locator('section').count() >= 4)

    # ----------------------------------------- 10. MOBILE / ACCESSIBILITY
    m = ctx.new_page(); attach(m)
    m.set_viewport_size({'width': 390, 'height': 844})
    m.goto(BASE + '/en'); settle(m)
    check('mobile', 'no horizontal overflow',
          m.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'))
    check('mobile', 'hamburger visible',
          m.locator('button[aria-controls=mobile-menu]').is_visible())
    m.locator('button[aria-controls=mobile-menu]').click(); m.wait_for_timeout(600)
    check('mobile', 'mobile menu opens',
          m.evaluate('document.querySelector("button[aria-controls=mobile-menu]").getAttribute("aria-expanded") === "true"'))
    m.goto(BASE + '/en/products/ankh-statue'); settle(m)
    bar = m.evaluate('''() => {
        const els=[...document.querySelectorAll('div')].filter(d=>{
          const s=getComputedStyle(d); const r=d.getBoundingClientRect();
          return s.position==='fixed' && r.bottom>=innerHeight-2 && r.height>40;});
        return els.length>0;}''')
    check('mobile', 'sticky buy bar present', bar)
    fab = m.evaluate('''() => {
        const a=[...document.querySelectorAll('a[href*="whatsapp"]')].filter(e=>getComputedStyle(e).position==='fixed')[0];
        if(!a) return null; const r=a.getBoundingClientRect();
        const bars=[...document.querySelectorAll('div')].filter(d=>{
          const s=getComputedStyle(d); const rr=d.getBoundingClientRect();
          return s.position==='fixed' && rr.bottom>=innerHeight-2 && rr.height>40;});
        return bars.length ? r.bottom < bars[0].getBoundingClientRect().top : true;}''')
    check('mobile', 'floating button clears the buy bar', fab is True, fab)
    small = m.evaluate('''() => [...document.querySelectorAll('a,button,select')]
        .filter(e=>{const r=e.getBoundingClientRect();
          if(e.className.toString().includes('sr-only')) return false;  // skip link
          // WCAG 2.5.8 exempts a target sitting inside a sentence
          const box = e.closest('p,span,li,div');
          if (box && box.textContent.trim().length > e.innerText.trim().length + 20
              && !e.closest('nav')) return false;
          return r.width>0 && r.height>0 && (r.height<24 || r.width<24);})
        .map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,30))''')
    check('a11y', 'targets meet WCAG 2.2 24px minimum', len(small) == 0, small)
    noalt = m.evaluate('[...document.querySelectorAll("img")].filter(i=>!i.hasAttribute("alt")).length')
    check('a11y', 'every image has alt', noalt == 0, noalt)
    m.goto(BASE + '/en'); settle(m)
    m.keyboard.press('Tab')
    check('a11y', 'first tab stop is skip link',
          m.evaluate('document.activeElement?.getAttribute("href") === "#main"'),
          m.evaluate('document.activeElement?.textContent'))
    m.close()

    # ------------------------------------------------- 11. THE TEST ORDER
    page.goto(BASE + '/en'); settle(page)
    page.evaluate('''() => localStorage.setItem('mla.cart.v1', JSON.stringify([
        {slug:'anubis-sarcophagus-box', qty:1},
        {slug:'canopic-set-black', qty:2},
        {slug:'scarab-box-tut', qty:1}]))''')
    page.goto(BASE + '/en/cart'); settle(page, 1500)
    link = page.locator('a:has-text("WhatsApp")').last
    order = {
        'href': link.get_attribute('href'),
        'tag': link.evaluate('e => e.tagName'),
        'target': link.get_attribute('target'),
        'lines': page.locator('main ul > li').count(),
        'total': page.locator('aside').inner_text(),
    }
    used_popup = page.evaluate('''() => { window.__popup=false;
        window.open = () => { window.__popup=true; return null; }; return true; }''')
    link.evaluate('e => e.removeAttribute("target")')
    page.evaluate('''() => document.addEventListener('click', e => {
        const a = e.target.closest('a[href*="whatsapp"]'); if (a) e.preventDefault(); }, true)''')
    link.click(); page.wait_for_timeout(2000)
    order['popup_used'] = page.evaluate('window.__popup')
    order['landed'] = page.url.replace(BASE, '')
    order['cart_after'] = page.evaluate("localStorage.getItem('mla.cart.v1')")
    order['reference'] = page.evaluate(
        "document.querySelector('.font-mono')?.textContent || null")
    check('order', 'checkout is a real link, not a popup',
          order['tag'] == 'A' and order['popup_used'] is False, order['tag'])
    check('order', 'lands on confirmation page', order['landed'].endswith('/order-sent'),
          order['landed'])
    check('order', 'cart cleared after ordering', order['cart_after'] == '[]',
          order['cart_after'])
    check('order', 'reference generated', bool(order['reference']), order['reference'])
    json.dump(order, open('/tmp/qa_order.json', 'w'), indent=1, ensure_ascii=False)

    browser.close()

# ------------------------------------------------------------- REPORT
by_section = {}
for s, n, ok, d in results:
    by_section.setdefault(s, []).append((n, ok, d))
print('=' * 72)
for s, items in by_section.items():
    passed = sum(1 for _, ok, _ in items if ok)
    print(f'\n{s.upper()}  ({passed}/{len(items)})')
    for n, ok, d in items:
        if not ok:
            print(f'  FAIL  {n}   [{d}]')
total = len(results); passed = sum(1 for *_, ok, _ in [(r[0],r[1],r[2],r[3]) for r in results] if ok)
passed = sum(1 for r in results if r[2])
print('\n' + '=' * 72)
print(f'TOTAL: {passed}/{total} checks passed')
print(f'CONSOLE ERRORS: {len(console_errors)}')
for e in console_errors[:10]:
    print('  ', e)
sys.exit(0 if passed == total and not console_errors else 1)
