create table if not exists public.projects (
  id bigint generated always as identity primary key,
  slug text not null unique,
  category text not null check (category in ('ta', 'gamedev', 'graphics')),
  color text not null,
  cover_url text,
  github_url text,
  demo_url text,
  project_page_url text,
  is_pinned boolean not null default false,
  sort_weight integer not null default 0,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_translations (
  project_id bigint not null references public.projects(id) on delete cascade,
  locale text not null check (locale in ('en', 'zh')),
  title text not null,
  subtitle text,
  description text not null,
  long_description text not null,
  credits text,
  tags text[] not null default '{}',
  primary key (project_id, locale)
);

create index if not exists idx_projects_published_sort
  on public.projects (is_published, is_pinned desc, sort_weight desc, published_at desc);

create index if not exists idx_projects_slug
  on public.projects (slug);

alter table public.projects enable row level security;
alter table public.project_translations enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read translations of published projects" on public.project_translations;
create policy "Public can read translations of published projects"
on public.project_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = project_translations.project_id
      and public.projects.is_published = true
  )
);
