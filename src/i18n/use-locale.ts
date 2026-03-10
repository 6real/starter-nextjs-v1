'use client';

import { usePathname } from 'next/navigation';

import { DEFAULT_LOCALE, isValidLocale } from './config';

import type { Locale } from './config';

export function useLocale(): Locale {
  const pathname = usePathname();

  // Handle Storybook or environments where pathname might be null
  if (!pathname) {
    return DEFAULT_LOCALE;
  }

  // Extract the first segment of the pathname
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return DEFAULT_LOCALE;
}
