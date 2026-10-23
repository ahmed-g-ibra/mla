import re, os

SRC = "/Users/admin/Claude Code/mla-logo/mla-logo-primary.svg"
OUT = "/Users/admin/Claude Code/mla/public/brand"
os.makedirs(OUT, exist_ok=True)

s = open(SRC, encoding='utf-8').read()
paths = re.findall(r'<path[^>]*fill="(#[0-9A-Fa-f]{6})"[^>]*d="([^"]+)"', s)
gold_d = next(d for c, d in paths if c.upper() == '#9A6506')
ink_d  = next(d for c, d in paths if c.upper() == '#150B03')

def subpaths(d):
    return [p for p in re.split(r'(?=M)', d) if p.strip()]

def bbox(sub):
    nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', sub)]
    xs, ys = nums[0::2], nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)

icon  = [p for p in subpaths(gold_d) if bbox(p)[2] < 175]
tag   = [p for p in subpaths(gold_d) if bbox(p)[2] >= 175]
word  = [p for p in subpaths(ink_d)  if bbox(p)[1] <= 215]

# Audit: #9A6506 is only 3.7:1 on dark — below the 4.5:1 text needs.
GOLD, GOLD_DARK = '#9A6506', '#B57A0C'
INK,  CREAM     = '#150B03', '#FBF8EE'

def svg(viewbox, w, h, layers, label):
    body = ''.join(
        '<path fill="%s" fill-rule="nonzero" d="%s"/>' % (c, ''.join(ps))
        for c, ps in layers if ps
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%g" height="%g" '
        'role="img" aria-label="%s">%s</svg>' % (viewbox, w, h, label, body)
    )

files = {}

# Compact: icon + MLA, no tagline. The tagline is what forced the 350px floor;
# without it the icon's own strokes govern, which holds far smaller.
files['logo-compact.svg']      = svg('0 0 573 283', 573, 283, [(GOLD, icon), (INK, word)], 'MLA')
files['logo-compact-dark.svg'] = svg('0 0 573 283', 573, 283, [(GOLD_DARK, icon), (CREAM, word)], 'MLA')

# Full lockup, kept for anywhere with 350px+ to give it.
files['logo-full.svg']         = svg('0 0 573 283', 573, 283, [(GOLD, icon + tag), (INK, word)], 'MLA — Ancient Treasures')
files['logo-full-dark.svg']    = svg('0 0 573 283', 573, 283, [(GOLD_DARK, icon + tag), (CREAM, word)], 'MLA — Ancient Treasures')

# Glyph: icon alone, centred on a square with 10% padding, for icons and avatars.
x0, y0, x1, y1 = (min(bbox(p)[0] for p in icon), min(bbox(p)[1] for p in icon),
                  max(bbox(p)[2] for p in icon), max(bbox(p)[3] for p in icon))
side = max(x1 - x0, y1 - y0) / 0.8
vx = (x0 + x1) / 2 - side / 2
vy = (y0 + y1) / 2 - side / 2
vb = '%.2f %.2f %.2f %.2f' % (vx, vy, side, side)
files['logo-glyph.svg']        = svg(vb, 512, 512, [(GOLD, icon)], 'MLA')
files['logo-glyph-dark.svg']   = svg(vb, 512, 512, [(GOLD_DARK, icon)], 'MLA')

for name, content in files.items():
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(content)
    print('%-24s %6d bytes' % (name, len(content)))

print('\nicon bbox  : x %.1f-%.1f  y %.1f-%.1f' % (x0, x1, y0, y1))
print('glyph vbox : %s' % vb)
print('compact    : icon %d subpaths + wordmark %d subpaths (tagline %d dropped)'
      % (len(icon), len(word), len(tag)))
