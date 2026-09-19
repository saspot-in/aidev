# prisma

**Role:** ORM and migrations for a SQL database (TypeScript).
**Version:** <verify against installed docs; client generation and config differ between majors>

## Where it lives
- Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/` (committed). Seed: `prisma/seed.ts`.
- Client adapter: `src/lib/db.ts` creates ONE `PrismaClient` (guard against duplicates on dev hot reload in Next.js).
- Only `features/<name>/api/repo.ts` files import the client. They return domain types, never Prisma model types.

## Conventions
- Models PascalCase singular, mapped to snake_case plural tables (`@@map("user_profiles")`, `@map` for columns).
- Select only the fields needed (`select`), paginate with cursors on large lists, use `include` sparingly to avoid N+1.
- Multi-step writes use `$transaction` inside the repo. Business rules stay in the service.
- Raw SQL only through tagged `$queryRaw` (parameterized). Never build SQL strings.
- Schema changes: edit `schema.prisma`, run `prisma migrate dev --name <change>`, commit the migration. Never edit applied migrations.
- `DATABASE_URL` from typed config; never committed.
- Forbidden: Prisma imports outside repos, returning Prisma types from services, disabling type safety with `as any`.

## Testing
Service tests use a fake repo port. Repo tests run against a separate test database, migrated fresh.

## Invariants emitted
- "Only repo.ts files access the database."
