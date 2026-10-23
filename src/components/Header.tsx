'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/data/products';
import type { Dictionary } from '@/lib/i18n';
import { Cartouche } from './Cartouche';
import { CartCount } from './CartCount';
import { CurrencySwitch } from './CurrencySwitch';
import { GlyphFrieze } from './Glyph';
import { CloseIcon, MenuIcon } from './Icons';
import { LocaleSwitch } from './LocaleSwitch';

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A route change should never leave the mobile panel hanging open. Adjusting
  // during render rather than in an effect avoids a frame with the stale panel.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: `/${locale}/collections`, label: dict.nav.collections },
    { href: `/${locale}/collections?sort=featured`, label: dict.nav.bestsellers },
    { href: `/${locale}/story`, label: dict.nav.story },
    { href: `/${locale}/shipping`, label: dict.nav.shipping },
  ];

  const isActive = (href: string) =>
    pathname === href.split('?')[0] ||
    (href.endsWith('/collections') && pathname?.startsWith(`/${locale}/collections`));

  return (
    <header className="sticky top-0 z-40 border-b border-papyrus-300 bg-papyrus-50/95 backdrop-blur-sm">
      <div className="bg-lapis-900 py-1 text-gold-400">
        <GlyphFrieze className="opacity-60" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 cursor-pointer items-center gap-3 rounded-sm py-1 text-lapis-900 transition-opacity duration-200 hover:opacity-80"
        >
          <Cartouche size="sm" className="text-gold-600" />
          <span className="hidden text-xs leading-tight font-medium tracking-wide text-ink-500 uppercase xl:block">
            {dict.brandLine}
          </span>
        </Link>

        <nav
          aria-label={dict.nav.menu}
          className="ms-auto hidden items-center gap-1 lg:flex"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm font-medium transition-colors duration-200 hover:bg-papyrus-200 hover:text-lapis-700 ${
                isActive(l.href)
                  ? 'text-lapis-800 underline decoration-gold-500 decoration-2 underline-offset-[7px]'
                  : 'text-ink-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-0.5 lg:ms-2">
          <div className="hidden sm:block">
            <CurrencySwitch locale={locale} label={dict.currency.label} />
          </div>
          <div className="hidden sm:block">
            <LocaleSwitch locale={locale} label={dict.locale.label} />
          </div>
          <CartCount locale={locale} label={dict.nav.cart} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-ink-700 transition-colors duration-200 hover:bg-papyrus-200 lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-papyrus-300 bg-papyrus-50 lg:hidden"
        >
          <nav aria-label={dict.nav.menu} className="flex flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="flex min-h-12 cursor-pointer items-center border-b border-papyrus-200 text-[0.95rem] font-medium text-ink-800 transition-colors duration-200 hover:text-lapis-700"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-2 py-2 sm:hidden">
              <CurrencySwitch locale={locale} label={dict.currency.label} />
              <LocaleSwitch locale={locale} label={dict.locale.label} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
