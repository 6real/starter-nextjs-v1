# Next.js Starter

A minimal Next.js 16 starter template with i18n, Tailwind CSS 4, and shadcn/ui.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **React**: 19.2
- **TypeScript**: 5.x (strict mode)
- **UI**: shadcn/ui (24 components)
- **Styling**: Tailwind CSS 4
- **Forms**: react-hook-form + zod
- **i18n**: Custom dictionary-based system (fr/en)

## Project Structure

```
src/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx        # Root layout with DictionaryProvider
│   │   └── page.tsx          # Homepage
│   ├── globals.css           # Tailwind theme + CSS variables
│   └── favicon.ico
├── components/ui/            # shadcn/ui components
├── i18n/                     # i18n system
│   ├── config.ts             # Supported locales
│   ├── get-dictionary.ts     # Server-side dictionary loader
│   ├── dictionary-provider.tsx # Client-side dictionary context
│   ├── use-locale.ts         # Client hook to get current locale
│   └── dictionaries/         # Translation JSON files (fr.json, en.json)
├── lib/
│   └── utils.ts              # cn() utility
└── proxy.ts                  # Locale detection + redirect (Next.js 16 proxy)
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to `/{locale}/` based on your browser language.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack by default) |
| `pnpm build` | Production build (Turbopack by default) |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm type-check` | TypeScript type check |
| `pnpm format` | Format with Prettier |
| `pnpm clean` | Format + lint + type-check |

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

## i18n

Add translations in `src/i18n/dictionaries/fr.json` and `en.json`. Access them in Server Components via `getDictionary()` or in Client Components via the `useDictionary()` hook.

To add a new locale, update `LOCALES` in `src/i18n/config.ts` and create the corresponding dictionary file.
