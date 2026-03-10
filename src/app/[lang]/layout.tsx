import { Toaster } from '@/components/ui/sonner';
import { getValidLocale, LOCALE_TO_LANG, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { DictionaryProvider } from '@/i18n/dictionary-provider';
import { getDictionary } from '@/i18n/get-dictionary';

import type { Metadata } from 'next';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Starter Next.js',
  description: 'A simple Next.js starter with i18n, Tailwind CSS and shadcn/ui',
};

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) => {
  const { lang } = await params;
  const validLang: Locale = getValidLocale(lang);
  const dict = await getDictionary(validLang);
  const htmlLang = LOCALE_TO_LANG[validLang];

  return (
    <html lang={htmlLang}>
      <body className="antialiased">
        <DictionaryProvider dict={dict}>
          {children}
          <Toaster />
        </DictionaryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
