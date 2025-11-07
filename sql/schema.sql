-- Schema for Supabase tables
create extension if not exists "pgcrypto";

create table if not exists public.category (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.doctor (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  full_name text not null,
  slug text not null unique,
  medical_code text not null unique,
  description text,
  documents text[] not null default '{}',
  category_id uuid references public.category(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists doctor_category_id_idx on public.doctor (category_id);
