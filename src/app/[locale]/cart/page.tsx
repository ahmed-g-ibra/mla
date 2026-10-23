import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { CartView } from '@/components/CartView';
import { GLYPHS } from '@/components/Glyph';
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
  return { title: dict.cart.title, robots: { index: false } };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading glyph={GLYPHS.ankh} title={dict.cart.title} align="start"
        as="h1" />
      <div className="mt-8">
        <CartView locale={locale} dict={dict} />
      </div>
    </div>
  );
}
