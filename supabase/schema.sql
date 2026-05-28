create extension if not exists "uuid-ossp";

create type product_status as enum ('available', 'sold', 'hidden');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  slug text unique,
  description text not null,
  price int not null check (price >= 0),
  images text[] default '{}',
  status product_status not null default 'available',
  fts tsvector generated always as (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))) stored,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists products_fts_idx on public.products using gin (fts);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_price_idx on public.products (price);

create table if not exists public.wishlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, product_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.wishlist enable row level security;

create policy "Profiles are readable" on public.profiles
for select using (true);

create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "Products are publicly readable" on public.products
for select using (true);

create policy "Users can insert own products" on public.products
for insert with check (auth.uid() = seller_id);

create policy "Users can update own products" on public.products
for update using (auth.uid() = seller_id);

create policy "Users can delete own products" on public.products
for delete using (auth.uid() = seller_id);

create policy "Users can manage own wishlist" on public.wishlist
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
-- Note: Các cập nhật mới cho chat, orders, admin và RLS policies chi tiết
-- được định nghĩa trong file `supabase/schema_update.sql`. 
-- Hãy chạy toàn bộ nội dung trong `supabase/schema_update.sql` trên Supabase SQL Editor.
