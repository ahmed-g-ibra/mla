'use client';

import { formatMoney } from '@/lib/currency';
import { useShop } from '@/lib/shop-store';
import type { Locale } from '@/data/products';

/**
 * Prices live in USD and are converted on the client, so the page itself
 * stays static and cacheable at the edge.
 */
export function Price({
  usd,
  compareAtUsd,
  locale,
  size = 'md',
}: {
  usd: number;
  compareAtUsd?: number | null;
  locale: Locale;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { currency } = useShop();
  const text = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }[size];
  const saved =
    compareAtUsd && compareAtUsd > usd
      ? Math.round(((compareAtUsd - usd) / compareAtUsd) * 100)
      : null;

  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${text}`}>
      <span className="font-semibold tabular-nums text-ink-900">
        {formatMoney(usd, currency, locale)}
      </span>
      {compareAtUsd && compareAtUsd > usd ? (
        <>
          <s className="text-ink-400 tabular-nums decoration-carnelian-500/60">
            {formatMoney(compareAtUsd, currency, locale)}
          </s>
          {saved ? (
            <span className="rounded-sm bg-carnelian-600/10 px-1.5 py-0.5 text-xs font-semibold text-carnelian-700 tabular-nums">
              −{saved}%
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  );
}
