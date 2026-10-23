import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { OrderStatus, OrderStore, StoredOrder } from './types';

/**
 * A JSON file on disk, for local development only.
 *
 * Serverless filesystems are ephemeral and per-instance, so this is refused in
 * production — an order written here would vanish without warning, which is
 * worse than having no store at all.
 */
const FILE = path.join(process.cwd(), '.orders', 'orders.json');

const read = async (): Promise<StoredOrder[]> => {
  try {
    return JSON.parse(await readFile(FILE, 'utf8')) as StoredOrder[];
  } catch {
    return [];
  }
};

const write = async (orders: StoredOrder[]) => {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(orders, null, 1), 'utf8');
};

export const fileStore: OrderStore = {
  kind: 'file',

  async init() {
    await mkdir(path.dirname(FILE), { recursive: true });
  },

  async save(order) {
    const orders = await read();
    // First write wins, matching the ON CONFLICT DO NOTHING in Postgres. A
    // customer tapping checkout twice must not overwrite the order — that
    // would silently discard whatever status and notes it had collected.
    if (orders.some((o) => o.reference === order.reference)) return;
    orders.unshift(order);
    await write(orders);
  },

  async list() {
    const orders = await read();
    return orders.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  },

  async get(reference) {
    return (await read()).find((o) => o.reference === reference) ?? null;
  },

  async setStatus(reference: string, status: OrderStatus) {
    const orders = await read();
    const order = orders.find((o) => o.reference === reference);
    if (!order) return;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    await write(orders);
  },

  async addNote(reference, body) {
    const orders = await read();
    const order = orders.find((o) => o.reference === reference);
    if (!order) return;
    order.notes.push({
      id: crypto.randomUUID(),
      body,
      createdAt: new Date().toISOString(),
    });
    order.updatedAt = new Date().toISOString();
    await write(orders);
  },
};
