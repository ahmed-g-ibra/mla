'use client';

import { useActionState } from 'react';
import { login } from './actions';

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="mx-auto mt-10 max-w-sm">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-ink-700"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 h-12 w-full rounded-sm border border-papyrus-300 bg-papyrus-50 px-3 text-ink-900 focus:border-lapis-600"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-carnelian-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-lapis-800 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900 disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  );
}
