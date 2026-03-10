# shadcn/ui

## Overview

[shadcn/ui](https://ui.shadcn.com/) is the component library used in this starter. Components are copied into the project (not installed as a dependency) and can be fully customized.

- **Style**: New York
- **Icon library**: Lucide React
- **Config file**: `components.json`
- **Components path**: `src/components/ui/`

## Installed Components (24)

| Component | File | Radix Dependency |
|-----------|------|------------------|
| Accordion | `accordion.tsx` | `@radix-ui/react-accordion` |
| Alert | `alert.tsx` | - |
| Avatar | `avatar.tsx` | `@radix-ui/react-avatar` |
| Badge | `badge.tsx` | - |
| Button | `button.tsx` | `@radix-ui/react-slot` |
| Card | `card.tsx` | - |
| Checkbox | `checkbox.tsx` | `@radix-ui/react-checkbox` |
| Dialog | `dialog.tsx` | `@radix-ui/react-dialog` |
| Dropdown Menu | `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` |
| Input | `input.tsx` | - |
| Label | `label.tsx` | `@radix-ui/react-label` |
| Popover | `popover.tsx` | `@radix-ui/react-popover` |
| Progress | `progress.tsx` | `@radix-ui/react-progress` |
| Radio Group | `radio-group.tsx` | `@radix-ui/react-radio-group` |
| Select | `select.tsx` | `@radix-ui/react-select` |
| Separator | `separator.tsx` | `@radix-ui/react-separator` |
| Sheet | `sheet.tsx` | `@radix-ui/react-dialog` |
| Skeleton | `skeleton.tsx` | - |
| Sonner (Toast) | `sonner.tsx` | `sonner` |
| Switch | `switch.tsx` | `@radix-ui/react-switch` |
| Table | `table.tsx` | - |
| Tabs | `tabs.tsx` | `@radix-ui/react-tabs` |
| Toggle | `toggle.tsx` | `@radix-ui/react-toggle` |
| Tooltip | `tooltip.tsx` | `@radix-ui/react-tooltip` |

## Adding a Component

```bash
pnpm dlx shadcn@latest add [component-name]
```

Example:

```bash
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add textarea
```

## Using a Component

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
};
```

## Customization

Components live in `src/components/ui/` and can be edited directly. They use CSS variables defined in `globals.css` for theming.

The `cn()` utility from `@/lib/utils` is used to merge Tailwind classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

## Registries

The `components.json` config includes two additional registries:

- **shadcnblocks**: `https://shadcnblocks.com/r/{name}.json`
- **Aceternity UI**: `https://ui.aceternity.com/registry/{name}.json`

## ESLint

The `src/components/ui/` directory is excluded from ESLint and Prettier to avoid reformatting generated components.
