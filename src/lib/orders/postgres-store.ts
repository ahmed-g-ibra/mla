import postgres from 'postgres';
import type { OrderStatus, OrderStore, StoredOrder } from './types';

/**
 * Postgres, which is what runs in production.
 *
 * Works unchanged against Vercel Postgres, Neon or Supabase — they are all
 * Postgres behind a connection string. The schema is created on first use so
 * there is no separate migration step to forget.
 */
let sql: ReturnType<typeof postgres> | null = null;

const db = () => {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, {
      ssl: 'require',
      max: 1, // serverless: one connection per instance
      idle_timeout: 20,
    });
  }
  return sql;
};

let ready: Promise<void> | null = null;

export const postgresStore: OrderStore = {
  kind: 'postgres',

  async init() {
    ready ??= (async () => {
      await db()`
        CREATE TABLE IF NOT EXISTS orders (
          reference    text PRIMARY KEY,
          placed_at    timestamptz NOT NULL,
          updated_at   timestamptz NOT NULL,
          locale       text NOT NULL,
          currency     text NOT NULL,
          status       text NOT NULL DEFAULT 'new',
          lines        jsonb NOT NULL,
          subtotal_usd numeric(10,2) NOT NULL,
          vat_usd      numeric(10,2) NOT NULL,
          total_usd    numeric(10,2) NOT NULL,
          notes        jsonb NOT NULL DEFAULT '[]'::jsonb
        )`;
      await db()`
        CREATE INDEX IF NOT EXISTS orders_placed_at_idx
        ON orders (placed_at DESC)`;
    })();
    await ready;
  },

  async save(order) {
    await this.init();
    await db()`
      INSERT INTO orders (
        reference, placed_at, updated_at, locale, currency, status,
        lines, subtotal_usd, vat_usd, total_usd, notes
      ) VALUES (
        ${order.reference}, ${order.placedAt}, ${order.updatedAt},
        ${order.locale}, ${order.currency}, ${order.status},
        ${db().json(order.lines)}, ${order.subtotalUsd}, ${order.vatUsd},
        ${order.totalUsd}, ${db().json(order.notes)}
      )
      -- a customer who taps checkout twice should not get two orders
      ON CONFLICT (reference) DO NOTHING`;
  },

  async list() {
    await this.init();
    const rows = await db()`
      SELECT * FROM orders ORDER BY placed_at DESC LIMIT 500`;
    return rows.map(toOrder);
  },

  async get(reference) {
    await this.init();
    const rows = await db()`
      SELECT * FROM orders WHERE reference = ${reference} LIMIT 1`;
    return rows.length ? toOrder(rows[0]) : null;
  },

  async setStatus(reference: string, status: OrderStatus) {
    await this.init();
    await db()`
      UPDATE orders SET status = ${status}, updated_at = now()
      WHERE reference = ${reference}`;
  },

  async addNote(reference, body) {
    await this.init();
    const note = {
      id: crypto.randomUUID(),
      body,
      createdAt: new Date().toISOString(),
    };
    await db()`
      UPDATE orders
      SET notes = notes || ${db().json([note])}::jsonb, updated_at = now()
      WHERE reference = ${reference}`;
  },
};

type Row = Record<string, unknown>;

const toOrder = (r: Row): StoredOrder => ({
  reference: String(r.reference),
  placedAt: new Date(r.placed_at as string).toISOString(),
  updatedAt: new Date(r.updated_at as string).toISOString(),
  locale: r.locale === 'ar' ? 'ar' : 'en',
  currency: String(r.currency),
  status: String(r.status) as OrderStatus,
  lines: r.lines as StoredOrder['lines'],
  subtotalUsd: Number(r.subtotal_usd),
  vatUsd: Number(r.vat_usd),
  totalUsd: Number(r.total_usd),
  notes: (r.notes ?? []) as StoredOrder['notes'],
});
