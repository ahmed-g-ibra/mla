import type { Metadata } from 'next';
import { IMAGE_BLUR } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collections } from '@/data/collections';
import {
  featuredProducts,
  onSaleProducts,
  productBySlug,
  productsIn,
} from '@/data/products';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { alternatesFor, openGraphFor } from '@/lib/seo';
import { CollectionCard } from '@/components/CollectionCard';
import { GLYPHS, Glyph } from '@/components/Glyph';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { ChiselIcon, ChevronIcon, RulerIcon, ShipIcon } from '@/components/Icons';

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
  // Absolute, so the Arabic home page stops inheriting the English title.
  const title = `${dict.brand} — ${dict.brandLine}`;
  return {
    title: { absolute: title },
    description: dict.home.heroBody,
    alternates: alternatesFor(loc),
    openGraph: { ...openGraphFor(loc), title, description: dict.home.heroBody },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const hero = productBySlug('anubis-sarcophagus-box');
  const bestsellers = featuredProducts.slice(0, 8);
  const reduced = onSaleProducts
    .filter((p) => !p.featured)
    .sort(
      (a, b) =>
        (b.compareAtUsd! - b.priceUsd) / b.compareAtUsd! -
        (a.compareAtUsd! - a.priceUsd) / a.compareAtUsd!,
    )
    .slice(0, 4);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-lapis-900 text-papyrus-50">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #ecd89b 0 1px, transparent 1px 7px)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
              <Glyph char={GLYPHS.ankh} className="text-base" />
              {dict.home.eyebrow}
            </p>
            <h1 className="mt-4 text-[2.1rem] leading-[1.12] font-semibold whitespace-pre-line sm:text-5xl lg:text-[3.4rem]">
              {dict.home.heroTitle}
            </h1>
            <div className="register-rule mt-6 w-40" />
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-papyrus-200">
              {dict.home.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/collections`}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-sm bg-gold-500 px-6 font-semibold text-ink-900 transition-colors duration-200 hover:bg-gold-400"
              >
                {dict.home.heroCta}
                <ChevronIcon className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/collections?sort=featured`}
                className="inline-flex min-h-12 cursor-pointer items-center rounded-sm border border-papyrus-200/40 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:border-gold-400 hover:text-gold-300"
              >
                {dict.home.heroCtaSecondary}
              </Link>
            </div>
          </div>

          {hero ? (
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-papyrus-100/10 blur-2xl"
              />
              <Image
                src={hero.images[0]}
                alt={`${dict.a11y.productImage} ${hero.name[locale]}`}
                fill
                sizes="(max-width: 768px) 90vw, 440px"
                priority
                className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
          />
            </div>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------- Trust strip */}
      <section className="border-b border-papyrus-300 bg-papyrus-100">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { Icon: ChiselIcon, text: dict.footer.madeIn },
            { Icon: ShipIcon, text: dict.product.shippingNote },
            { Icon: RulerIcon, text: dict.product.inStock },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-ink-700">
              <Icon className="h-5 w-5 text-lapis-600" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- Collections */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          glyph={GLYPHS.netjer}
          title={dict.home.collectionsTitle}
          body={dict.home.collectionsBody}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              locale={locale}
              count={productsIn(c.id).length}
              countLabel={dict.collection.pieces}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Bestsellers */}
      <section className="papyrus-grain border-y border-papyrus-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            glyph={GLYPHS.sun}
            title={dict.home.bestsellersTitle}
            body={dict.home.bestsellersBody}
          />
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <ProductCard
                key={p.slug}
                product={p}
                locale={locale}
                dict={dict}
                priority={i < 2}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/collections`}
              className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-sm border border-lapis-700 px-6 font-semibold text-lapis-800 transition-colors duration-200 hover:bg-lapis-800 hover:text-papyrus-50"
            >
              {dict.home.viewAll}
              <ChevronIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Story */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Glyph char={GLYPHS.feather} className="text-3xl text-gold-600" />
        <h2 className="mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">
          {dict.home.storyTitle}
        </h2>
        <div className="register-rule mx-auto mt-4 w-32" />
        <p className="mx-auto mt-5 max-w-3xl text-[1.02rem] leading-[1.9] text-ink-700">
          {dict.home.storyBody}
        </p>
        <Link
          href={`/${locale}/story`}
          className="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-2 font-semibold text-lapis-700 underline decoration-gold-500 decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-carnelian-600"
        >
          {dict.home.storyCta}
          <ChevronIcon className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </section>

      {/* -------------------------------------------------------------- Sale */}
      {reduced.length > 0 && (
        <section className="bg-papyrus-100">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              glyph={GLYPHS.wedjat}
              title={dict.home.saleTitle}
              body={dict.home.saleBody}
            />
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
              {reduced.map((p) => (
                <ProductCard key={p.slug} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
