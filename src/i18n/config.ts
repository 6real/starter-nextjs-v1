/**
 * i18n configuration for PrimeSportsFunded
 *
 * Defines supported locales and default locale
 */

export const LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * Maps short locales to full locale codes for lang attribute
 */
export const LOCALE_TO_LANG: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

/**
 * Validates if a given string is a supported locale
 *
 * @param locale - The locale string to validate
 * @returns True if the locale is supported, false otherwise
 */
export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Gets a valid locale from a string, falling back to default if invalid
 *
 * @param locale - The locale string to validate
 * @returns A valid Locale or the default locale
 */
export function getValidLocale(locale: string | undefined): Locale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}
