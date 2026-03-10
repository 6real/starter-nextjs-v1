---
name: review-code
description: Comprehensive code quality review combining TypeScript strictness, SRP compliance, component architecture, and type system validation. Runs all 4 specialized review agents in parallel for maximum coverage. Use after implementing features, creating components, or before PRs.
argument-hint: "[file or directory path] [-q quick] [-f full]"
---

<objective>
Perform a comprehensive, multi-dimensional code quality review by orchestrating all 4 specialized review agents (primesportsfunded-code-reviewer, srp-code-reviewer, component-architect, types-reviewer) in parallel. Produces a unified report with prioritized findings and actionable fixes.
</objective>

<quick_start>
**Review specific files:**

```bash
/review-code src/lib/organisms/challenge-card/
```

**Review recent changes:**

```bash
/review-code
```

**Quick review (critical issues only):**

```bash
/review-code -q src/lib/organisms/signup-form/
```

**Full review (all checks + lint + type-check):**

```bash
/review-code -f src/lib/organisms/signup-form/
```
</quick_start>

<parameters>

<flags>
| Short | Long | Description |
|-------|------|-------------|
| `-q` | `--quick` | Quick mode: only critical issues (no suggestions/nice-to-haves) |
| `-f` | `--full` | Full mode: run all agents + `pnpm lint` + `pnpm type-check` |
</flags>

<parsing_rules>
1. Extract flags from arguments
2. Remaining text = target path(s) to review
3. If no path provided, detect changed files via `git diff --name-only` and `git diff --cached --name-only`
4. If no changes found, ask user what to review
</parsing_rules>

</parameters>

<workflow>

## Step 1: Identify Target Files

Determine what to review:

1. **If path provided:** Use the specified file(s) or directory
2. **If no path:** Run `git diff --name-only` and `git diff --cached --name-only` to find changed files
3. **Filter:** Only include `.ts` and `.tsx` files (exclude `.json`, `.md`, config files)
4. **If no files found:** Ask the user what they want reviewed

**Read all target files** before launching agents. You need to understand the code first.

## Step 2: Launch Parallel Review Agents

Launch **all 4 agents simultaneously** using the Task tool. Each agent gets the full file contents and context.

### Agent 1: PrimeSportsFunded Code Reviewer (`primesportsfunded-code-reviewer`)
**Focus:** TypeScript strictness, architecture compliance, React best practices, shadcn/ui standards, styling, performance

### Agent 2: SRP Code Reviewer (`srp-code-reviewer`)
**Focus:** Single Responsibility Principle, layer separation, red flags detection, change test analysis

### Agent 3: Component Architect (`component-architect`)
**Focus:** Atomic Design compliance, molecule/organism classification, DRY principle, component structure, reusability

### Agent 4: Types Reviewer (`types-reviewer`)
**Focus:** Type deduplication, Supabase generated types usage, tRPC type inference, type consistency

**IMPORTANT:** Launch all 4 agents in a SINGLE message for parallel execution. Pass the full code content to each agent so they can review independently.

## Step 3: Run Automated Checks (if `-f` flag)

If full mode is enabled, also run in parallel:

```bash
pnpm lint
pnpm type-check
```

## Step 4: Compile Unified Report

After all agents return, compile their findings into a single, deduplicated report:

### Report Structure

```markdown
# Code Review Report

**Target:** [files/directory reviewed]
**Date:** [current date]
**Mode:** [quick/standard/full]

---

## Executive Summary
[1-3 sentences: overall code health and critical count]

## Critical Issues (Must Fix Before Merge)

### [ISSUE-1] [Category] - [Title]
- **File:** [path:line]
- **Rule:** [Which standard is violated]
- **Problem:** [What's wrong]
- **Fix:** [Exact code to fix it]
- **Found by:** [Which agent(s)]

### [ISSUE-2] ...

---

## Important Issues

### [ISSUE-N] [Category] - [Title]
...

---

## Suggestions (Nice to Have)
[Only in standard/full mode, skip in quick mode]

---

## Automated Checks
[Only in full mode]
- Lint: PASS/FAIL [details if fail]
- Type-check: PASS/FAIL [details if fail]

---

## Quality Scorecard

| Category | Status | Notes |
|----------|--------|-------|
| TypeScript Strictness | OK/FAIL | No `as`, `any`, `@ts-ignore` |
| Atomic Design Structure | OK/FAIL | Proper molecules/organisms |
| SRP Compliance | OK/FAIL | Single responsibility per file |
| Type System | OK/FAIL | Supabase/tRPC types used |
| React Best Practices | OK/FAIL | Hooks, memoization, server components |
| DRY Principle | OK/FAIL | No code duplication |
| i18n Coverage | OK/FAIL | All strings translated |
| Next.js Standards | OK/FAIL | Link, Image from next |
| File Size (< 150 lines) | OK/FAIL | Per component file |
| Naming Conventions | OK/FAIL | PascalCase/kebab-case |

---

## Verdict: [APPROVED / NEEDS REVISION / REJECTED]
[Clear reasoning for the verdict]
```

### Deduplication Rules

When multiple agents report the same issue:
- Keep the most detailed description
- Merge the fix suggestions
- Note all agents that found it (shows severity)

### Priority Classification

- **Critical:** `as` assertions, `any` types, `@ts-ignore`, SRP violations that affect multiple features, missing Supabase types, security issues
- **Important:** Missing memoization, suboptimal structure, DRY violations, missing i18n
- **Suggestion:** Style improvements, additional optimization opportunities, naming tweaks

</workflow>

<execution_rules>

- **ALWAYS read the target files first** before launching agents
- **Launch all 4 agents in parallel** - never sequentially
- **Deduplicate findings** - same issue from multiple agents = higher severity
- **Provide exact code fixes** - not just descriptions of what to change
- **Be constructive** - acknowledge what's done well before listing issues
- **Quick mode** (`-q`): Skip suggestions, only critical + important
- **Standard mode** (default): Full report with all sections
- **Full mode** (`-f`): Everything + automated lint/type-check

</execution_rules>

<categories>
Issues are categorized for easy filtering:

| Category | Icon | Covers |
|----------|------|--------|
| TypeScript | TS | `as`, `any`, `@ts-ignore`, typing issues |
| Architecture | ARCH | Atomic Design, file structure, naming |
| SRP | SRP | Single responsibility violations |
| Types | TYPE | Supabase/tRPC type usage, duplicates |
| React | REACT | Hooks, memoization, patterns |
| Performance | PERF | Lazy loading, memo, server components |
| i18n | I18N | Missing translations |
| Style | STYLE | Tailwind, cn(), CVA usage |
| DRY | DRY | Code duplication |
| Next.js | NEXT | Link, Image, server/client components |
</categories>
