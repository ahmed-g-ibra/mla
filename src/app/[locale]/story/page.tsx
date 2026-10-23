import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productBySlug } from '@/data/products';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { GLYPHS, Glyph, GlyphFrieze } from '@/components/Glyph';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'en');
  return { title: dict.story.title, description: dict.story.lead };
}

const SECTION_GLYPHS = [GLYPHS.adze, GLYPHS.scarab, GLYPHS.water, GLYPHS.feather];

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const portrait = productBySlug('nefertiti-gold');

  return (
    <article>
      <header className="bg-lapis-900 text-papyrus-50">
        <div className="py-1.5 text-gold-400">
          <GlyphFrieze className="opacity-50" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
          <div>
            <Glyph char={GLYPHS.feather} className="text-3xl text-gold-400" />
            <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">
              {dict.story.title}
            </h1>
            <div className="register-rule mt-5 w-40" />
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-papyrus-200">
              {dict.story.lead}
            </p>
          </div>
          {portrait ? (
            <div className="relative mx-auto aspect-square w-full max-w-xs">
              <Image
                src={portrait.images[0]}
                alt=""
                fill
                sizes="320px"
                className="object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.45)]"
              />
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {dict.story.sections.map((s, i) => (
          <section key={s.h} className={i > 0 ? 'mt-12' : ''}>
            <h2 className="flex items-start gap-3 text-xl font-semibold text-ink-900 sm:text-2xl">
              <Glyph
                char={SECTION_GLYPHS[i % SECTION_GLYPHS.length]}
                className="mt-0.5 text-xl text-gold-600"
              />
              {s.h}
            </h2>
            <div className="register-rule mt-3 w-24" />
            <p className="mt-4 text-[1.02rem] leading-[1.9] text-ink-700">{s.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
