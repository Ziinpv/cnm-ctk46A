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
- `/dashboard/chat`: Hệ thống trò chuyện thời gian thực (Supabase Realtime) giữa người mua và người bán.
- `/dashboard/orders`: Quản lý yêu cầu giao dịch đặt mua.
- `/admin`: Dashboard quản trị hệ thống dành cho Admin (Quản lý sản phẩm ẩn/xóa, quản lý danh mục CRUD, phân cấp quyền Admin cho người dùng).

## Supabase setup

1. Tạo project Supabase.
2. Chạy toàn bộ SQL trong `supabase/schema.sql` để khởi tạo cấu trúc cơ bản.
3. **MỚI**: Tiếp tục chạy toàn bộ các câu lệnh SQL trong `supabase/schema_update.sql` để cập nhật các bảng mới (`conversations`, `messages`, `orders`), kích hoạt RLS Policies bảo mật nâng cao và bật tính năng **Supabase Realtime** cho các kênh chat.
4. Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

5. Điền:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Chức năng mới nổi bật

### 1. Nhắn tin Người bán trực tiếp (Realtime Chat)
- Người mua bấm "Nhắn tin người bán" tại trang chi tiết sản phẩm để khởi tạo hoặc mở lại cuộc trò chuyện.
- Nhắn tin trực tiếp hai bên mượt mà thông qua kết nối thời gian thực **Supabase Realtime subscriptions**.
- Bảo mật tuyệt đối bằng chính sách **Row-Level Security (RLS)** trên cơ sở dữ liệu (chỉ hai bên tham gia chat mới có quyền xem và gửi tin nhắn).

### 2. Cơ chế Đặt hàng / Xác nhận giao dịch
- Người mua gửi yêu cầu "Đặt mua ngay" từ trang chi tiết sản phẩm.
- Người bán phê duyệt yêu cầu (Chấp nhận / Từ chối) trong trang Quản lý đơn hàng.
- Khi người mua xác nhận "Đã nhận hàng" hoặc người bán ấn "Xác nhận hoàn tất", giao dịch chuyển sang trạng thái thành công (`completed`), đồng thời sản phẩm tự động chuyển trạng thái thành **Đã bán** (`sold`).

### 3. Dashboard Admin (`/admin`)
- Phân quyền chặt chẽ: Chỉ các tài khoản có cột `role = 'admin'` mới được phép truy cập. Các truy cập thông thường sẽ được chuyển hướng an toàn.
- Quản lý sản phẩm: Admin có quyền Ẩn sản phẩm vi phạm quy định hoặc Xóa bài đăng vĩnh viễn.
- Quản lý danh mục: Admin có thể Thêm mới, Chỉnh sửa tên hoặc Xóa danh mục sản phẩm (CRUD).
- Quản lý người dùng: Xem thông tin danh sách sinh viên đăng ký và nâng cấp quyền Quản trị viên cho sinh viên khác.

## Run

```bash
npm install
npm run dev
```
