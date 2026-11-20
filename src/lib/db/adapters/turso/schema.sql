create table if not exists todos (
  id text primary key,
  title text not null check(length(trim(title)) > 0),
  is_done integer not null default 0,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
