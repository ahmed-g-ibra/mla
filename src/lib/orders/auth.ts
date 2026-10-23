import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'mla_admin';
const MAX_AGE = 60 * 60 * 12; // half a day; this is a shop, not a bank

/**
 * A single shared password, held in an environment variable.
 *
 * Appropriate for one owner looking at their own orders, and no more than
 * that: there are no roles, no accounts and no reset flow. If anyone else ever
 * needs access, replace this rather than adding a second password to it.
 */
const secret = () => process.env.ADMIN_PASSWORD ?? '';

export const adminIsConfigured = () => secret().length >= 12;

const sign = (value: string) =>
  createHmac('sha256', secret()).update(value).digest('hex');

const equal = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Compares in constant time, so a wrong password leaks nothing by timing. */
export const passwordMatches = (attempt: string) =>
  adminIsConfigured() && equal(attempt, secret());

export async function signIn() {
  const issued = String(Date.now());
  const jar = await cookies();
  jar.set(COOKIE, `${issued}.${sign(issued)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}

export async function isSignedIn(): Promise<boolean> {
  if (!adminIsConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;

  const [issued, signature] = raw.split('.');
  if (!issued || !signature) return false;
  if (!equal(signature, sign(issued))) return false;

  const age = (Date.now() - Number(issued)) / 1000;
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE;
}
