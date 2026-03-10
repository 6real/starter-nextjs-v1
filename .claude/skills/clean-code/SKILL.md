---
name: clean-code
description: Automatically detect and fix clean code violations in TypeScript/React files. Applies fixes for common issues like `as` assertions, `any` types, missing memoization, DRY violations, naming conventions, and structural problems. Use after writing code or after /review-code to auto-fix findings.
argument-hint: "[file or directory path] [-d dry-run] [-a all] [-c category]"
---

<objective>
Automatically scan and fix clean code violations in TypeScript/React files based on the PrimeSportsFunded coding standards (CLAUDE.md). Unlike /review-code which only reports issues, /clean-code actively modifies files to resolve them.
</objective>

<quick_start>
**Fix a specific file:**

```bash
/clean-code src/lib/organisms/challenge-card/ChallengeCard.tsx
```

**Dry run (show what would change without modifying):**

```bash
/clean-code -d src/lib/organisms/signup-form/
```

**Fix all changed files:**

```bash
/clean-code
```

**Fix only a specific category:**

```bash
/clean-code -c typescript src/lib/organisms/challenge-card/
```
</quick_start>

<parameters>

<flags>
| Short | Long | Description |
|-------|------|-------------|
| `-d` | `--dry-run` | Show what would be changed without modifying files |
| `-a` | `--all` | Apply ALL fixes including suggestions (default: critical + important only) |
| `-c` | `--category` | Fix only a specific category: `typescript`, `react`, `structure`, `dry`, `i18n`, `naming` |
</flags>

<parsing_rules>
1. Extract flags from arguments
2. If `-c` is present, next token is the category name
3. Remaining text = target path(s)
4. If no path provided, detect changed files via `git diff --name-only` and `git diff --cached --name-only`
5. If no changes found, ask user what to clean
</parsing_rules>

</parameters>

<workflow>

## Step 1: Identify Target Files

Same as /review-code:

1. **If path provided:** Use the specified file(s) or directory
2. **If no path:** Run `git diff --name-only` and `git diff --cached --name-only`
3. **Filter:** Only `.ts` and `.tsx` files
4. **Read all target files** completely

## Step 2: Analyze and Categorize Issues

Scan each file for fixable violations. Categorize by fix type:

### Category: TypeScript (`typescript`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| `as` type assertion | Pattern: `value as Type` | Replace with type guard function or Zod validation |
| `any` type | Pattern: `: any`, `<any>` | Replace with proper type or `unknown` + type guard |
| `@ts-ignore` | Pattern: `// @ts-ignore` | Remove and fix underlying type issue |
| `@ts-expect-error` | Pattern: `// @ts-expect-error` | Remove and fix underlying type issue |
| Non-null assertion `!` | Pattern: `value!.prop` | Replace with null check (`if (!value) throw/return`) |

**Fix Strategy for `as` assertions:**

```typescript
// BEFORE
const user = data as User;

// AFTER - Option 1: Zod validation
const UserSchema = z.object({ id: z.string(), name: z.string() });
const user = UserSchema.parse(data);

// AFTER - Option 2: Type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
}
if (!isUser(data)) throw new Error('Invalid user data');
const user = data; // Now typed as User
```

**Fix Strategy for `any`:**

```typescript
// BEFORE
function process(data: any) { ... }

// AFTER - Determine actual type from usage context
function process(data: ProcessableData) { ... }

// OR if truly unknown
function process(data: unknown) {
  const validated = Schema.parse(data);
  ...
}
```

### Category: React (`react`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| Missing `useCallback` | Function passed as prop to child | Wrap with `useCallback` |
| Missing `useMemo` | Expensive computation in render | Wrap with `useMemo` |
| `function Component()` syntax | `function` keyword for component | Convert to `const Component = () =>` |
| Named export for single component | `export function/const` without default | Change to `export default` |
| Native `<a>` tag | `<a href=` | Replace with `<Link>` from next/link |
| Native `<img>` tag | `<img src=` | Replace with `<Image>` from next/image |
| Unnecessary `useEffect` for data fetching | `useEffect` + fetch/setState | Flag for manual review (suggest tRPC/server component) |

**Fix Strategy for missing useCallback:**

```typescript
// BEFORE
const MyComponent = () => {
  const handleClick = (id: string) => { doSomething(id); };
  return <ChildComponent onClick={handleClick} />;
};

// AFTER
const MyComponent = () => {
  const handleClick = useCallback((id: string) => { doSomething(id); }, []);
  return <ChildComponent onClick={handleClick} />;
};
```

### Category: Structure (`structure`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| File > 150 lines | Line count check | Flag for manual decomposition (provide suggestions) |
| Wrong folder naming | Non-kebab-case folder | Suggest rename (dry-run only - too risky to auto-rename) |
| Wrong file naming | Service/types not kebab-case | Suggest rename (dry-run only) |
| Missing `.types.ts` | Types defined inline in component | Extract to `component-name.types.ts` |
| Missing `.service.ts` | Business logic in component | Extract to `component-name.service.ts` |

**Fix Strategy for type extraction:**

```typescript
// BEFORE - Types inline in Component.tsx
interface UserCardProps {
  user: { id: string; name: string; email: string };
  onEdit: (id: string) => void;
}

const UserCard = ({ user, onEdit }: UserCardProps) => { ... };

// AFTER - Types in user-card.types.ts
// [CREATE] src/lib/organisms/user-card/user-card.types.ts
export interface UserCardProps {
  user: { id: string; name: string; email: string };
  onEdit: (id: string) => void;
}

// [MODIFY] UserCard.tsx
import type { UserCardProps } from './user-card.types';
const UserCard = ({ user, onEdit }: UserCardProps) => { ... };
```

### Category: DRY (`dry`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| Repeated JSX pattern | Same structure 3+ times | Extract to molecule (provide template) |
| Duplicate type definitions | Same interface in multiple files | Consolidate to single source |
| Repeated className patterns | Same Tailwind classes 3+ times | Suggest CVA or cn() extraction |

### Category: i18n (`i18n`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| Hardcoded user-facing string | Quoted string in JSX | Flag for translation (suggest `dict.section.key`) |
| Custom Dictionary type | `interface Dictionary` | Replace with import from `@/i18n/get-dictionary` |

### Category: Naming (`naming`)

| Issue | Detection | Fix |
|-------|-----------|-----|
| French variable/function names | Common French words in identifiers | Rename to English equivalent |
| French comments | French text in comments | Translate to English or remove |
| Non-descriptive names | Single letter vars (except loops) | Suggest descriptive alternatives |

## Step 3: Apply Fixes

For each issue found:

1. **If dry-run mode (`-d`):** Show the diff without modifying
2. **If fix mode (default):**
   - Apply automatic fixes using the Edit tool
   - For structural changes (file moves/renames), show instructions instead
   - Group related changes together

### Fix Priority Order

Apply fixes in this order to avoid conflicts:

1. **Imports** - Add missing imports first (useCallback, useMemo, Link, Image, types)
2. **Type fixes** - Replace `as`, `any`, add type guards
3. **React fixes** - Add useCallback/useMemo wrappers, component syntax
4. **Structure fixes** - Extract types/services to separate files
5. **i18n fixes** - Flag hardcoded strings
6. **Naming fixes** - Rename variables/functions

## Step 4: Validate Changes

After applying fixes:

1. Run `pnpm type-check` to verify no type errors introduced
2. Run `pnpm lint` to verify lint compliance
3. If errors found, attempt to fix them
4. If unable to fix, revert the problematic change and report it

## Step 5: Generate Summary

```markdown
# Clean Code Report

**Target:** [files reviewed]
**Mode:** [dry-run / fix / fix-all]
**Category filter:** [all / specific category]

---

## Changes Applied

### [FILE_PATH]

#### Fix 1: [Description]
- **Category:** [typescript/react/structure/dry/i18n/naming]
- **Severity:** [critical/important/suggestion]
- **Status:** [FIXED / MANUAL_REQUIRED / SKIPPED]
- **Diff:**
```diff
- old code
+ new code
```

...

---

## Summary

| Category | Found | Fixed | Manual Required | Skipped |
|----------|-------|-------|-----------------|---------|
| TypeScript | N | N | N | N |
| React | N | N | N | N |
| Structure | N | N | N | N |
| DRY | N | N | N | N |
| i18n | N | N | N | N |
| Naming | N | N | N | N |
| **Total** | **N** | **N** | **N** | **N** |

## Validation
- Type-check: PASS/FAIL
- Lint: PASS/FAIL

## Manual Actions Required
[List of changes that need human intervention with instructions]
```

</workflow>

<execution_rules>

- **ALWAYS read files completely** before making any changes
- **NEVER break working code** - validate after each set of changes
- **Preserve existing logic** - only fix style/pattern issues, never change behavior
- **Group related edits** - apply all changes to a file at once when possible
- **Respect dry-run** - in `-d` mode, NEVER modify any file
- **Be conservative** - when unsure if a fix is safe, mark as MANUAL_REQUIRED
- **Run validation** - always run type-check and lint after fixes
- **Revert on failure** - if a fix breaks type-check, revert it immediately
- **No over-engineering** - don't add unnecessary abstractions while fixing

### Safety Rules

- **NEVER change business logic** - only fix code quality/style issues
- **NEVER delete code** unless it's clearly dead code (unused imports, unreachable branches)
- **NEVER rename exported functions/components** without checking all usages
- **NEVER move files** automatically - suggest moves as MANUAL_REQUIRED
- **NEVER modify test files** unless they have the same quality issues
- **Ask before large refactors** - if > 10 changes in a single file, confirm with user

### Automatic vs Manual Fixes

**Safe to auto-fix:**
- Adding `useCallback`/`useMemo` wrappers
- Converting `function Component()` to `const Component = () =>`
- Adding `export default`
- Replacing `<a>` with `<Link>`, `<img>` with `<Image>`
- Removing `@ts-ignore` comments (when fix is clear)
- Adding missing type imports
- Simple `as` removal with type guard

**Require manual review (MANUAL_REQUIRED):**
- Extracting business logic to `.service.ts`
- Decomposing large components (> 150 lines)
- Creating new molecule from repeated patterns
- Complex `as` assertion replacements
- `useEffect` refactoring to server components
- File/folder renaming
- Supabase type migrations

</execution_rules>

<fix_patterns>

### Pattern: Remove `as` with Type Guard

```typescript
// Detection: /(\w+)\s+as\s+(\w+)/
// Context: Need to understand the source type and target type

// Step 1: Create type guard (if doesn't exist)
function is{TargetType}(value: unknown): value is {TargetType} {
  return typeof value === 'object' && value !== null && '{key_prop}' in value;
}

// Step 2: Replace assertion with guard
// BEFORE: const result = data as TargetType;
// AFTER:
if (!is{TargetType}(data)) {
  throw new Error('Expected {TargetType}');
}
const result = data; // TypeScript narrows the type
```

### Pattern: Add useCallback

```typescript
// Detection: Function defined in component body and passed as prop
// Requirement: Function must be passed to a child component

// Step 1: Identify dependencies
// Step 2: Wrap with useCallback
const handler = useCallback(({params}) => {
  {body}
}, [{dependencies}]);
```

### Pattern: Add useMemo

```typescript
// Detection: Computation that derives from props/state
// Signals: .filter(), .map(), .reduce(), .sort(), new object/array creation

// Step 1: Identify the computation and its dependencies
// Step 2: Wrap with useMemo
const computed = useMemo(() => {
  return {computation};
}, [{dependencies}]);
```

### Pattern: Convert to const arrow component

```typescript
// Detection: function ComponentName(
// Replace with: const ComponentName = (

// BEFORE
function MyComponent({ prop }: Props) {
  return <div>{prop}</div>;
}

// AFTER
const MyComponent = ({ prop }: Props) => {
  return <div>{prop}</div>;
};
```

### Pattern: Replace native HTML with Next.js

```typescript
// Detection: <a href= or <img src=

// BEFORE
<a href="/about">About</a>
<img src="/logo.png" alt="Logo" />

// AFTER
import Link from 'next/link';
import Image from 'next/image';

<Link href="/about">About</Link>
<Image src="/logo.png" alt="Logo" width={...} height={...} />
```

### Pattern: Extract types to separate file

```typescript
// Detection: interface/type definitions in .tsx files (not .types.ts)
// Threshold: 2+ interface/type definitions

// Step 1: Create {component-name}.types.ts
// Step 2: Move all interfaces/types there
// Step 3: Add import type { ... } from './{component-name}.types';
// Step 4: Ensure export for types used externally
```

</fix_patterns>
