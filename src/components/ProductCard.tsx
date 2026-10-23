import Image from 'next/image';
import Link from 'next/link';
import type { Locale, Product } from '@/data/products';
import type { Dictionary } from '@/lib/i18n';
import { Price } from './Price';

export function ProductCard({
  product,
  locale,
  dict,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const onSale = product.compareAtUsd !== null;

  return (
    <article className="group relative">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="block cursor-pointer focus:outline-none"
      >
        <div className="card-lift relative aspect-square overflow-hidden rounded-sm border border-papyrus-300 bg-white group-hover:-translate-y-1 group-hover:shadow-[0_12px_28px_-14px_rgba(22,18,12,0.45)] group-focus-visible:-translate-y-1">
          <Image
            src={product.images[0]}
            alt={`${dict.a11y.productImage} ${product.name[locale]}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 ease-[var(--ease-ancient)] group-hover:scale-[1.04]"
            priority={priority}
          />
          {(product.featured || onSale) && (
            <div className="absolute start-2 top-2 flex flex-col items-start gap-1">
              {product.featured && (
                <span className="rounded-xs bg-lapis-800 px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-papyrus-50 uppercase">
                  {dict.product.bestseller}
                </span>
              )}
              {onSale && (
                <span className="rounded-xs bg-carnelian-600 px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-papyrus-50 uppercase">
                  {dict.product.reduced}
                </span>
              )}
            </div>
          )}
        </div>
        <h3 className="mt-3 text-[0.98rem] leading-snug font-semibold text-ink-900 transition-colors duration-200 group-hover:text-lapis-700">
          {product.name[locale]}
        </h3>
      </Link>
      <p className="mt-0.5 text-sm text-ink-500">
        {product.material[locale]} · <bdi>{product.heightCm} cm</bdi>
      </p>
      <div className="mt-1.5">
        <Price
          usd={product.priceUsd}
          compareAtUsd={product.compareAtUsd}
          locale={locale}
        />
      </div>
    </article>
  );
}
