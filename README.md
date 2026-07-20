# SvelteKit + Supabase + Netlify TODO Boilerplate

A minimal TODO app boilerplate focused on easy deployment and simple persistence:

- **Framework:** SvelteKit
- **Database:** Supabase (persistence only, no auth/RLS/policies)
- **Hosting:** Netlify

## Features

- Create TODO
- Toggle TODO done/undone
- Delete TODO
- Persistent data in Supabase

## Prerequisites

- Bun 1.2+
- A Supabase project
- A Netlify account

## 1) Local setup

```bash
bun install
cp .env.example .env
```

Fill `.env` with your project values:

```env
PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2) Create the database table

Run this SQL in the Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);
```

A migration file is also included at:

- `supabase/migrations/0001_create_todos.sql`

## 3) Run locally

```bash
bun run dev
```

Open the local URL shown in your terminal.

## 4) Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, create a new site from that repository.
3. Build settings:
   - **Build command:** `bun run build`
   - Publish directory is handled automatically by `@sveltejs/adapter-netlify`.
4. Add environment variables in Netlify:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. Trigger deploy.

`netlify.toml` is included with:

- build command
- Bun version pinning (`1.2.20`)

## 5) Sync database (Supabase CLI)

First-time setup:

```bash
# Install once (macOS)
brew install supabase/tap/supabase

# Authenticate once
supabase login

# Link this repo to your project
bun run db:link
```

Push migrations to remote DB:

```bash
bun run db:push
```

Create a new migration:

```bash
bun run db:new <migration_name>
# edit generated file in supabase/migrations/
bun run db:push
```

## 6) Verification checklist

After deploy, verify:

- You can create a TODO
- You can toggle TODO completion
- You can delete a TODO
- Data persists after page refresh
- Data persists across redeploys

## Notes

This starter intentionally skips auth and RLS for a very simple proof of concept.
If you want multi-user safety for production, add authentication + row-level security in a next version.
