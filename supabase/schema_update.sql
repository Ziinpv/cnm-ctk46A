-- =========================================================================
-- 1. CẬP NHẬT BẢNG PROFILES (THÊM CỘT ROLE)
-- =========================================================================
alter table public.profiles add column if not exists role text not null default 'user';

-- =========================================================================
-- 2. TẠO CÁC BẢNG CHO HỆ THỐNG CHAT
-- =========================================================================

-- Bảng conversations (cuộc trò chuyện giữa buyer và seller về 1 sản phẩm)
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (buyer_id, seller_id, product_id)
);

-- Bảng messages (tin nhắn trong cuộc trò chuyện)
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Bật Row Level Security (RLS) cho Chat
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- RLS Policies cho conversations
create policy "Users can view their own conversations" on public.conversations
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can start conversations" on public.conversations
  for insert with check (auth.uid() = buyer_id);

-- RLS Policies cho messages
create policy "Members of conversation can view messages" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Members of conversation can send messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );


-- =========================================================================
-- 3. TẠO CÁC BẢNG CHO CƠ CHẾ ĐẶT HÀNG / GIAO DỊCH (ORDERS)
-- =========================================================================

-- Tạo enum order_status nếu chưa tồn tại
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
  end if;
end$$;

-- Bảng orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  status order_status not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bật Row Level Security (RLS) cho orders
alter table public.orders enable row level security;

-- Kiểm tra xem user có phải admin không
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- RLS Policies cho orders
create policy "Users and admins can view orders" on public.orders
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id or public.is_admin());

create policy "Buyers can place orders" on public.orders
  for insert with check (auth.uid() = buyer_id);

create policy "Users can update their orders" on public.orders
  for update using (auth.uid() = buyer_id or auth.uid() = seller_id or public.is_admin());


-- =========================================================================
-- 4. BỔ SUNG CÁC POLICY CHO ADMIN TRÊN BẢNG PRODUCTS VÀ CATEGORIES
-- =========================================================================

-- Cho phép Admin cập nhật hoặc xóa mọi sản phẩm
create policy "Admins can update all products" on public.products
  for update using (public.is_admin());

create policy "Admins can delete all products" on public.products
  for delete using (public.is_admin());

-- Danh mục (Categories) policies cho admin
alter table public.categories enable row level security;

create policy "Categories are readable by everyone" on public.categories
  for select using (true);

create policy "Admins can insert categories" on public.categories
  for insert with check (public.is_admin());

create policy "Admins can update categories" on public.categories
  for update using (public.is_admin());

create policy "Admins can delete categories" on public.categories
  for delete using (public.is_admin());


-- =========================================================================
-- 5. KÍCH HOẠT REALTIME CHO MỚI TIN NHẮN (MESSAGES) TRÊN SUPABASE
-- =========================================================================
-- Bật realtime cho bảng messages và conversations
begin;
  -- Xoá publication cũ nếu có
  drop publication if exists supabase_realtime;
  
  -- Tạo publication mới cho bảng messages
  create publication supabase_realtime for table public.messages, public.conversations, public.orders;
commit;
