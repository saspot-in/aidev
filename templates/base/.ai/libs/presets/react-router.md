# react-router

**Role:** client-side routing for Vite React apps. Not used with Next.js (Next has its own router).
**Version:** <verify against installed docs; v6 and v7 APIs differ>

## Where it lives
- Route table: `src/app/routes.tsx` (routing glue only). Router created once in `src/main.tsx`.
- Route components come from features through their surfaces (`@/features/<name>`); the route file only maps a path to a component.

## Conventions
- Paths kebab-case, plural for collections: `/user-profiles/:id`. Define path builders in the feature (`profilePath(id)`) so links are not string-concatenated inline.
- Lazy-load route components (`lazy`) per feature. Provide an error element and a catch-all not-found route.
- Navigation side effects (`useNavigate`) live in feature hooks or handlers, not in presentational components.
- Data loading: if a data-fetching library is in use (tanstack-query), do not also use route loaders for the same data. Pick one and record it in an ADR.
- Forbidden: reading `window.location` directly, hardcoded URLs in components.

## Testing
Render with `createMemoryRouter` and the real route table or a minimal one; assert on navigation results.
