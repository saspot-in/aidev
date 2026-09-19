# SOLID principles

Load with `conventions.md` before writing code. SOLID is a smell detector applied at function, component and module level in idiomatic TS/Python (functions, unions, composition). It is not a mandate for class hierarchies, abstract factories or DI frameworks. Over-engineering violates these rules too: no interface for a single implementation unless it is an IO boundary or a test seam.

Mechanical guards (lint): `complexity` <= 10, `max-params` 4 (Python: 5), `max-classes-per-file` 1, `max-lines` 300. A warning from these usually means an S, O or I violation: fix the design, do not silence the rule.

## S: Single Responsibility (one reason to change)
- One sentence test: describe a function, component, hook or file without "and". If you cannot, split it.
- Layers already encode it: route/action/component = transport or render, service/`model` = business rules, repo/query = data access. Never mix them in one function (no `fetch` + rules + JSX in one component; no SQL inside a route handler).
- A hook or component owns one concern. A function takes no boolean flag that switches its behavior: make two functions.
- Signal: changes for unrelated reasons (copy edit, pricing rule, API shape) hit the same file.

## O: Open/Closed (extend by adding, not editing)
- Variants of behavior go in a lookup table or strategy map keyed by kind, not a growing `if/else` or `switch` chain:
  ```ts
  const formatters: Record<ExportKind, (data: Report) => string> = { csv: toCsv, json: toJson };
  ```
- Closed sets are discriminated unions; every `switch` over one ends with an exhaustive check (`default: return assertNever(kind)`), so adding a variant is a compile error at each place that must handle it. Python: `Literal`/`Enum` + `match` with `assert_never`.
- UI: extend by composition (`children`, slots, `cva` variants), not by adding another boolean prop to a component.
- Trigger: the second time you add a case to the same conditional, refactor it to a table or strategy.

## L: Liskov Substitution (substitutes honor the contract)
- Any implementation of a type, interface or `Protocol` must accept the same inputs, return the same shape, and raise no new error kinds. Do not tighten inputs or weaken outputs.
- Prefer composition over inheritance. Inherit only for a true is-a, one level deep, never to reuse code. No class overrides a method to throw "not supported".
- Wrapper components forward what the wrapped element accepts: type props as `ComponentProps<"button">` and spread the rest; do not silently drop `className`, `ref`, `aria-*`.
- Fakes and real implementations of a port (repo, clock, mailer) pass the same contract test suite. Write the suite once, run it against both.

## I: Interface Segregation (depend only on what you use)
- Take the narrowest input: a component that shows a name and avatar takes `{ name, avatarUrl }`, not the whole `User`. Functions use `Pick<T, ...>` or a small type when they need two fields of a big one.
- Ports are role-sized (`OrderReader`, `OrderWriter`), not one `OrderRepo` with 15 methods. Python: several small `Protocol`s.
- One zod/Pydantic schema per operation and shape (request, response), not one mega-schema shared by everything.
- The feature surface (`index.ts`) is an interface too: export the minimum other modules need.

## D: Dependency Inversion (policy does not depend on details)
- Business logic (service, `model/`) never constructs or imports concrete IO: no `new DbClient()`, `fetch`, `Date.now()`, `Math.random()`, `process.env`, `fs` inside it. It receives them.
- The service declares the small port it needs (a type or `Protocol` it owns); the repo implements it. Dependency arrows point toward the business rules.
  ```ts
  type OrderReader = { findById(id: string): Promise<Order | null> };
  export function createOrderService(deps: { orders: OrderReader; now: () => Date }) { /* rules */ }
  ```
- Wiring happens in one composition root and nowhere else: Node `app.ts`, Python `main.py` + `Depends` providers, Next.js the feature `api/` entry (`actions.ts` / `queries.ts` build the concrete deps and call the service).
- Tests pass fakes to the service; no module mocking needed. If a test needs to mock a module to test a rule, the rule depends on a detail: invert it.
- Skip inversion for pure code (no IO, no time, no randomness): call it directly.

## Self-review checklist (run before finishing a task)
1. Can each new function/component/file be described in one sentence without "and"? (S)
2. Does adding the next variant require editing existing conditionals? (O)
3. Would a fake or subclass work everywhere the real one is used, unchanged? (L)
4. Does any consumer receive or import more than it uses? (I)
5. Does business logic import concrete IO, env, clock or a framework type? (D)
6. Did I add an abstraction with one implementation and no IO/test seam? Remove it.
