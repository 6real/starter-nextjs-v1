# Next.js Starter - Development Guidelines

> Minimal Next.js 16 starter with i18n, Tailwind CSS 4, and shadcn/ui

## Documentation

Detailed stack documentation is available in `docs/stack/`:

- [`shadcn-ui.md`](../docs/stack/shadcn-ui.md) - Components list, usage, customization
- [`tailwind-css.md`](../docs/stack/tailwind-css.md) - Theme, CSS variables, utilities
- [`forms.md`](../docs/stack/forms.md) - react-hook-form + zod patterns
- [`i18n.md`](../docs/stack/i18n.md) - Translation system, routing, adding locales

---

## Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **TypeScript**: 5.x (strict mode)
- **UI**: shadcn/ui + shadcnblocks
- **Styling**: Tailwind CSS 4
- **Forms**: react-hook-form + zod

## TypeScript

### Strict Rules

#### 1. No `as` (type assertions)

```typescript
// BAD
const user = data as User;

// GOOD - Use validation
import { z } from 'zod';
const UserSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof UserSchema>;
const user = UserSchema.parse(data);
```

```typescript
// BAD
const element = document.getElementById('app') as HTMLElement;

// GOOD - Handle null
const element = document.getElementById('app');
if (!element) {
  throw new Error('Element not found');
}
```

#### 2. No `any`

```typescript
// BAD
function processData(data: any) { return data.value; }

// GOOD
function processData<T extends { value: string }>(data: T): string {
  return data.value;
}
```

#### 3. No lying to TypeScript

```typescript
// BAD
// @ts-ignore
const result = dangerousOperation();
const user = users.find(u => u.id === id)!;

// GOOD
const user = users.find(u => u.id === id);
if (!user) {
  throw new Error(`User ${id} not found`);
}
```

### Best Practices

- Use utility types: `Pick`, `Omit`, `Partial`, `Required`, `Record`
- Use discriminated unions for state management
- Use `as const` for literal values
- Use type guards instead of `as` for type narrowing

---

## Component Architecture

### Atomic Design Structure

```
src/lib/
├── atoms/           # Basic components (custom wrappers)
├── molecules/       # Combinations of atoms (FormField, SearchBar)
├── organisms/       # Complex sections (Header, Sidebar)
├── templates/       # Page layouts
└── hooks/           # Custom hooks
```

### Naming Conventions

- **Components**: `PascalCase.tsx` (e.g. `ChallengeCard.tsx`)
- **Services/Utils**: `kebab-case.ts` (e.g. `challenge-card.service.ts`)
- **Types**: `kebab-case.ts` (e.g. `challenge-card.types.ts`)
- **Folders**: always `kebab-case`

### Component Folder Structure

```
src/lib/organisms/my-component/
├── MyComponent.tsx             # Main component
├── my-component.service.ts     # Business logic (optional)
├── my-component.types.ts       # Types (optional)
└── my-component.constants.ts   # Constants (optional)
```

### shadcn/ui & shadcnblocks

Components from shadcnblocks must be refactored before use:
1. Apply Atomic Design structure
2. Split into smaller components
3. Add strict typing
4. Extract logic into services/hooks

---

## Component Creation Guide

### Checklist Before Creating

1. **Molecule or Organism?**
   - Molecule: reusable across the project
   - Organism: specific to a feature
2. **Can it be decomposed?** If > 150 lines, split into sub-components
3. **Is there duplicate code?** Extract into reusable molecules (DRY)
4. **Is business logic separated?** Use `.service.ts`

### Molecule vs Organism

**Create a Molecule when:**
- Combines several atoms (Label + Input + Error)
- Reusable in multiple contexts
- No specific business logic
- Generic, flexible props

**Create an Organism when:**
- Specific to a feature
- Combines molecules and organisms
- Contains business logic
- Over 100 lines: split into sub-components

### Quality Checklist

- [ ] Folder: kebab-case
- [ ] Component file: PascalCase.tsx
- [ ] No `any`, `as`, `@ts-ignore`
- [ ] Type guards used for type conversions
- [ ] Dictionary type imported from `@/i18n/get-dictionary`
- [ ] Business logic in `.service.ts`
- [ ] Max 150 lines per file
- [ ] `useCallback` and `useMemo` used correctly
- [ ] `export default` for single component files
- [ ] Arrow function components (`const X = () => {}`)
- [ ] `pnpm lint` passes
- [ ] `pnpm type-check` passes
- [ ] i18n: all strings translated via `dict`
- [ ] Next.js: `<Link>` and `<Image>` used (not native elements)

---

## React Best Practices

### Always Use Next.js Components

Use `<Link>` and `<Image>` from Next.js instead of native HTML elements.

### i18n

Always use the dictionary and i18n translations for user-facing strings. Everything must be translated.

### Code Language

Always write in English (en_US). No French variables, functions, or comments.

### Arrow Function Components

```typescript
// GOOD
const MyComponent = () => {
  return <p>Hello</p>;
};

// BAD
function MyComponent() {
  return <p>Hello</p>;
}
```

### Default Exports

When a file contains a single component, always use `export default`.

### Minimize Hooks

- **useEffect**: avoid when possible, prefer Server Components or data fetching libs
- **useState**: consolidate related state into a single object
- **useMemo/useCallback**: use systematically for expensive computations and callbacks passed to children

### Composition Over Configuration

Prefer composing small components over adding many props to a single component.

---

## Styling

### Tailwind CSS Conventions

Use `cn()` from `@/lib/utils` to merge classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-classes', condition && 'conditional-class', className)} />
```

### Class Variance Authority (CVA)

Use for components with multiple variants:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('base-classes', {
  variants: {
    variant: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

---

## Performance

- Use `React.memo` for pure components that re-render often
- Use lazy loading with `Suspense` for heavy components
- Default to Server Components; use `'use client'` only when needed

---

## Git & Commits

### Conventional Commits

```
type(scope): description
```

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `chore`

### Branches

```
main                    # Production
develop                 # Development
feature/TICKET-123-...  # New features
fix/TICKET-456-...      # Bug fixes
refactor/...            # Refactoring
```

---

## Checklist Before Pull Request

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] No `as`, `any`, `@ts-ignore`
- [ ] New components follow the creation guide
- [ ] kebab-case structure respected
- [ ] shadcnblocks components refactored
- [ ] Commits follow conventions
- [ ] `pnpm build` passes
