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
}: {
  glyph: string;
  title: string;
  body?: string;
  align?: 'center' | 'start';
}) {
  const centred = align === 'center';
  return (
    <div className={centred ? 'text-center' : 'text-start'}>
      <Glyph
        char={glyph}
        className={`block text-2xl text-gold-600 ${centred ? 'mx-auto' : ''}`}
      />
      <h2 className="mt-2 text-2xl font-semibold text-ink-900 sm:text-3xl">
        {title}
      </h2>
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
