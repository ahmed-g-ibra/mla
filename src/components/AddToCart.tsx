'use client';

import { useEffect, useState } from 'react';
import { useShop } from '@/lib/shop-store';
import type { Dictionary } from '@/lib/i18n';
import { CartIcon } from './Icons';

export function AddToCart({
  slug,
  dict,
}: {
  slug: string;
  dict: Dictionary;
}) {
  const { add } = useShop();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2200);
    return () => clearTimeout(t);
  }, [justAdded]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          add(slug);
          setJustAdded(true);
        }}
        className="inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-lapis-800 px-6 text-base font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900 sm:w-auto sm:min-w-64"
      >
        <CartIcon />
        {justAdded ? dict.product.added : dict.product.addToCart}
      </button>
      {/* Announced on change so screen readers get the confirmation too. */}
      <span aria-live="polite" className="sr-only">
        {justAdded ? dict.product.added : ''}
      </span>
    </div>
  );
}
