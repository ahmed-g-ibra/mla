import { GLYPHS } from './Glyph';

/**
 * The MLA wordmark set inside a cartouche — the rope loop that enclosed a
 * royal name in Egyptian writing. The three signs inside spell the brand
 * phonetically: owl (m), recumbent lion (l), vulture (ꜣ).
 */
export function Cartouche({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dims = {
    sm: { w: 92, h: 34, glyph: 13, word: 13 },
    md: { w: 124, h: 44, glyph: 17, word: 17 },
    lg: { w: 190, h: 66, glyph: 26, word: 26 },
  }[size];

  return (
    <svg
      viewBox="0 0 124 44"
      width={dims.w}
      height={dims.h}
      className={className}
      role="img"
      aria-label="MLA"
    >
      {/* The cartouche loop: a rounded rectangle closed by a vertical bar. */}
      <rect
        x="3"
        y="3"
        width="112"
        height="38"
        rx="19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="117"
        y1="7"
        x2="117"
        y2="37"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="40"
        y="29"
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '0.14em',
        }}
      >
        MLA
      </text>
      <text
        x="86"
        y="30"
        textAnchor="middle"
        fill="currentColor"
        className="glyph"
        style={{ fontSize: 17, opacity: 0.85 }}
      >
        {GLYPHS.owlM}
        {GLYPHS.lionL}
        {GLYPHS.vultureA}
      </text>
    </svg>
  );
}
