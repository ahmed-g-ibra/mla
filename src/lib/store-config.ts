/**
 * Everything about the business that is not a product.
 *
 * MLA is being set up as an Omani seller shipping across the GCC. Oman applies
 * 5% VAT and requires consumer-facing prices to be shown VAT-inclusive, so the
 * figures in the catalogue are treated as gross throughout and the tax is
 * broken out for information only.
 *
 * Anything marked PLACEHOLDER must be replaced before taking a single order.
 * `launchBlockers` below is read by the pre-launch check in the footer, so the
 * site tells on itself rather than quietly shipping half-configured.
 */
export const storeConfig = {
  legalName: 'PLACEHOLDER — registered company name',
  tradingName: 'MLA',
  country: 'OM',
  /** Commercial registration from MOCIIP. */
  crNumber: 'PLACEHOLDER — CR number',
  /** Oman Tax Authority VAT identification number. */
  vatNumber: 'PLACEHOLDER — VAT number',
  address: {
    en: 'PLACEHOLDER — street, Muscat, Sultanate of Oman',
    ar: 'PLACEHOLDER — الشارع، مسقط، سلطنة عُمان',
  },
  /** Digits only, full international format, no '+' and no spaces. */
  whatsappNumber: '971500000000',
  email: 'orders@mla-antiquities.com',
  instagram: 'mla.antiquities',
  /** Oman VAT, applied to goods sold domestically. */
  vatRate: 0.05,
  supportHours: {
    en: 'Sunday to Thursday, 9am–6pm Gulf Standard Time',
    ar: 'من الأحد إلى الخميس، ٩ صباحًا – ٦ مساءً بتوقيت الخليج',
  },
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

/**
 * True while the contact details are still the shipped placeholders.
 * Structured data is suppressed while this holds — publishing a made-up phone
 * number into search results is worse than publishing none.
 */
export const contactIsPlaceholder =
  storeConfig.whatsappNumber === '971500000000';

const isPlaceholder = (v: string) => v.startsWith('PLACEHOLDER');

/**
 * What still stands between this site and a legal first sale. Each entry is
 * something only the owner can resolve.
 */
export const launchBlockers = (): string[] => {
  const blockers: string[] = [];
  if (contactIsPlaceholder)
    blockers.push('WhatsApp number and email are still placeholders');
  if (isPlaceholder(storeConfig.legalName))
    blockers.push('Registered company name is not set');
  if (isPlaceholder(storeConfig.crNumber))
    blockers.push('Commercial registration (CR) number is not set');
  if (isPlaceholder(storeConfig.vatNumber))
    blockers.push('Oman VAT number is not set');
  if (isPlaceholder(storeConfig.address.en))
    blockers.push('Registered address is not set');
  blockers.push(
    'Product photographs are the source stores’ property and must be replaced',
  );
  blockers.push('Prices are scraped competitor prices, not a costed model');
  return blockers;
};

export const isPreLaunch = () => launchBlockers().length > 0;
