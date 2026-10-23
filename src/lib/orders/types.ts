/** The statuses an order moves through, in the order they normally happen. */
export const ORDER_STATUSES = [
  'new',
  'in_progress',
  'done',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const isOrderStatus = (v: string): v is OrderStatus =>
  (ORDER_STATUSES as readonly string[]).includes(v);

export type StoredOrderLine = {
  slug: string;
  qty: number;
  name: string;
  unitUsd: number;
  totalUsd: number;
};

export type OrderNote = {
  id: string;
  body: string;
  createdAt: string;
};

export type StoredOrder = {
  reference: string;
  placedAt: string;
  updatedAt: string;
  locale: 'en' | 'ar';
  currency: string;
  status: OrderStatus;
  lines: StoredOrderLine[];
  subtotalUsd: number;
  vatUsd: number;
  totalUsd: number;
  notes: OrderNote[];
};

/**
 * Both stores implement this. Nothing above this interface knows whether the
 * orders are in Postgres or a JSON file.
 */
export type OrderStore = {
  kind: 'postgres' | 'file';
  init(): Promise<void>;
  save(order: StoredOrder): Promise<void>;
  list(): Promise<StoredOrder[]>;
  get(reference: string): Promise<StoredOrder | null>;
  setStatus(reference: string, status: OrderStatus): Promise<void>;
  addNote(reference: string, body: string): Promise<void>;
};
