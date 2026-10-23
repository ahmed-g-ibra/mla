import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { GLYPHS } from '@/components/Glyph';
import { OrderSent } from '@/components/OrderSent';
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
  return { title: dict.order.sentTitle, robots: { index: false, follow: false } };
}

export default async function OrderSentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        glyph={GLYPHS.ankh}
        title={dict.order.sentTitle}
        align="start"
        as="h1"
      />
      <OrderSent locale={locale} dict={dict} />
    </div>
  );
}
