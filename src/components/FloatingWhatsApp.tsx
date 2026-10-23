'use client';

import { usePathname } from 'next/navigation';
import type { Dictionary } from '@/lib/i18n';
import { hasWhatsApp, whatsappLink } from '@/lib/store-config';
import { WhatsAppIcon } from './Icons';

/**
 * The persistent WhatsApp button.
 *
 * Ordering by WhatsApp is the norm in the Gulf rather than a fallback, so this
 * is the shop's front door as much as the cart is. It sits on the end side so
 * it mirrors in Arabic, and lifts clear of the product page's sticky buy bar
 * rather than covering it.
 */
export function FloatingWhatsApp({ dict }: { dict: Dictionary }) {
  const pathname = usePathname() ?? '';

  // Nothing to link to until a real number is configured.
  if (!hasWhatsApp) return null;

  // The cart and the order page already put a WhatsApp button in front of the
  // customer; a second floating one is just clutter competing with it.
  if (pathname.includes('/cart') || pathname.includes('/order-sent')) {
    return null;
  }

  // Product pages carry a sticky add-to-cart bar on small screens.
  const clearsStickyBar = pathname.includes('/products/');

  return (
    <a
      href={whatsappLink(dict.cart.whatsappIntro)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.shipping.contactCta}
      className={`fixed end-4 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-malachite-600 text-papyrus-50 shadow-[0_6px_20px_-6px_rgba(14,36,68,0.7)] transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-malachite-700 focus-visible:scale-105 ${
        clearsStickyBar ? 'bottom-24 lg:bottom-6' : 'bottom-6'
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
