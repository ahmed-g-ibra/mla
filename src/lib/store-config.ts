/**
 * The only file you need to edit to point the storefront at a real business.
 * Everything customer-facing that is not a product reads from here.
 */
export const storeConfig = {
  /** Digits only, full international format, no '+' and no spaces. */
  whatsappNumber: '971500000000',
  email: 'orders@mla-antiquities.com',
  instagram: 'mla.antiquities',
  /** Shown in the footer and used for the Open Graph locale. */
  baseCountry: 'AE',
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

/**
 * True while the contact details above are still the shipped placeholders.
 * Structured data is suppressed while this holds — publishing a made-up phone
 * number into search results is worse than publishing none.
 */
export const contactIsPlaceholder =
  storeConfig.whatsappNumber === '971500000000';
