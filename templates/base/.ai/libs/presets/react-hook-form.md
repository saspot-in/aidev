# react-hook-form

**Role:** form state and validation in React. Pair with the schema library already used at the boundary (zod) through `@hookform/resolvers`.
**Version:** <verify against installed docs>

## Where it lives
- Form component: `features/<name>/ui/<name>-form.tsx`. Schema: `features/<name>/model/<name>-schema.ts` (or the shared contract schema when the form posts to the API).

## Conventions
- `const form = useForm<FormValues>({ resolver: zodResolver(Schema), defaultValues })` with `FormValues = z.infer<typeof Schema>`. `defaultValues` always provided.
- Use the shadcn `Form` / `FormField` primitives so labels, errors and ARIA are wired. Every input has a label and shows its field error.
- The submit handler is thin: it calls a feature action or mutation and maps server errors back with `form.setError`. Business rules stay out of the component.
- Disable submit while `formState.isSubmitting`; show a general error state for failures.
- Forbidden: one `useState` per field, duplicating validation rules outside the schema, mixing controlled and uncontrolled defaults.

## Testing
Render the form, fill fields with `userEvent`, assert on the submitted payload through a fake action passed in as a prop.
