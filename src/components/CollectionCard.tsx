import Image from 'next/image';
import Link from 'next/link';
import type { Collection } from '@/data/collections';
import { productBySlug, type Locale } from '@/data/products';
import { Glyph } from './Glyph';

export function CollectionCard({
  collection,
  locale,
  count,
  countLabel,
}: {
  collection: Collection;
  locale: Locale;
  count: number;
  countLabel: string;
}) {
  const cover = productBySlug(collection.cover);

  return (
    <Link
      href={`/${locale}/collections/${collection.id}`}
      className="group card-lift relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-papyrus-300 bg-papyrus-100 hover:-translate-y-1 hover:shadow-[0_14px_32px_-16px_rgba(14,36,68,0.5)] focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-white">
        {cover ? (
          <Image
            src={cover.images[0]}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-5 transition-transform duration-300 ease-[var(--ease-ancient)] group-hover:scale-[1.05]"
          />
        ) : null}
        <div className="absolute end-0 top-0 flex h-11 w-11 items-center justify-center bg-lapis-900/90 text-xl text-gold-400">
          <Glyph char={collection.glyph} />
        </div>
      </div>
      <div className="papyrus-grain flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-ink-900 transition-colors duration-200 group-hover:text-lapis-700">
          {collection.name[locale]}
        </h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-500">
          {collection.tagline[locale]}
        </p>
        <p className="mt-3 text-xs font-semibold tracking-wide text-lapis-700 uppercase">
          {count} {countLabel}
        </p>
      </div>
    </Link>
  );
}
