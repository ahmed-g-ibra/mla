import { fileStore } from './file-store';
import { postgresStore } from './postgres-store';
import type { OrderStore } from './types';

/**
 * Picks a store, or says plainly that there isn't one.
 *
 * Returning null rather than throwing is deliberate: an unconfigured shop
 * should still take orders over WhatsApp exactly as it did before. Recording
 * them is an addition, and a missing database must not cost a sale.
 */
export function getOrderStore(): OrderStore | null {
  if (process.env.DATABASE_URL) return postgresStore;

  // The file store is ephemeral on a serverless filesystem: an order written
  // there would disappear silently, which is worse than not recording it.
  if (process.env.NODE_ENV !== 'production') return fileStore;

  return null;
}

export const storeIsConfigured = () => getOrderStore() !== null;
