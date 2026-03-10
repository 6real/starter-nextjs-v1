import 'server-only';

import type { Locale } from './config';

const dictionaries = {
  fr: () => import('./dictionaries/fr.json').then(m => m.default),
  en: () => import('./dictionaries/en.json').then(m => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['fr']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale];
  if (!loader) {
    throw new Error(`No dictionary found for locale: ${locale}`);
  }
  return loader();
}
