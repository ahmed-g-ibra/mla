import json, os, subprocess, urllib.request, concurrent.futures as cf
BASE = "/Users/admin/Claude Code/mla/public/products"
data = json.load(open('/private/tmp/claude-501/-Users-admin-Claude-Code/448793d1-3033-4f7a-9945-123cf8f02ba6/scratchpad/curated.json'))
jobs = []
for p in data:
    d = os.path.join(BASE, p['slug']); os.makedirs(d, exist_ok=True)
    for i, url in enumerate(p['sourceImages']):
        jobs.append((url.split('?')[0] + '?width=1200', os.path.join(d, '%d.jpg' % (i+1))))

def get(j):
    url, dest = j
    if os.path.exists(dest) and os.path.getsize(dest) > 2000: return 'skip'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=45) as r: raw = r.read()
        if len(raw) < 1000: return 'tiny ' + url
        open(dest, 'wb').write(raw)
        return 'ok'
    except Exception as e:
        return 'FAIL %s %s' % (type(e).__name__, url[:90])

with cf.ThreadPoolExecutor(12) as ex: res = list(ex.map(get, jobs))
import collections
print(collections.Counter(r.split()[0] for r in res))
for r in res:
    if r.startswith(('FAIL', 'tiny')): print(' ', r)
