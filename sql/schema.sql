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

create table if not exists public.request (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  national_id text not null,
  gender text check (gender in ('male', 'female')),
  birth_date date not null,
  phone text not null,
  specialist text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists request_user_id_idx on public.request (user_id);
create index if not exists request_created_at_idx on public.request (created_at);
