/**
 * MLA prices are held in USD and converted at display time.
 *
 * Five of the six GCC currencies are hard-pegged to the dollar by their central
 * banks, so these rates are exact and do not drift. KWD is pegged to an
 * undisclosed basket and moves by small amounts — refresh it (and `ratesAsOf`)
 * when it does. There is no FX API call anywhere in the site.
 */
export const ratesAsOf = '2026-10-23';

export type CurrencyCode =
  | 'AED'
  | 'SAR'
  | 'QAR'
  | 'OMR'
  | 'BHD'
  | 'KWD'
  | 'USD';

export type Currency = {
  code: CurrencyCode;
  /** Units of this currency per 1 USD. */
  perUsd: number;
  decimals: number;
  pegged: boolean;
  symbol: Record<'en' | 'ar', string>;
  name: Record<'en' | 'ar', string>;
  country: Record<'en' | 'ar', string>;
};

export const currencies: Currency[] = [
  {
    code: 'AED',
    perUsd: 3.6725,
    decimals: 2,
    pegged: true,
    symbol: { en: 'AED', ar: 'د.إ' },
    name: { en: 'UAE Dirham', ar: 'درهم إماراتي' },
    country: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  },
  {
    code: 'SAR',
    perUsd: 3.75,
    decimals: 2,
    pegged: true,
    symbol: { en: 'SAR', ar: 'ر.س' },
    name: { en: 'Saudi Riyal', ar: 'ريال سعودي' },
    country: { en: 'Saudi Arabia', ar: 'السعودية' },
  },
  {
    code: 'QAR',
    perUsd: 3.64,
    decimals: 2,
    pegged: true,
    symbol: { en: 'QAR', ar: 'ر.ق' },
    name: { en: 'Qatari Riyal', ar: 'ريال قطري' },
    country: { en: 'Qatar', ar: 'قطر' },
  },
  {
    code: 'OMR',
    perUsd: 0.3845,
    decimals: 3,
    pegged: true,
    symbol: { en: 'OMR', ar: 'ر.ع' },
    name: { en: 'Omani Rial', ar: 'ريال عُماني' },
    country: { en: 'Oman', ar: 'عُمان' },
  },
  {
    code: 'BHD',
    perUsd: 0.376,
    decimals: 3,
    pegged: true,
    symbol: { en: 'BHD', ar: 'د.ب' },
    name: { en: 'Bahraini Dinar', ar: 'دينار بحريني' },
    country: { en: 'Bahrain', ar: 'البحرين' },
  },
  {
    code: 'KWD',
    perUsd: 0.3065,
    decimals: 3,
    pegged: false,
    symbol: { en: 'KWD', ar: 'د.ك' },
    name: { en: 'Kuwaiti Dinar', ar: 'دينار كويتي' },
    country: { en: 'Kuwait', ar: 'الكويت' },
  },
  {
    code: 'USD',
    perUsd: 1,
    decimals: 2,
    pegged: true,
    symbol: { en: '$', ar: '$' },
    name: { en: 'US Dollar', ar: 'دولار أمريكي' },
    country: { en: 'International', ar: 'دولي' },
  },
];

export const defaultCurrency: CurrencyCode = 'AED';

export const currencyByCode = (code: string): Currency =>
  currencies.find((c) => c.code === code) ??
  currencies.find((c) => c.code === defaultCurrency)!;

/** ISO-3166 alpha-2 of each GCC state to its own currency. */
const countryToCurrency: Record<string, CurrencyCode> = {
  AE: 'AED',
  SA: 'SAR',
  QA: 'QAR',
  OM: 'OMR',
  BH: 'BHD',
  KW: 'KWD',
};

export const currencyForCountry = (country?: string | null): CurrencyCode =>
  (country && countryToCurrency[country.toUpperCase()]) || defaultCurrency;

export const convert = (usd: number, currency: Currency): number =>
  usd * currency.perUsd;

/**
 * Arabic keeps Western digits here on purpose: GCC price tags and bank
 * statements overwhelmingly use them, and Eastern Arabic numerals read as
 * decorative rather than commercial.
 */
export const formatMoney = (
  usd: number,
  currency: Currency,
  locale: 'en' | 'ar',
): string => {
  const value = convert(usd, currency);
  const digits = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(value);
  return locale === 'ar'
    ? `${digits} ${currency.symbol.ar}`
    : `${currency.symbol.en} ${digits}`;
};

/**
 * First-visit guess at the right currency from the browser's own time zone.
 * No geo-IP service and no network call — which also keeps every page static.
 */
const zoneToCurrency: Record<string, CurrencyCode> = {
  'Asia/Dubai': 'AED',
  'Asia/Riyadh': 'SAR',
  'Asia/Qatar': 'QAR',
  'Asia/Muscat': 'OMR',
  'Asia/Bahrain': 'BHD',
  'Asia/Kuwait': 'KWD',
};

export const guessCurrency = (): CurrencyCode => {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return zoneToCurrency[zone] ?? defaultCurrency;
  } catch {
    return defaultCurrency;
  }
};
