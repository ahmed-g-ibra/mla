import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { legalBySlug, legalDocuments, legalUpdated } from '@/content/legal';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { fillLegal } from '@/lib/legal-render';
import { alternatesFor, openGraphFor } from '@/lib/seo';
import { GLYPHS, Glyph } from '@/components/Glyph';
import { SectionHeading } from '@/components/SectionHeading';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    legalDocuments.map((d) => ({ locale, doc: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  const loc = isLocale(locale) ? locale : 'en';
  const document = legalBySlug(doc);
  if (!document) return {};
  const path = `/legal/${document.slug}`;
  return {
    title: document.title[loc],
    description: document.lead[loc],
    alternates: alternatesFor(loc, path),
    openGraph: {
      ...openGraphFor(loc, path),
      title: document.title[loc],
      description: document.lead[loc],
    },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  if (!isLocale(locale)) notFound();
  const document = legalBySlug(doc);
  if (!document) notFound();
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        glyph={GLYPHS.feather}
        title={document.title[locale]}
        body={document.lead[locale]}
        align="start"
        as="h1"
      />

      <p className="mt-4 text-sm text-ink-400">
        {dict.legal.updated} {legalUpdated}
      </p>

      {document.sections.map((s, i) => (
        <section key={s.h.en} className={i === 0 ? 'mt-10' : 'mt-9'}>
          <h2 className="flex items-start gap-3 text-xl font-semibold text-ink-900">
            <Glyph char={GLYPHS.water} className="mt-1 text-base text-gold-600" />
            {s.h[locale]}
          </h2>
          <div className="register-rule mt-3 w-24" />
          <p className="mt-4 text-[1.02rem] leading-[1.9] text-ink-700">
            {fillLegal(s.p[locale], locale)}
          </p>
        </section>
      ))}

      <p className="mt-12 rounded-sm border border-papyrus-300 bg-papyrus-100 p-4 text-sm leading-relaxed text-ink-500">
        {dict.legal.draftNotice}
      </p>
    </article>
  );
}
