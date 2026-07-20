create extension if not exists "pgcrypto";

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.todos is 'TODO persistence table for boilerplate demo app.';
comment on column public.todos.is_done is 'Completion flag for a todo item.';
