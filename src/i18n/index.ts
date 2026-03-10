/**
 * Central export for i18n utilities
 * Note: getDictionary and Dictionary are not exported here to avoid bundling server-only code in client components
 * Import them directly from './get-dictionary' in Server Components only
 */

export { LOCALES, DEFAULT_LOCALE, isValidLocale, getValidLocale, LOCALE_TO_LANG } from './config';
export type { Locale } from './config';
export { useLocale } from './use-locale';
