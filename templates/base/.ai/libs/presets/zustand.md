# zustand

**Role:** client state management (UI state shared across components). Server data does NOT belong here: use the data-fetching library or Server Components.
**Version:** <verify against installed docs>
**Why this one:** small, no provider, selector-based re-renders. Alternative: redux-toolkit (only if the team already standardizes on it).

## Where it lives
- One store per feature: `features/<name>/model/<name>-store.ts`. No app-wide mega store.
- The store itself is private to the feature. Export a hook (`useCartStore`) and typed selectors through `index.ts`, never the raw `create` result.

## Conventions
- `create<State>()((set, get) => ({ ...state, ...actions }))`. Actions live inside the store and are named as verbs (`addItem`, `clear`).
- Always subscribe with a selector: `useCartStore((s) => s.items)`. Never call `useCartStore()` without a selector.
- Derive values with selectors or functions, do not store derived state. Keep state serializable.
- Large stores: split into slices composed in one `create`.
- `persist` middleware only for non-sensitive data; version the persisted shape (`version`, `migrate`).
- Forbidden: storing fetched server data, calling `getState()` in React components, importing a store from another feature (go through its surface).

## Testing
Reset between tests: `useCartStore.setState(initialState, true)`. Test actions and selectors as plain functions; no rendering needed.

## Invariants emitted
- "<feature> store is only accessed through its surface hooks."
