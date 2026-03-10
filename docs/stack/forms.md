# Forms: react-hook-form + zod

## Overview

This starter includes [react-hook-form](https://react-hook-form.com/) for form state management and [zod](https://zod.dev/) for schema validation, connected via `@hookform/resolvers`.

## Dependencies

```json
{
  "@hookform/resolvers": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^4.x"
}
```

## Basic Usage

### 1. Define a Schema

```tsx
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
```

### 2. Create the Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
};

export default ContactForm;
```

## File Organization

Following the project's Atomic Design conventions:

```
src/lib/organisms/contact-form/
├── ContactForm.tsx           # Form component
├── contact-form.schema.ts    # Zod schema
├── contact-form.types.ts     # Types (if needed beyond zod inference)
└── contact-form.service.ts   # Submission logic
```

### Schema file

```tsx
// contact-form.schema.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

### Service file

```tsx
// contact-form.service.ts
import type { ContactFormData } from './contact-form.schema';

export async function submitContactForm(data: ContactFormData): Promise<void> {
  // API call or server action
}
```

## Validation Patterns

### No `as` assertions

Use zod for runtime validation instead of TypeScript `as` assertions:

```tsx
// BAD
const data = response as ContactFormData;

// GOOD
const data = contactSchema.parse(response);

// GOOD - safe version
const result = contactSchema.safeParse(response);
if (result.success) {
  // result.data is typed as ContactFormData
}
```

### Type guards with zod

```tsx
const ROLES = ['admin', 'user', 'guest'] as const;
const roleSchema = z.enum(ROLES);
type Role = z.infer<typeof roleSchema>;

function isRole(value: string): value is Role {
  return roleSchema.safeParse(value).success;
}
```

## Adding shadcn/ui Form Component

For more advanced form patterns, add the shadcn Form component:

```bash
pnpm dlx shadcn@latest add form textarea
```

This provides `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>` components with built-in react-hook-form integration.
