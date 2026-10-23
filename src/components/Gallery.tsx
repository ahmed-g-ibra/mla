'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n';

export function Gallery({
  images,
  alt,
  dict,
}: {
  images: string[];
  alt: string;
  dict: Dictionary;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm border border-papyrus-300 bg-white">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt} — ${active + 1}/${images.length}`}
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          priority
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <ul
          aria-label={dict.product.gallery}
          className="mt-3 grid grid-cols-5 gap-2.5"
        >
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${dict.product.viewImage} ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                className={`relative block aspect-square w-full cursor-pointer overflow-hidden rounded-sm border bg-white transition-colors duration-200 ${
                  i === active
                    ? 'border-lapis-700 ring-1 ring-lapis-700'
                    : 'border-papyrus-300 hover:border-gold-500'
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
