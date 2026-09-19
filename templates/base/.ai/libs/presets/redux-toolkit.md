# redux-toolkit

**Role:** global client state (and, with RTK Query, server-state caching). Take this role only if the user chose Redux; otherwise prefer zustand.
**Version:** <verify against installed docs>
**Why this one:** <ADR required: Redux conflicts with the "state local first" rule in frontend.md, so justify global state>

## Where it lives
- Composition root: `src/lib/store.ts` (`configureStore`, `RootState`, `AppDispatch`) and `src/lib/store-hooks.ts` (typed `useAppDispatch`, `useAppSelector`).
- Slices: `features/<name>/model/<name>-slice.ts` (`createSlice`), reducer registered in `lib/store.ts`.
- Other features use a slice only through their surface (selectors and actions), not the slice file.

## Conventions
- State is serializable. Reducers may "mutate" only inside `createSlice` (Immer).
- Selectors live next to the slice (`createSelector` for derived data). Components select the smallest slice of state.
- Async: RTK Query (`createApi`) for server data if used, then it is the only data-fetching library. Otherwise `createAsyncThunk`, with errors normalized.
- Action names follow one style per repo (past-tense events like `cart/itemAdded`, or verbs).
- Forbidden: components dispatching raw action objects, non-serializable values in state, business rules inside components.

## Testing
Test reducers and selectors as pure functions. For components, render with a store built by `setupStore(preloadedState)` from `lib/store.ts`.

## Invariants emitted
- "Cross-feature shared state goes through the store; feature-local state stays in components."
