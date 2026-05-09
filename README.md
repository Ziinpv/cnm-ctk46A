# Campus Marketplace

Project cho do cu sinh vien, xay dung bang Next.js App Router + Supabase.

## Stack

- Next.js (Server Components + Server Actions)
- Supabase (PostgreSQL, Auth, RLS, Storage-ready)
- Tailwind CSS + UI components theo style shadcn/ui
- Zod validation cho auth va tao san pham

## Routes

- `/`: danh sach san pham moi nhat, co tim kiem/loc
- `/products/[id]`: chi tiet san pham va thong tin nguoi ban
- `/dashboard`: quan ly san pham cua nguoi dang nhap
- `/dashboard/new`: dang tin moi bang Server Action + Zod
- `/login`, `/register`: xac thuc email/password

## Supabase setup

1. Tao project Supabase.
2. Chay SQL trong `supabase/schema.sql`.
3. Tao file `.env.local` tu `.env.example`:

```bash
cp .env.example .env.local
```

4. Dien:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Run

```bash
npm install
npm run dev
```
