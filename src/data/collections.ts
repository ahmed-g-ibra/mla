import type { CollectionId, Locale } from './products';

export type Collection = {
  id: CollectionId;
  /** Unicode Egyptian Hieroglyph used as the collection's mark. */
  glyph: string;
  /** Transliteration of the glyph, surfaced as its accessible label. */
  glyphName: Record<Locale, string>;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  /** Slug of the product whose photograph fronts the collection. */
  cover: string;
};

export const collections: Collection[] = [
  {
    id: 'gods',
    glyph: '\u{132B9}',
    glyphName: { en: 'netjer — god', ar: 'نتر — إله' },
    name: { en: 'Gods & Goddesses', ar: 'آلهة وربّات' },
    tagline: {
      en: 'Bastet, Anubis, Isis, Horus — the household powers of the Nile.',
      ar: 'باستت وأنوبيس وإيزيس وحورس — قوى البيت في وادي النيل.',
    },
    cover: 'bastet-cat-collection',
  },
  {
    id: 'pharaohs',
    glyph: '\u{131D3}\u{131A4}',
    glyphName: {
      en: 'nesut-bity — he of the sedge and the bee',
      ar: 'نسو بيتي — صاحب السمار والنحلة',
    },
    name: { en: 'Pharaohs & Queens', ar: 'فراعنة وملكات' },
    tagline: {
      en: 'Tutankhamun, Nefertiti, Ramses — the faces that outlasted their dynasties.',
      ar: 'توت عنخ آمون ونفرتيتي ورمسيس — وجوه بقيت بعد أُسَرها.',
    },
    cover: 'nefertiti-gold',
  },
  {
    id: 'scarabs',
    glyph: '\u{131A3}',
    glyphName: { en: 'kheper — to come into being', ar: 'خبر — أن يصير' },
    name: { en: 'Scarabs & Amulets', ar: 'جعارين وتمائم' },
    tagline: {
      en: 'The beetle that rolls the sun, the ankh, the eye that guards.',
      ar: 'الجُعل الذي يدحرج الشمس، ومفتاح الحياة، والعين الحارسة.',
    },
    cover: 'scarab-blue',
  },
  {
    id: 'afterlife',
    glyph: '\u{132BD}',
    glyphName: { en: 'djed — endurance', ar: 'جد — الثبات' },
    name: { en: 'Canopic Jars & Ushabti', ar: 'أوانٍ كانوبية وأوشابتي' },
    tagline: {
      en: 'The four sons of Horus, and the small servants who answered the call.',
      ar: 'أبناء حورس الأربعة، والخدم الصغار الذين لبّوا النداء.',
    },
    cover: 'canopic-set-black',
  },
  {
    id: 'monuments',
    glyph: '\u{13274}',
    glyphName: { en: 'mer — pyramid', ar: 'مر — هرم' },
    name: { en: 'Pyramids & Monuments', ar: 'أهرامات ومعالم' },
    tagline: {
      en: 'Giza, the Sphinx, and the stone that gave us back the language.',
      ar: 'الجيزة وأبو الهول والحجر الذي أعاد إلينا اللغة.',
    },
    cover: 'pyramid-statue',
  },
  {
    id: 'gifts',
    glyph: '\u{132F9}',
    glyphName: { en: 'ankh — life', ar: 'عنخ — الحياة' },
    name: { en: 'Boxes, Light & Gifts', ar: 'صناديق وإضاءة وهدايا' },
    tagline: {
      en: 'Incense, candlelight and lidded boxes — pieces made to be given.',
      ar: 'بخور وضوء شموع وصناديق بأغطية — قطع صُنعت لتُهدى.',
    },
    cover: 'scarab-box-tut',
  },
];

export const collectionById = (id: string) =>
  collections.find((c) => c.id === id);
