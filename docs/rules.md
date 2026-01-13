# AI Rules

## Scope
- This repo is Vite + React + TypeScript + Tailwind + shadcn-ui + Supabase.
- Keep pt-BR copy and the current visual language.

## Frontend
- Reuse `Layout`, `AdminLayout`, `Sidebar`, and existing components before creating new ones.
- Keep routes in `src/App.tsx`; do not add new pages without updating routes and navigation.
- Prefer hooks in `src/hooks` and services in `src/services` for logic; keep pages thin.
- Use Tailwind utilities and existing classes (for example, `glass-card`, `btn-fire`) to match `src/index.css`.

## Data and Supabase
- Use the `supabase` client from `src/integrations/supabase/client.ts`.
- Any schema change must be a new SQL migration in `supabase/migrations` with RLS policies and indexes.
- After schema changes, regenerate and update `src/integrations/supabase/types.ts`.
- Never expose service-role keys in the frontend; use Edge Functions if privileged access is required.

## Progress and challenge content
- `days` content is managed in Supabase and the admin editor; avoid hardcoding unless requested.
- For progress, pick a single source of truth (localStorage or Supabase) and update all consumers consistently.

## Safety and maintenance
- Do not edit auto-generated files unless regenerating.
- Do not remove unrelated changes.
- Prefer minimal, scoped changes; update docs when behavior changes.
