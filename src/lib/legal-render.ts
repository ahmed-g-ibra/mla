import type { Locale } from '@/data/products';
import { storeConfig } from './store-config';

/**
 * Fills the registration details into a legal paragraph.
 *
 * Unset values stay visible as PLACEHOLDER rather than being hidden, because a
 * terms page that silently omits the seller's identity is worse than one that
 * admits it is unfinished — and it keeps the gap in front of whoever reads it.
 */
export function fillLegal(text: string, locale: Locale): string {
  const values: Record<string, string> = {
    legalName: storeConfig.legalName,
    crNumber: storeConfig.crNumber,
    vatNumber: storeConfig.vatNumber,
    address: storeConfig.address[locale],
    whatsapp: `+${storeConfig.whatsappNumber}`,
    email: storeConfig.email,
    supportHours: storeConfig.supportHours[locale],
  };
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
