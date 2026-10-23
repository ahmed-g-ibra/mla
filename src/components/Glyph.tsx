/**
 * A single Unicode Egyptian hieroglyph used as ornament.
 *
 * These are real signs, not a decorative font: U+13000–U+1342F. They are
 * always decorative here, so they are hidden from assistive technology and
 * the meaning is carried by the adjacent text instead.
 */
export function Glyph({
  char,
  className = '',
}: {
  char: string;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`glyph select-none ${className}`}>
      {char}
    </span>
  );
}

/** The signs used across the site, with their transliteration. */
export const GLYPHS = {
  ankh: '\u{132F9}', // ꜥnḫ — life
  djed: '\u{132BD}', // ḏd — endurance
  scarab: '\u{131A3}', // ḫpr — to come into being
  netjer: '\u{132B9}', // nṯr — god
  pyramid: '\u{13274}', // mr — pyramid
  wedjat: '\u{13080}', // wḏꜣt — the sound eye
  nesutBity: '\u{131D3}\u{131A4}', // nsw-bjtj — sedge and bee, king of the two lands
  owlM: '\u{13153}', // m — the owl
  lionL: '\u{130ED}', // rw / l — the recumbent lion
  vultureA: '\u{1313F}', // ꜣ — the Egyptian vulture
  water: '\u{13216}', // n — ripple of water
  sun: '\u{131F3}', // rꜥ — the sun disc
  feather: '\u{13184}', // mꜣꜥt — the feather of truth
  adze: '\u{13347}', // the craftsman's adze
  star: '\u{131FC}', // sbꜣ — star
} as const;

/**
 * A horizontal frieze of signs, the way a register border runs along the top
 * of a tomb wall. Repeats to fill whatever width it is given.
 */
export function GlyphFrieze({ className = '' }: { className?: string }) {
  const band = [
    GLYPHS.ankh,
    GLYPHS.water,
    GLYPHS.scarab,
    GLYPHS.water,
    GLYPHS.djed,
    GLYPHS.water,
    GLYPHS.wedjat,
    GLYPHS.water,
  ];
  return (
    <div
      aria-hidden="true"
      className={`glyph pointer-events-none flex select-none justify-center gap-3 overflow-hidden text-[0.95rem] leading-none whitespace-nowrap ${className}`}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i}>{band[i % band.length]}</span>
      ))}
    </div>
  );
}
