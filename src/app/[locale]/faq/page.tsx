import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { faq } from '@/content/faq';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { alternatesFor, openGraphFor } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { faqLd } from '@/lib/structured-data';
import { GLYPHS, Glyph } from '@/components/Glyph';
import { SectionHeading } from '@/components/SectionHeading';
import { WhatsAppIcon } from '@/components/Icons';
import { whatsappLink } from '@/lib/store-config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : 'en';
  const dict = getDictionary(loc);
  const description = faq[0].a[loc].slice(0, 155);
  return {
    title: dict.legal.faq,
    description,
    alternates: alternatesFor(loc, '/faq'),
    openGraph: { ...openGraphFor(loc, '/faq'), title: dict.legal.faq, description },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={faqLd(locale)} />

      <SectionHeading
        glyph={GLYPHS.wedjat}
        title={dict.legal.faq}
        align="start"
        as="h1"
      />

      <dl className="mt-10">
        {faq.map((entry, i) => (
          <div key={entry.id} id={entry.id} className={i === 0 ? '' : 'mt-8'}>
            <dt className="flex items-start gap-3 text-lg font-semibold text-ink-900">
              <Glyph
                char={GLYPHS.ankh}
                className="mt-1 text-base text-gold-600"
              />
              {entry.q[locale]}
            </dt>
            <dd className="mt-2 ms-7 text-[1.02rem] leading-[1.9] text-ink-700">
              {entry.a[locale]}
            </dd>
          </div>
        ))}
      </dl>

      <section className="papyrus-grain mt-14 rounded-sm border border-papyrus-300 p-7 text-center">
        <Glyph char={GLYPHS.ankh} className="text-2xl text-gold-600" />
        <h2 className="mt-2 text-xl font-semibold text-ink-900">
          {dict.shipping.contactTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-700">
          {dict.shipping.contactBody}
        </p>
        <a
          href={whatsappLink(dict.cart.whatsappIntro)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm bg-malachite-600 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-malachite-700"
        >
          <WhatsAppIcon />
          {dict.shipping.contactCta}
        </a>
      </section>

      <p className="mt-10 text-sm text-ink-500">
        <Link
          href={`/${locale}/legal/returns`}
          className="cursor-pointer underline decoration-gold-500 underline-offset-4 transition-colors duration-200 hover:text-lapis-700"
        >
          {dict.legal.returns}
        </Link>
      </p>
    </div>
  );
}
