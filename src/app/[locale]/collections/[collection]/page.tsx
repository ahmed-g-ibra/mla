import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collectionById, collections } from '@/data/collections';
import { productsIn, type CollectionId } from '@/data/products';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { ProductBrowser } from '@/components/ProductBrowser';
import { SectionHeading } from '@/components/SectionHeading';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    collections.map((c) => ({ locale, collection: c.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; collection: string }>;
}): Promise<Metadata> {
  const { locale, collection } = await params;
  const loc = isLocale(locale) ? locale : 'en';
  const c = collectionById(collection);
  if (!c) return {};
  return { title: c.name[loc], description: c.tagline[loc] };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; collection: string }>;
}) {
  const { locale, collection } = await params;
  if (!isLocale(locale)) notFound();
  const c = collectionById(collection);
  if (!c) notFound();
  const dict = getDictionary(locale);
  const items = productsIn(c.id as CollectionId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        glyph={c.glyph}
        title={c.name[locale]}
        body={c.tagline[locale]}
        align="start"
      />
      <p className="mt-2 text-sm text-ink-400">{c.glyphName[locale]}</p>
      <div className="mt-8">
        <ProductBrowser
          products={items}
          locale={locale}
          dict={dict}
          showCollectionFilter={false}
        />
      </div>
    </div>
  );
}
