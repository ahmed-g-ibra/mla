import { currencyByCode, formatMoney } from '@/lib/currency';
import { ORDER_STATUSES, type StoredOrder } from '@/lib/orders/types';
import { addNote, updateStatus } from './actions';

const LABEL: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  done: 'Done',
  cancelled: 'Cancelled',
};

const CHIP: Record<string, string> = {
  new: 'bg-lapis-800 text-papyrus-50',
  in_progress: 'bg-gold-500 text-ink-900',
  done: 'bg-malachite-600 text-papyrus-50',
  cancelled: 'bg-papyrus-300 text-ink-700',
};

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export function OrderCard({ order }: { order: StoredOrder }) {
  const currency = currencyByCode(order.currency);
  const money = (usd: number) => formatMoney(usd, currency, 'en');

  return (
    <article className="rounded-sm border border-papyrus-300 bg-papyrus-50">
      <header className="flex flex-wrap items-center gap-3 border-b border-papyrus-300 p-4">
        <span
          className={`rounded-xs px-2 py-1 text-xs font-semibold uppercase ${CHIP[order.status]}`}
        >
          {LABEL[order.status]}
        </span>
        <h2 className="font-mono text-lg font-semibold text-ink-900">
          {order.reference}
        </h2>
        <span className="text-sm text-ink-500">{when(order.placedAt)}</span>
        <span className="text-sm text-ink-500">
          {order.locale === 'ar' ? 'Arabic' : 'English'}
        </span>
        <span className="ms-auto text-lg font-semibold tabular-nums text-ink-900">
          {money(order.totalUsd)}
        </span>
      </header>

      <div className="p-4">
        <ul className="space-y-1 text-sm">
          {order.lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-4">
              <span className="text-ink-700">
                {l.name} × {l.qty}
              </span>
              <span className="shrink-0 tabular-nums text-ink-900">
                {money(l.totalUsd)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-500 tabular-nums">
          of which VAT {money(order.vatUsd)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <form key={s} action={updateStatus}>
              <input type="hidden" name="reference" value={order.reference} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                disabled={s === order.status}
                className="min-h-9 cursor-pointer rounded-sm border border-papyrus-400 px-3 text-sm font-medium text-ink-700 transition-colors duration-200 hover:border-lapis-600 hover:text-lapis-700 disabled:cursor-default disabled:border-papyrus-300 disabled:text-ink-400"
              >
                {LABEL[s]}
              </button>
            </form>
          ))}
        </div>

        {order.notes.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-papyrus-300 pt-3">
            {order.notes.map((n) => (
              <li key={n.id} className="text-sm">
                <span className="text-ink-400">{when(n.createdAt)}</span>
                <p className="text-ink-700">{n.body}</p>
              </li>
            ))}
          </ul>
        )}

        <form action={addNote} className="mt-3 flex gap-2">
          <input type="hidden" name="reference" value={order.reference} />
          <input
            name="note"
            placeholder="Add a note…"
            maxLength={1000}
            aria-label={`Add a note to ${order.reference}`}
            className="h-10 min-w-0 flex-1 rounded-sm border border-papyrus-300 bg-white px-3 text-sm text-ink-900 focus:border-lapis-600"
          />
          <button
            type="submit"
            className="min-h-10 cursor-pointer rounded-sm bg-lapis-800 px-4 text-sm font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
          >
            Add
          </button>
        </form>
      </div>
    </article>
  );
}
