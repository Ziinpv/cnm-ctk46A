# 🛒 Chợ Sinh Viên DLU - Nền tảng trao đổi đồ cũ sinh viên

## 1. Tổng quan dự án (Project Overview)
**Chợ Sinh Viên DLU** là một dự án ứng dụng web Full-stack (C2C - Consumer to Consumer) được thiết kế và phát triển dành riêng cho cộng đồng sinh viên Trường Đại học Đà Lạt. 

Dự án hoạt động như một "khu chợ số", nơi sinh viên có thể dễ dàng đăng tin thanh lý, trao đổi hoặc tìm mua các vật dụng học tập, đồ dùng sinh hoạt nội bộ (giáo trình, đồ điện tử, phương tiện di chuyển, quần áo...) một cách nhanh chóng, minh bạch và an toàn.

**Công nghệ cốt lõi:**
- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS (Thiết kế giao diện Light Theme hiện đại, bám sát bộ nhận diện thương hiệu DLU).
- **Backend/Database:** Supabase (PostgreSQL), Supabase Auth.
- **Validation:** Zod (Kiểm tra dữ liệu đầu vào).

---

## 2. Mục tiêu dự án (Project Objectives)
### 2.1. Mục tiêu cộng đồng & Xã hội
- **Hỗ trợ sinh viên:** Giúp sinh viên tiết kiệm chi phí sinh hoạt bằng cách mua lại đồ cũ giá rẻ, hoặc kiếm thêm thu nhập từ việc thanh lý những món đồ không còn nhu cầu sử dụng.
- **Xây dựng lối sống xanh:** Thúc đẩy văn hóa tái sử dụng (Reuse), giảm thiểu rác thải sinh hoạt trong môi trường học đường.
- **Kết nối sinh viên:** Tạo ra môi trường an toàn để sinh viên cùng trường giao lưu, hỗ trợ lẫn nhau (khuyến khích giao dịch trực tiếp tại khuôn viên trường).

### 2.2. Mục tiêu cá nhân (Học tập & Phát triển)
- Hoàn thiện kỹ năng xây dựng một ứng dụng Web Full-stack hoàn chỉnh từ khâu thiết kế Database, Authentication đến UI/UX.
- Nắm vững kiến thức xử lý luồng dữ liệu (Server Actions) và bảo mật dữ liệu (Row-Level Security) với Next.js và Supabase.

---

## 3. Phân tích chức năng hệ thống (Functional Analysis)

Hệ thống được chia thành 4 nhóm chức năng chính, xoay quanh hành trình của hai đối tượng: **Người mua** và **Người bán**.

### 3.1. Phân hệ Xác thực & Quản lý Tài khoản (Authentication & Profile)
- **Đăng ký / Đăng nhập:** Hệ thống xác thực bảo mật dựa trên Supabase Auth (Email & Password).
- **Quản lý Hồ sơ (Profile):** 
  - Lưu trữ và hiển thị thông tin người dùng (Tên hiển thị, Avatar ký tự mặc định).
  - Cập nhật số điện thoại / Zalo để làm thông tin liên lạc công khai khi có người muốn mua hàng.
- **Trạng thái đăng nhập:** Thanh điều hướng (Navbar) tự động thay đổi, hiển thị tên người dùng và các menu quản lý cá nhân khi phiên đăng nhập hợp lệ.

### 3.2. Phân hệ Quản lý Kho đồ (Seller Dashboard)
Nơi người bán kiểm soát toàn bộ các mặt hàng mình đã đăng.
- **Đăng tin mới:** Form nhập liệu trực quan cho phép nhập Tiêu đề, Mô tả chi tiết, Giá bán, Danh mục sản phẩm (sách, đồ điện tử...) và URL Hình ảnh. 
  - *Tích hợp kiểm tra lỗi (Validation)*: Bắt lỗi trực tiếp (Tiêu đề quá ngắn, sai định dạng URL...) và báo lỗi thân thiện ra màn hình (Sử dụng `useActionState`).
- **Danh sách Kho đồ:** Giao diện lưới (Grid Layout) hiển thị toàn bộ lịch sử đăng tin của người dùng. Có nhãn (Badge) phân biệt trạng thái sản phẩm ("Đang bán" / "Đã bán").
- **Giao diện Empty State:** Thiết kế đồ họa nhẹ nhàng hướng dẫn người dùng khi kho đồ còn trống, khuyến khích thao tác đăng tin.

### 3.3. Phân hệ Khám phá & Chi tiết Sản phẩm (Buyer Experience)
Tối ưu hóa trải nghiệm tìm kiếm và chốt đơn cho người mua.
- **Trang chủ (Homepage):** 
  - Hero Banner ấn tượng, mang màu sắc đặc trưng của Đại học Đà Lạt.
  - Danh sách "Sản phẩm mới nhất" hiển thị theo dạng thẻ (Card) với hiệu ứng hover bắt mắt, kèm giá bán và nhãn phân loại.
- **Trang Chi tiết Sản phẩm (Product Detail Page):**
  - **Thông tin cốt lõi:** Hình ảnh kích thước lớn, Tên, Danh mục, Trạng thái và Mô tả chi tiết của sản phẩm.
  - **Khối "Thông tin người bán" (Crucial Feature):** Trích xuất tự động thông tin chủ sở hữu món đồ. Hiển thị Tên người bán và Số điện thoại liên hệ.
  - **Call-to-Action (CTA):** Nút **"Gọi ngay"** được thiết kế nổi bật. Trên thiết bị di động, khi nhấn nút này sẽ tự động chuyển sang trình gọi điện (tel: URI), giúp người mua dễ dàng chốt đơn tức thì.

### 3.4. Phân hệ Trang thông tin tĩnh (Static Pages)
- **Hướng dẫn sử dụng (`/huong-dan`):** Cung cấp các bước từ lúc tạo tài khoản đến khi đăng tin, cùng các cảnh báo an toàn khi giao dịch trực tiếp.
- **Liên hệ (`/lien-he`):** Thông tin của Quản trị viên (Sinh viên phát triển dự án) để người dùng có thể gửi góp ý, báo cáo lỗi.

---

## 4. Bảo mật & Kiến trúc dữ liệu (Security & Architecture)
- **Row-Level Security (RLS):** Thiết lập bảo mật tận cấp độ cơ sở dữ liệu trên Supabase. 
  - *Chỉ người dùng đang đăng nhập mới có quyền Thêm/Sửa sản phẩm của chính họ.*
  - *Mọi người dùng (kể cả khách chưa đăng nhập) đều có thể xem danh sách sản phẩm công khai.*
- **Kiến trúc Server Components:** Tận dụng tối đa Next.js Server Components để truy vấn dữ liệu trực tiếp từ Database ở phía Server, mang lại tốc độ phản hồi nhanh, điểm hiệu năng SEO tốt và không bị rò rỉ các khóa API ra phía người dùng.
