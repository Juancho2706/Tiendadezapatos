
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  sizes jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Policies for Products
-- Allow read access to everyone
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Allow insert/update/delete access to authenticated users only (Admins)
create policy "Admins can insert products"
  on products for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update products"
  on products for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete products"
  on products for delete
  using ( auth.role() = 'authenticated' );
