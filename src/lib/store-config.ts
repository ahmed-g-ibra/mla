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
  whatsappNumber: '96877170373',
  email: 'PLACEHOLDER — orders@yourdomain.com',
  instagram: 'PLACEHOLDER — instagram handle',
  /** Oman VAT, applied to goods sold domestically. */
  vatRate: 0.05,
  supportHours: {
    en: 'Sunday to Thursday, 9am–6pm Gulf Standard Time',
    ar: 'من الأحد إلى الخميس، ٩ صباحًا – ٦ مساءً بتوقيت الخليج',
  },
} as const;

/**
 * api.whatsapp.com/send rather than wa.me.
 *
 * Both are Meta's own endpoints and both deep-link into the app, but wa.me
 * leans on a redirect that in-app browsers — Instagram's and Facebook's, which
 * is where a good share of Gulf traffic arrives from — handle unreliably.
 * api.whatsapp.com/send takes the number and the text as plain query
 * parameters and hands off more predictably.
 */
export const whatsappLink = (message: string) =>
  `https://api.whatsapp.com/send?phone=${storeConfig.whatsappNumber}` +
  `&text=${encodeURIComponent(message)}`;

const isPlaceholder = (v: string) => v.startsWith('PLACEHOLDER');

/**
 * Each contact channel is judged on its own.
 *
 * These gate both what is shown on the page and what goes into structured
 * data. A channel that is still a placeholder is simply absent — publishing a
 * dead address is worse than publishing nothing, and a visitor who emails a
 * domain nobody owns just thinks they were ignored.
 */
export const hasWhatsApp = !isPlaceholder(storeConfig.whatsappNumber);
export const hasEmail = !isPlaceholder(storeConfig.email);
export const hasInstagram = !isPlaceholder(storeConfig.instagram);

/** +968 7717 0373 — grouped the way an Omani number is normally read. */
export const whatsappDisplay = () => {
  const n = storeConfig.whatsappNumber;
  if (!hasWhatsApp) return '';
  if (n.startsWith('968') && n.length === 11) {
    return `+968 ${n.slice(3, 7)} ${n.slice(7)}`;
  }
  return `+${n}`;
};

/**
 * What still stands between this site and a legal first sale. Each entry is
 * something only the owner can resolve.
 */
export const launchBlockers = (): string[] => {
  const blockers: string[] = [];
  if (!hasWhatsApp) blockers.push('WhatsApp number is still a placeholder');
  if (!hasEmail) blockers.push('Contact email is still a placeholder');
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
