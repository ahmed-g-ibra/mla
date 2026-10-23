import { collectionById } from '@/data/collections';
import type { Product } from '@/data/products';

/**
 * Folds a string down to something comparable.
 *
 * Arabic needs real work here, not just a lowercase. Shoppers type without
 * diacritics, and the same word is written with any of several alef forms, so
 * a name typed with vowel marks, without them, or with a hamza has to reach
 * the same entry. Ta marbuta and alef maqsura are folded too, since which one
 * a person reaches for varies.
 */
export const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Latin combining accents
    // Harakat, plus the hamza and madda marks. NFKD above has already split
    // the hamza-bearing letters into a bare letter and one of these marks, so
    // the fold has to happen here: stripping only the 064B-0652 vowel signs
    // leaves a name written with hamza unreachable by the same name without.
    .replace(/[\u064b-\u0655\u0670]/g, '')
    .replace(/\u0640/g, '') // tatweel, the decorative stretch
    // Belt and braces for the alef forms NFKD leaves whole, such as alef wasla.
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0629/g, '\u0647') // ta marbuta -> ha
    .replace(/\u0649/g, '\u064a') // alef maqsura -> ya
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

type Field = { text: string; weight: number };

/**
 * Both languages go into every index, so someone reading the Arabic site can
 * still type "bastet" and someone on the English site can type باستت.
 */
const fieldsFor = (p: Product): Field[] => {
  const collection = collectionById(p.collection);
  return [
    { text: p.name.en, weight: 10 },
    { text: p.name.ar, weight: 10 },
    { text: collection?.name.en ?? '', weight: 4 },
    { text: collection?.name.ar ?? '', weight: 4 },
    { text: p.material.en, weight: 3 },
    { text: p.material.ar, weight: 3 },
    { text: p.description.en, weight: 1 },
    { text: p.description.ar, weight: 1 },
  ];
};

const indexCache = new WeakMap<Product, Field[]>();

const indexFor = (p: Product): Field[] => {
  let fields = indexCache.get(p);
  if (!fields) {
    fields = fieldsFor(p).map((f) => ({ ...f, text: normalize(f.text) }));
    indexCache.set(p, fields);
  }
  return fields;
};

export type SearchHit = { product: Product; score: number };

/**
 * Every term has to match something, which is what people expect when they
 * add a word to narrow a search. A term matching the start of a word scores
 * above one matching mid-word, so "scar" ranks Scarab over Oscar-like noise.
 */
export function searchProducts(query: string, products: Product[]): SearchHit[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];

  const hits: SearchHit[] = [];

  for (const product of products) {
    const fields = indexFor(product);
    let score = 0;
    let matchedEveryTerm = true;

    for (const term of terms) {
      let best = 0;
      for (const field of fields) {
        const at = field.text.indexOf(term);
        if (at === -1) continue;
        const startsWord = at === 0 || field.text[at - 1] === ' ';
        const exact = field.text === term;
        best = Math.max(
          best,
          field.weight * (exact ? 3 : startsWord ? 2 : 1),
        );
      }
      if (best === 0) {
        matchedEveryTerm = false;
        break;
      }
      score += best;
    }

    if (matchedEveryTerm) hits.push({ product, score });
  }

  return hits.sort(
    (a, b) =>
      b.score - a.score ||
      Number(b.product.featured) - Number(a.product.featured) ||
      a.product.priceUsd - b.product.priceUsd,
  );
}
