# Order recording and the admin page

Orders are recorded at checkout and managed at `/admin`. Until you set the two
environment variables below, the shop behaves exactly as it did before —
orders still reach you on WhatsApp, they are simply not written down, and
`/admin` tells you what is missing instead of erroring.

## Setting it up

### 1. A database

Any Postgres works — they all speak the same connection string. In the Vercel
dashboard, **Storage → Create Database → Postgres** is the shortest path, and
it sets `DATABASE_URL` for you. [Neon](https://neon.tech) and
[Supabase](https://supabase.com) have free tiers and work identically; copy
their connection string into `DATABASE_URL` yourself.

There is no migration step. The table is created the first time an order
arrives.

### 2. A password

In **Vercel → Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | Something long. Twelve characters minimum, or the admin page stays locked. |
| `DATABASE_URL` | Set for you by Vercel Postgres; paste it yourself for Neon or Supabase. |

Redeploy after adding them — environment variables are read at build.

### 3. Check it

Visit `/admin`, sign in, and place a test order. It should appear immediately.

## Using it

Each order shows its reference, when it arrived, which language the customer
was reading, every line with quantities, the total and the VAT inside it.

- **Status** — New, In progress, Done, Cancelled. One click.
- **Notes** — anything you want to remember: a delivery date, what the
  customer asked for, why it was cancelled.
- **Filter** — by status, across the top.
- **Summary** — how many are recorded, how many still open, and the total of
  everything marked Done.

## How it works

- Checkout posts the order to `/api/orders` and opens WhatsApp at the same
  time. The request uses `keepalive` so it survives the page navigating, and a
  failure is swallowed — bookkeeping must never cost a sale.
- **Only slugs and quantities are accepted.** Names, prices, tax and totals
  are recomputed from the catalogue on the server. A posted price is a number
  a stranger chose, and this figure ends up in your books.
- A repeated reference is ignored rather than overwritten, so a customer
  tapping checkout twice cannot wipe a status or a note.
- Access is one shared password in an environment variable, held in a signed,
  httpOnly cookie for twelve hours. There are no accounts and no roles. If
  anyone else ever needs access, replace this rather than sharing it.

## Running locally

Without `DATABASE_URL`, development falls back to a JSON file at
`.orders/orders.json` (gitignored). It is refused in production, because a
serverless filesystem is ephemeral and an order written there would vanish
silently.

```bash
ADMIN_PASSWORD=some-long-password npm run dev
```

## When you outgrow it

This is a record, not an ERP. When bookkeeping takes longer than running the
shop, push these orders into Zoho Books or Odoo — both are strong in the GCC
and VAT-aware. Keep one source of truth: the site records, the ERP reads.
Push on confirmation rather than syncing both ways.
