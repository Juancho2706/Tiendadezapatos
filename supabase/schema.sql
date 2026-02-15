-- RESET DATABASE (CAUTION: DATA LOSS)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.content_blocks CASCADE;

-- Drop Functions & Triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'customer')) default 'customer',
  full_name text,
  phone text,
  shipping_address jsonb, -- Stores { line1, line2, city, state, zip, country }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BRANDS
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  logo_url text, -- Supabase Storage URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCTS (Parent Table)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null check (price >= 0),
  sale_price numeric check (sale_price >= 0),
  is_featured boolean default false,
  is_drop boolean default false, -- For "Nuevos Lanzamientos" / Drops
  category text not null, -- Added category text field based on TS types and form
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCT VARIANTS (Inventory)
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  size text not null, -- e.g., "42", "9 US"
  color text, -- e.g., "Black/Red"
  sku text unique,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PRODUCT IMAGES (Gallery)
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  is_main boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDERS (Transactions)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null, -- Nullable for guest checkout if needed
  status text check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount numeric not null check (total_amount >= 0),
  payment_id text, -- Stripe/MercadoPago ID
  shipping_details jsonb, -- Snapshot of address at time of order
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDER ITEMS (Line Items)
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0) -- Snapshot price
);

-- 8. CONTENT BLOCKS (CMS)
create table public.content_blocks (
  id uuid default uuid_generate_v4() primary key,
  section_name text not null unique, -- e.g., 'hero_home', 'marquee_top'
  title text,
  subtitle text,
  button_text text,
  button_link text,
  image_url text,
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.content_blocks enable row level security;

-- PROFILES Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- BRANDS Policies
create policy "Brands are viewable by everyone" on public.brands for select using (true);
create policy "Admins can manage brands" on public.brands for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- PRODUCTS Policies
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- VARIANTS Policies
create policy "Variants are viewable by everyone" on public.product_variants for select using (true);
create policy "Admins can manage variants" on public.product_variants for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- IMAGES Policies
create policy "Images are viewable by everyone" on public.product_images for select using (true);
create policy "Admins can manage images" on public.product_images for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ORDERS Policies
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ORDER ITEMS Policies
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);
create policy "Users can insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);
create policy "Admins can view all order items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- CONTENT BLOCKS Policies
create policy "Content blocks are viewable by everyone" on public.content_blocks for select using (true);
create policy "Admins can manage content blocks" on public.content_blocks for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- FUNCTIONS & TRIGGERS
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
