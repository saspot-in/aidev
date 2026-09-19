# Frontend conventions (React + TypeScript)

Applies to Next.js and Vite stacks. Styling rules are in `theming.md`; naming/layout in `conventions.md`.

## Components
- One exported component per file; file name = kebab-case of the component (`LoginForm` in `login-form.tsx`). Small private helper components may share the file.
- Function components only. Props typed as `<Component>Props`, destructured in the signature. No `React.FC`.
- Keep components presentational where possible: data and rules come from `model/` (hooks, pure functions) or from the server.
- Prefer composition (children, slots) over many boolean props. More than ~5 props usually means split.
- Every data-driven view handles loading, empty, error and success. No blank states.
- Lists: stable keys from data ids, never array index for dynamic lists.
- Conditional rendering: early return for guards; ternary for two branches; no nested ternaries.

## State and effects
- Order of preference: derive it, keep it local, lift to nearest parent, feature-level store/context, global. Reach for the next only when the previous fails.
- Never copy props into state. Never store what can be computed during render.
- `useEffect` is only for syncing with something outside React (subscriptions, timers, imperative APIs, manual fetch on Vite). Not for derived state or event responses.
- Effects list all dependencies, clean up after themselves, and never `await` at top level.
- Memoize (`useMemo`, `useCallback`, `memo`) only after measuring or to keep referential stability a child needs.
- Custom hooks: `use-<name>.ts` in `model/`, one concern each, return a stable shape.

## Data
- One data-access module per resource inside the feature (`model/` or `api/`). Components never call `fetch` directly.
- Validate/parse responses at that boundary (zod, or generated types for OpenAPI). Components receive typed data.
- Mutations: optimistic UI only when rollback is handled; always surface failures to the user.

## Accessibility
- Semantic elements first (`button`, `nav`, `main`, `label`); `div` + onClick is a bug.
- Every input has a label; every image has `alt` (empty when decorative); interactive elements reachable and operable by keyboard with visible focus.
- Use Radix/shadcn primitives for dialogs, menus, tabs, popovers: they already handle focus and ARIA.
- Motion respects `prefers-reduced-motion`.

## Structure inside `ui/`
```
ui/
  login-form.tsx
  login-form.test.tsx      # optional; or in ../tests/
  session-badge.tsx
```
Shared primitives live in `components/ui/` (shadcn). Do not edit them for feature needs: wrap them in the feature.
