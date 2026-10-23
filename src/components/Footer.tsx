import Link from 'next/link';
import type { Locale } from '@/data/products';
import { collections } from '@/data/collections';
import type { Dictionary } from '@/lib/i18n';
import { ratesAsOf } from '@/lib/currency';
import { storeConfig, whatsappLink } from '@/lib/store-config';
import { Cartouche } from './Cartouche';
import { GlyphFrieze } from './Glyph';
import { WhatsAppIcon } from './Icons';

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-24 bg-lapis-900 text-papyrus-100">
      <div className="py-1.5 text-gold-400">
        <GlyphFrieze className="opacity-50" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Cartouche size="md" className="text-gold-400" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-papyrus-200/90">
            {dict.footer.tagline}
          </p>
          <p className="mt-3 text-sm text-gold-200/90">{dict.footer.madeIn}</p>
        </div>

        <nav aria-label={dict.footer.shop}>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-gold-400 uppercase">
            {dict.footer.shop}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${locale}/collections/${c.id}`}
                  className="cursor-pointer text-sm text-papyrus-100 transition-colors duration-200 hover:text-gold-300 hover:underline underline-offset-4"
                >
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.legal.heading}>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-gold-400 uppercase">
            {dict.legal.heading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: `/${locale}/faq`, label: dict.legal.faq },
              { href: `/${locale}/legal/returns`, label: dict.legal.returns },
              { href: `/${locale}/legal/terms`, label: dict.legal.terms },
              { href: `/${locale}/legal/privacy`, label: dict.legal.privacy },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="cursor-pointer transition-colors duration-200 hover:text-gold-300 hover:underline underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-gold-400 uppercase">
            {dict.footer.contact}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href={`/${locale}/story`}
                className="cursor-pointer transition-colors duration-200 hover:text-gold-300 hover:underline underline-offset-4"
              >
                {dict.nav.story}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/shipping`}
                className="cursor-pointer transition-colors duration-200 hover:text-gold-300 hover:underline underline-offset-4"
              >
                {dict.nav.shipping}
              </Link>
            </li>
            <li>
              <a
                href={whatsappLink(dict.cart.whatsappIntro)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-gold-300"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${storeConfig.email}`}
                className="cursor-pointer break-all transition-colors duration-200 hover:text-gold-300"
              >
                {storeConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-papyrus-100/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-papyrus-200/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {dict.brand}. {dict.footer.rights}
          </p>
          <p>{dict.vat.included}</p>
          <p>
            {dict.currency.note} {ratesAsOf}.
          </p>
        </div>
      </div>
    </footer>
  );
}
