import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  Cinzel,
  IBM_Plex_Sans_Arabic,
  Inter,
  Noto_Kufi_Arabic,
  Noto_Sans_Egyptian_Hieroglyphs,
} from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { dir, getDictionary, isLocale, locales } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { organizationLd } from '@/lib/structured-data';

/** Inscriptional Latin caps — the closest Google Fonts gets to Trajan. */
const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const kufi = Noto_Kufi_Arabic({
  variable: '--font-kufi',
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-plex-ar',
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

/** Real Unicode hieroglyphs (U+13000–U+1342F), not a picture font. */
const hieroglyph = Noto_Sans_Egyptian_Hieroglyphs({
  variable: '--font-hieroglyph',
  subsets: ['egyptian-hieroglyphs'],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MLA — Antiquities of the Nile',
    template: '%s · MLA',
  },
  description:
    'Egyptian statues, amulets and gifts made by hand in Egypt, delivered across the GCC with duties included. Prices in AED, SAR, QAR, OMR, BHD and KWD.',
  openGraph: {
    type: 'website',
    siteName: 'MLA',
    images: ['/products/bastet-cat-collection/1.jpg'],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${cinzel.variable} ${inter.variable} ${kufi.variable} ${plexArabic.variable} ${hieroglyph.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationLd(locale)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-lapis-800 focus:px-4 focus:py-2 focus:text-papyrus-50"
        >
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        {/* Counts visits without cookies and without profiling, which is why
            this site needs no consent banner. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
