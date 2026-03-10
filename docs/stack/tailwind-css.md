# Tailwind CSS 4

## Overview

This starter uses [Tailwind CSS v4](https://tailwindcss.com/) with the PostCSS plugin. No `tailwind.config.ts` file is needed - configuration is done entirely in CSS.

## Configuration

### PostCSS

```js
// postcss.config.mjs
const config = {
  plugins: { "@tailwindcss/postcss": {} },
};
export default config;
```

### CSS Entry Point

All theme configuration is in `src/app/globals.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@plugin "@tailwindcss/typography";
```

## Theme

### CSS Variables

Colors and design tokens are defined as CSS custom properties in `:root` and mapped to Tailwind via `@theme inline`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.986 0 0);
  /* ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... */
}
```

### Available Color Tokens

| Token | Usage |
|-------|-------|
| `background` / `foreground` | Page background and text |
| `card` / `card-foreground` | Card surfaces |
| `primary` / `primary-foreground` | Primary actions |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subdued elements |
| `accent` / `accent-foreground` | Highlighted elements |
| `destructive` | Destructive actions |
| `warning` | Warning states |
| `border` | Border color |
| `input` | Input borders |
| `ring` | Focus rings |
| `chart-1` to `chart-5` | Chart colors |

### Radius

```css
--radius: 0.65rem;
/* Generates: radius-xs, radius-sm, radius-md, radius-lg, radius-xl */
```

### Shadows

Pre-defined shadow scale: `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`.

## Usage

### Utility `cn()`

Always use `cn()` from `@/lib/utils` to merge classes conditionally:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'px-4 py-2 rounded-md',
  isActive && 'bg-primary text-primary-foreground',
  className
)} />
```

### Class Variance Authority (CVA)

Use CVA for components with multiple variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('inline-flex items-center rounded-md font-medium', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-input bg-background',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});
```

### Container

A custom `container` utility is defined:

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

## Plugins

- **`@tailwindcss/typography`**: Prose styling for rich text content
- **`tw-animate-css`**: Animation utilities for shadcn/ui components

## Animations

Pre-defined animations available via `animate-*` classes:

- `accordion-down` / `accordion-up` - For Radix accordion
- `fade-in` - Fade in with translateY
- `slide-down` / `slide-up` - For collapsible content

## Prettier Integration

Tailwind class sorting is handled by `prettier-plugin-tailwindcss`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "cva"]
}
```
