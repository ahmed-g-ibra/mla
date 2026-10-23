import { Glyph } from './Glyph';

/**
 * A section title in the shape of a register header: a centred sign, the
 * title, and a thin gold rule beneath — the way a tomb wall announces a
 * new band of scenes.
 */
export function SectionHeading({
  glyph,
  title,
  body,
  align = 'center',
  as: Heading = 'h2',
}: {
  glyph: string;
  title: string;
  body?: string;
  align?: 'center' | 'start';
  /** The page's own title should be an h1; section titles stay h2. */
  as?: 'h1' | 'h2';
}) {
  const centred = align === 'center';
  return (
    <div className={centred ? 'text-center' : 'text-start'}>
      <Glyph
        char={glyph}
        className={`block text-2xl text-gold-600 ${centred ? 'mx-auto' : ''}`}
      />
      <Heading className="mt-2 text-2xl font-semibold text-ink-900 sm:text-3xl">
        {title}
      </Heading>
      <div
        className={`register-rule mt-3 h-px w-28 ${centred ? 'mx-auto' : ''}`}
      />
      {body ? (
        <p
          className={`mt-3 text-[0.98rem] leading-relaxed text-ink-500 ${
            centred ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
