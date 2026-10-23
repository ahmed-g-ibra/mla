'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  currencyByCode,
  defaultCurrency,
  guessCurrency,
  type Currency,
  type CurrencyCode,
} from './currency';

export type CartLine = { slug: string; qty: number };

type State = {
  code: CurrencyCode;
  lines: CartLine[];
  /** False until localStorage has been read, so SSR and first paint agree. */
  ready: boolean;
};

const CART_KEY = 'mla.cart.v1';
const CURRENCY_KEY = 'mla.currency.v1';

/**
 * Cart and currency live in a module-level store rather than React state.
 * The server cannot see localStorage, so the first render has to be the
 * neutral snapshot below; `subscribe` then hydrates from storage before React
 * re-reads it. Keeping it outside React also means a `storage` event from
 * another tab updates this one for free.
 */
const SERVER_SNAPSHOT: State = {
  code: defaultCurrency,
  lines: [],
  ready: false,
};

let state: State = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

const emit = () => {
  for (const l of listeners) l();
};

const readStorage = (): State => {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    const rawCurrency = localStorage.getItem(CURRENCY_KEY);
    const lines: CartLine[] = rawCart ? JSON.parse(rawCart) : [];
    return {
      code: (rawCurrency as CurrencyCode | null) ?? guessCurrency(),
      lines: Array.isArray(lines) ? lines : [],
      ready: true,
    };
  } catch {
    // Private mode, a full quota or a blocked origin: carry on without it.
    return { ...SERVER_SNAPSHOT, ready: true };
  }
};

const hydrateOnce = () => {
  if (hydrated) return;
  hydrated = true;
  state = readStorage();
};

const persist = () => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.lines));
    localStorage.setItem(CURRENCY_KEY, state.code);
  } catch {}
};

const update = (next: Partial<State>) => {
  state = { ...state, ...next };
  persist();
  emit();
};

const subscribe = (onChange: () => void) => {
  hydrateOnce();
  listeners.add(onChange);

  // Another tab changed the cart — reflect it here.
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY || e.key === CURRENCY_KEY) {
      state = readStorage();
      emit();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
};

const getSnapshot = () => state;
const getServerSnapshot = () => SERVER_SNAPSHOT;

const MAX_QTY = 99;

export type ShopState = {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  lines: CartLine[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  ready: boolean;
};

export function useShop(): ShopState {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setCurrency = useCallback(
    (code: CurrencyCode) => update({ code }),
    [],
  );

  const add = useCallback((slug: string, qty = 1) => {
    const found = state.lines.find((l) => l.slug === slug);
    update({
      lines: found
        ? state.lines.map((l) =>
            l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l,
          )
        : [...state.lines, { slug, qty }],
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    update({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.slug !== slug)
          : state.lines.map((l) =>
              l.slug === slug ? { ...l, qty: Math.min(qty, MAX_QTY) } : l,
            ),
    });
  }, []);

  const remove = useCallback(
    (slug: string) =>
      update({ lines: state.lines.filter((l) => l.slug !== slug) }),
    [],
  );

  const clear = useCallback(() => update({ lines: [] }), []);

  return {
    currency: currencyByCode(snapshot.code),
    setCurrency,
    lines: snapshot.lines,
    add,
    setQty,
    remove,
    clear,
    count: snapshot.lines.reduce((n, l) => n + l.qty, 0),
    ready: snapshot.ready,
  };
}
