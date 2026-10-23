# -*- coding: utf-8 -*-
import json
d = json.load(open('/private/tmp/claude-501/-Users-admin-Claude-Code/448793d1-3033-4f7a-9945-123cf8f02ba6/scratchpad/curated.json'))

MAT = {
 'resin-bronze':   ("Bronze-finish resin",       "راتنج بتشطيب برونزي"),
 'resin-gold':     ("Gold-finish resin",         "راتنج بتشطيب ذهبي"),
 'resin-painted':  ("Hand-painted resin",        "راتنج مطليّ يدويًا"),
 'resin-stone':    ("Stone-finish resin",        "راتنج بتشطيب حجري"),
 'stone':          ("Hand-carved Egyptian stone","حجر مصري منحوت يدويًا"),
 'soapstone':      ("Carved soapstone",          "حجر صابوني منحوت"),
 'basalt':         ("Black basalt",              "بازلت أسود"),
 'alabaster':      ("Egyptian alabaster",        "مرمر مصري"),
 'ceramic':        ("Glazed ceramic",            "سيراميك مزجّج"),
}
def esc(s): return s.replace('\\', '\\\\').replace("'", "\\'")

L = []
L.append("// Generated from the Oct 2026 scrape of public Shopify product feeds.")
L.append("// Regenerate rather than hand-editing: see scripts/README.md\n")
L.append("export type Locale = 'en' | 'ar';")
L.append("export type CollectionId =\n  | " + "\n  | ".join("'%s'" % c for c in ['gods','pharaohs','scarabs','afterlife','monuments','gifts']) + ";\n")
L.append("""export type Product = {
  slug: string;
  collection: CollectionId;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  material: Record<Locale, string>;
  heightCm: number;
  priceUsd: number;
  compareAtUsd: number | null;
  featured: boolean;
  images: string[];
};\n""")
L.append("export const products: Product[] = [")
for p in d:
    me, ma = MAT[p['material']]
    L.append("  {")
    L.append("    slug: '%s'," % p['slug'])
    L.append("    collection: '%s'," % p['collection'])
    L.append("    name: { en: '%s', ar: '%s' }," % (esc(p['name']['en']), esc(p['name']['ar'])))
    L.append("    description: {")
    L.append("      en: '%s'," % esc(p['description']['en']))
    L.append("      ar: '%s'," % esc(p['description']['ar']))
    L.append("    },")
    L.append("    material: { en: '%s', ar: '%s' }," % (esc(me), esc(ma)))
    L.append("    heightCm: %d," % p['heightCm'])
    L.append("    priceUsd: %s," % p['priceUsd'])
    L.append("    compareAtUsd: %s," % (p['compareAtUsd'] if p['compareAtUsd'] else 'null'))
    L.append("    featured: %s," % ('true' if p['featured'] else 'false'))
    L.append("    images: [%s]," % ", ".join("'%s'" % i for i in p['images']))
    L.append("  },")
L.append("];\n")
L.append("""export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const productsIn = (collection: CollectionId) =>
  products.filter((p) => p.collection === collection);

export const featuredProducts = products.filter((p) => p.featured);

export const onSaleProducts = products.filter((p) => p.compareAtUsd !== null);
""")
open('/Users/admin/Claude Code/mla/src/data/products.ts', 'w').write("\n".join(L))
print('wrote products.ts |', len(d), 'products')
