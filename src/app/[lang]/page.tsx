import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(getValidLocale(lang));
  return {
    title: dict.meta.home.metaTitle,
    description: dict.meta.home.metaDescription,
  };
}

const Home = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;
  const dict = await getDictionary(getValidLocale(lang));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="secondary">Next.js 15 + Tailwind CSS 4 + shadcn/ui</Badge>
        <h1 className="text-4xl font-bold tracking-tight">{dict.home.title}</h1>
        <p className="max-w-md text-muted-foreground">{dict.home.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>i18n</CardTitle>
            <CardDescription>Multi-language support built-in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/fr">FR</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/en">EN</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui</CardTitle>
            <CardDescription>20+ components ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Button</Badge>
              <Badge variant="secondary">Card</Badge>
              <Badge variant="outline">Dialog</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Home;
