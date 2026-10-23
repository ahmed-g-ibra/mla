import type { Metadata } from 'next';
import { currencyByCode, formatMoney } from '@/lib/currency';
import { adminIsConfigured, isSignedIn } from '@/lib/orders/auth';
import { getOrderStore } from '@/lib/orders/store';
import { ORDER_STATUSES } from '@/lib/orders/types';
import { logout } from './actions';
import { LoginForm } from './LoginForm';
import { OrderCard } from './OrderCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-ink-900">Orders</h1>
      <div className="register-rule mt-3 w-24" />
      {children}
    </main>
  );
}

function Setup({ missing }: { missing: string[] }) {
  return (
    <Shell>
      <p className="mt-6 text-ink-700">
        Not configured yet. Set these in your Vercel project, then redeploy:
      </p>
      <ul className="mt-4 space-y-3">
        {missing.map((m) => (
          <li
            key={m}
            className="rounded-sm border border-papyrus-300 bg-papyrus-100 p-3"
          >
            <code className="font-mono text-sm font-semibold text-lapis-800">
              {m}
            </code>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-500">
        Until then the shop takes orders exactly as before — they are simply
        not recorded. See ORDERS.md in the repository for the steps.
      </p>
    </Shell>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const store = getOrderStore();
  const missing: string[] = [];
  if (!store) missing.push('DATABASE_URL');
  if (!adminIsConfigured()) missing.push('ADMIN_PASSWORD (12+ characters)');
  if (missing.length) return <Setup missing={missing} />;

  if (!(await isSignedIn())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const { status } = await searchParams;
  const all = await store!.list();
  const shown = status && status !== 'all'
    ? all.filter((o) => o.status === status)
    : all;

  const open = all.filter((o) => o.status === 'new' || o.status === 'in_progress');
  const takings = all
    .filter((o) => o.status === 'done')
    .reduce((sum, o) => sum + o.totalUsd, 0);

  return (
    <Shell>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-ink-700">
          <strong className="text-ink-900">{all.length}</strong> recorded
        </span>
        <span className="text-ink-700">
          <strong className="text-ink-900">{open.length}</strong> open
        </span>
        <span className="text-ink-700">
          completed:{' '}
          <strong className="tabular-nums text-ink-900">
            {formatMoney(takings, currencyByCode('OMR'), 'en')}
          </strong>
        </span>
        <form action={logout} className="ms-auto">
          <button
            type="submit"
            className="min-h-9 cursor-pointer text-sm font-medium text-ink-500 underline underline-offset-4 hover:text-carnelian-600"
          >
            Sign out
          </button>
        </form>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filter by status">
        {['all', ...ORDER_STATUSES].map((s) => (
          <a
            key={s}
            href={s === 'all' ? '/admin' : `/admin?status=${s}`}
            className={`min-h-9 cursor-pointer rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              (status ?? 'all') === s
                ? 'border-lapis-700 bg-lapis-800 text-papyrus-50'
                : 'border-papyrus-300 text-ink-700 hover:border-lapis-500'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </a>
        ))}
      </nav>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-ink-500">
          {all.length === 0
            ? 'No orders recorded yet. The next one through checkout will appear here.'
            : 'No orders with that status.'}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {shown.map((o) => (
            <OrderCard key={o.reference} order={o} />
          ))}
        </div>
      )}
    </Shell>
  );
}
