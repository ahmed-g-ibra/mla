import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { GLYPHS } from '@/components/Glyph';
import { ProductBrowser } from '@/components/ProductBrowser';
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
  return { title: dict.collection.allTitle, description: dict.collection.allBody };
}

export default async function CollectionsPage({
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
        glyph={GLYPHS.netjer}
        title={dict.collection.allTitle}
        body={dict.collection.allBody}
        align="start"
      />
      <div className="mt-8">
        <ProductBrowser products={products} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
