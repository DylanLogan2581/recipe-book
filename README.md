# Web Application Template

Opinionated React + TypeScript starter for product apps that want strong structure, clear boundaries, and good behavior from both humans and coding agents.

## Stack

- Vite
- React 19
- TypeScript
- TanStack Router with file-based routes
- TanStack Query
- Tailwind CSS v4
- shadcn/ui
- Vitest
- Supabase

## What This Template Optimizes For

- Thin route files and feature-first organization
- Strict TypeScript and linting
- Clear query and infrastructure boundaries
- Supabase-ready structure with migrations and Edge Functions
- Repository automation that nudges clean PR and commit hygiene

## Quick Start

```bash
npm install
npm run dev
```

The app usually runs at `http://localhost:5173` for frontend-only work.

Copy `.env.example` to `.env` when you want the browser app to talk to
Supabase:

```bash
cp .env.example .env
```

## Frontend Environment

Only browser-safe values belong in `VITE_` variables because Vite embeds them
into the client bundle at build time.

Safe to expose in this project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not expose in frontend env files or browser code:

- Supabase service-role keys
- JWT signing secrets
- SMTP credentials
- third-party API tokens
- Edge Function secrets or any other privileged backend-only value

If `.env` is missing or the Supabase variables are blank, the app falls back to
an "Auth setup needed" state instead of creating a client with partial config.

## Local Supabase Workflow

The local stack is configured through `supabase/config.toml` and is meant to be
run with the Supabase CLI after `npm install`.

Start the local stack:

```bash
npx supabase start
```

Inspect the local URLs and generated keys:

```bash
npx supabase status
```

Use the local API URL and anon key from `npx supabase status` in `.env`. The
default local API URL for this config is `http://127.0.0.1:54321`.

After the stack is running, apply the checked-in migrations to your local
database:

```bash
npx supabase db reset
```

This repo includes schema and storage migrations. If your local database is
behind, recipe photo flows can fail with errors such as `Bucket not found` for
the `recipe-cover-photos` and `recipe-cook-log-photos` buckets until you reset
and replay the migrations.

Useful local endpoints from the current config:

- App dev server: `http://localhost:5173`
- Supabase API: `http://127.0.0.1:54321`
- Supabase Studio: `http://127.0.0.1:54323`
- Inbucket email viewer: `http://127.0.0.1:54324`

When you change SQL under `supabase/migrations`, rebuild local database state
from migrations instead of making dashboard-only changes:

```bash
npx supabase migration new <name>
npx supabase db reset
```

This repo does not currently commit `supabase/seed.sql` even though seeding is
enabled in `supabase/config.toml`. Add the seed file alongside schema work
before relying on reset-driven local setup.

Stop the local stack when you are done:

```bash
npx supabase stop
```

## Access Model

This repo is set up around a public-read, authenticated-write recipe model:

- recipe browsing at `/recipes` is public
- recipe detail pages should stay public to read as they are added
- recipe create, delete, and other ownership actions require authentication
- database enforcement for write access belongs in Row Level Security policies

The current UI already reflects that direction: the shell keeps browsing open,
and `/account` is the stable place for sign-in and future ownership flows.

## Local Auth Testing

The current app shell can read session state, but it does not yet ship a sign-in
form. Until the dedicated auth flows land, use the existing account route plus a
local browser console sign-up to verify auth wiring.

For auth testing, run the frontend on `127.0.0.1:3000` so it matches the
redirect origin currently configured in `supabase/config.toml`:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

Then verify these states at `http://127.0.0.1:3000/account`:

1. No `.env` or blank Supabase vars: the page shows the unconfigured state.
2. Valid Supabase env with no session: the page shows guest browsing.
3. Local signed-in session: the page shows the authenticated email badge.

To create a local user and signed-in session in the current setup, run this in
the browser devtools console while the Vite dev server is open:

```js
const { supabase } = await import("/src/lib/supabase.ts");

await supabase?.auth.signUp({
  email: "cook@example.com",
  password: "password123",
});
```

Local email confirmations are disabled in `supabase/config.toml`, so the call
should create the user and sign the browser session in immediately. To clear the
session again:

```js
const { supabase } = await import("/src/lib/supabase.ts");

await supabase?.auth.signOut();
```

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run dev -- --host 127.0.0.1 --port 3000` runs the app on the auth test origin
- `npm run build` type-checks and builds the app
- `npm run lint` runs ESLint, Markdown linting, and SQL formatting checks
- `npm run preview` serves the production build locally
- `npm run test` runs Vitest and intentionally passes when the starter has no tests yet
- `npm run prepare` installs Husky hooks

## Documentation Map

- `README.md`: human overview, setup, and repository tour
- `CONTRIBUTING.md`: human contribution workflow and expectations
- `AGENTS.md`: agent-only working agreement and code organization rules
- `SECURITY.md`: vulnerability reporting and security expectations

If you are contributing as a person, start here and then read `CONTRIBUTING.md`.

If you are an agent, `AGENTS.md` is the source of truth.

## Project Structure

```text
src/
  components/
    ui/                  # low-level primitives
    app/                 # app-specific shared components
    shared/              # small reusable cross-feature components
  features/              # feature-owned components, queries, hooks, schemas, utils
  hooks/                 # app-wide reusable hooks
  lib/                   # infrastructure and generic utilities
  routes/                # route files only
  test/                  # shared test setup and helpers
  types/                 # shared domain types
  index.css              # global theme and styles
  main.tsx               # app bootstrap

supabase/
  config.toml            # local Supabase config
  functions/             # Edge Functions
  migrations/            # schema history
  seed.sql               # optional deterministic seed data
```

## Template Conventions

- Keep route files small and move growing logic into `src/features`.
- Import from `src` through the `@/` alias.
- Import features through public entrypoints such as `@/features/<feature-name>`.
- Keep data access in feature query modules instead of routes and components.
- Do not edit generated files such as `src/routeTree.gen.ts` by hand.
- Treat `supabase/migrations` as the source of truth for schema changes.
- Enable Row Level Security on application tables.

## Repository Automation

This template ships automation that downstream projects can keep:

- Husky + lint-staged for pre-commit formatting and linting
- commitlint for conventional commit messages
- GitHub Actions for lint, build, test, dependency review, workflow linting, and CodeQL
- CODEOWNERS and PR governance helpers

## Before Shipping Changes

Run the checks that fit your change:

```bash
npm run lint
npm run build
```

If you changed behavior covered by tests, also run `npm run test`.

If you changed schema, also confirm:

- a migration was added in `supabase/migrations`
- RLS and policies were updated when needed
- generated database types were updated if the project uses them
