import type { Locale } from '@/data/products';

/**
 * A centimetre figure tells you nothing in a living room. Anchoring it to an
 * everyday object is the cheapest way to stop a customer being surprised by
 * what arrives — the commonest cause of a return on small decorative goods.
 *
 * References are deliberately neutral for a Gulf audience.
 */
const REFERENCES: { max: number; label: Record<Locale, string> }[] = [
  { max: 8, label: { en: 'a coffee cup', ar: 'فنجان قهوة' } },
  { max: 14, label: { en: 'a tea glass', ar: 'كوب شاي' } },
  { max: 21, label: { en: 'a 500 ml water bottle', ar: 'زجاجة ماء ٥٠٠ مل' } },
  { max: 28, label: { en: 'an A5 notebook', ar: 'دفتر مقاس A5' } },
  { max: 34, label: { en: 'a sheet of A4 paper', ar: 'ورقة مقاس A4' } },
  { max: Infinity, label: { en: 'a laptop screen', ar: 'شاشة حاسوب محمول' } },
];

export const scaleReference = (heightCm: number, locale: Locale): string =>
  REFERENCES.find((r) => heightCm <= r.max)!.label[locale];
