import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { GLYPHS } from '@/components/Glyph';
import { SearchResults } from '@/components/SearchResults';
import { SectionHeading } from '@/components/SectionHeading';

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
  // Internal search results are not something anyone should reach from Google.
  return { title: dict.search.title, robots: { index: false, follow: true } };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        glyph={GLYPHS.wedjat}
        title={dict.search.title}
        align="start"
        as="h1"
      />
      <SearchResults locale={locale} dict={dict} />
    </div>
  );
}
