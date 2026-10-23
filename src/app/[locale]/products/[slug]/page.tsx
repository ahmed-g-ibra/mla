import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collectionById } from '@/data/collections';
import { productBySlug, products, productsIn } from '@/data/products';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { scaleReference } from '@/lib/scale';
import { SITE_URL, alternatesFor, openGraphFor } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd, productLd, skuFor } from '@/lib/structured-data';
import { AddToCart } from '@/components/AddToCart';
import { Gallery } from '@/components/Gallery';
import { GLYPHS, Glyph } from '@/components/Glyph';
import { ChevronIcon, RulerIcon, ChiselIcon, ShipIcon } from '@/components/Icons';
import { Price } from '@/components/Price';
import { ProductCard } from '@/components/ProductCard';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : 'en';
  const p = productBySlug(slug);
  if (!p) return {};
  const path = `/products/${p.slug}`;
  // Descriptions double as the SERP snippet, which truncates past ~160.
  const description =
    p.description[loc].length > 158
      ? p.description[loc].slice(0, 155).trimEnd() + '…'
      : p.description[loc];
  return {
    title: p.name[loc],
    description,
    alternates: alternatesFor(loc, path),
    openGraph: {
      ...openGraphFor(loc, path),
      type: 'website',
      // A shared product link previews the piece, on a card already cut to
      // 1.91:1 — the photographs are square, and left to itself WhatsApp
      // centre-crops them, clipping the top and bottom off anything tall.
      // Built by scripts/build_og_cards.mjs.
      images: [
        {
          url: `${SITE_URL}/brand/og/${p.slug}.jpg`,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: p.name[loc],
        },
      ],
      title: p.name[loc],
      description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = productBySlug(slug);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const collection = collectionById(product.collection);
  const related = productsIn(product.collection)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={productLd(locale, product)} />
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: dict.nav.collections, path: '/collections' },
          ...(collection
            ? [
                {
                  name: collection.name[locale],
                  path: `/collections/${collection.id}`,
                },
              ]
            : []),
          { name: product.name[locale], path: `/products/${product.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href={`/${locale}/collections`}
              className="inline-block cursor-pointer py-1 transition-colors duration-200 hover:text-lapis-700 hover:underline underline-offset-4"
            >
              {dict.nav.collections}
            </Link>
          </li>
          <ChevronIcon className="h-3.5 w-3.5 rtl:rotate-180" />
          {collection ? (
            <li>
              <Link
                href={`/${locale}/collections/${collection.id}`}
                className="inline-block cursor-pointer py-1 transition-colors duration-200 hover:text-lapis-700 hover:underline underline-offset-4"
              >
                {collection.name[locale]}
              </Link>
            </li>
          ) : null}
          <ChevronIcon className="h-3.5 w-3.5 rtl:rotate-180" />
          <li aria-current="page" className="text-ink-800">
            {product.name[locale]}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery
          images={product.images}
          alt={`${dict.a11y.productImage} ${product.name[locale]}`}
          dict={dict}
        />

        <div>
          {collection ? (
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-lapis-700 uppercase">
              <Glyph char={collection.glyph} className="text-lg text-gold-600" />
              {collection.name[locale]}
            </p>
          ) : null}

          <h1 className="mt-3 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
            {product.name[locale]}
          </h1>

          <div className="register-rule mt-4 w-32" />

          <div className="mt-5">
            <Price
              usd={product.priceUsd}
              compareAtUsd={product.compareAtUsd}
              locale={locale}
              size="lg"
            />
          </div>

          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-malachite-700">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-malachite-600"
            />
            {dict.product.inStock}
          </p>

          <h2 className="sr-only">{dict.product.about}</h2>
          <p className="mt-6 text-[1.02rem] leading-[1.85] text-ink-700">
            {product.description[locale]}
          </p>

          <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-papyrus-300 py-5 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2.5">
              <ChiselIcon className="h-4 w-4 text-lapis-600" />
              <dt className="text-ink-500">{dict.product.material}</dt>
              <dd className="font-medium text-ink-900">
                {product.material[locale]}
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <RulerIcon className="h-4 w-4 text-lapis-600" />
              <dt className="text-ink-500">{dict.product.height}</dt>
              <dd className="font-medium text-ink-900">
                <bdi className="tabular-nums">{product.heightCm} cm</bdi>
                <span className="ms-1.5 font-normal text-ink-500">
                  — {dict.product.scale} {scaleReference(product.heightCm, locale)}
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <ShipIcon className="h-4 w-4 text-lapis-600" />
              <dt className="sr-only">{dict.nav.shipping}</dt>
              <dd className="text-ink-700">{dict.product.shippingNote}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Glyph char={GLYPHS.scarab} className="text-base text-gold-600" />
              <dt className="text-ink-500">{dict.product.sku}</dt>
              <dd className="font-medium text-ink-900">{skuFor(product)}</dd>
            </div>
          </dl>

          <div className="mt-7">
            <AddToCart product={product} locale={locale} dict={dict} />
          </div>

          <h2 className="sr-only">{dict.product.detailsTitle}</h2>
          <ul className="mt-7 space-y-3 border-t border-papyrus-300 pt-6 text-sm">
            <li className="flex items-start gap-3">
              <ShipIcon className="mt-0.5 h-4 w-4 shrink-0 text-lapis-600" />
              <span className="text-ink-700">{dict.product.shippingShort}</span>
            </li>
            <li className="flex items-start gap-3">
              <RulerIcon className="mt-0.5 h-4 w-4 shrink-0 text-lapis-600" />
              <span className="text-ink-700">
                {dict.product.returnsShort}{' '}
                <Link
                  href={`/${locale}/legal/returns`}
                  className="cursor-pointer underline decoration-gold-500 underline-offset-4 transition-colors duration-200 hover:text-lapis-700"
                >
                  {dict.legal.returns}
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ChiselIcon className="mt-0.5 h-4 w-4 shrink-0 text-lapis-600" />
              <span className="text-ink-700">
                {dict.product.madeBody}{' '}
                <Link
                  href={`/${locale}/faq#authentic`}
                  className="cursor-pointer underline decoration-gold-500 underline-offset-4 transition-colors duration-200 hover:text-lapis-700"
                >
                  {dict.product.reproduction}
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-ink-900">
            {dict.product.related}
          </h2>
          <div className="register-rule mt-3 w-28" />
          <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
