import Link from "next/link";

export default function GuidePage() {
  return (
    <main className="page-enter mx-auto w-full max-w-4xl p-6 md:py-16">
      <div className="mb-8 border-b-2 border-dlu-green pb-2">
        <h1 className="text-2xl font-bold text-dlu-green uppercase tracking-wide">
          Hướng dẫn sử dụng Chợ Sinh Viên
        </h1>
      </div>

      <div className="space-y-8 text-gray-800 leading-relaxed bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        
        <section>
          <h2 className="text-xl font-bold text-dlu-green mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dlu-green text-white text-sm">1</span>
            Đăng nhập / Đăng ký
          </h2>
          <p className="ml-10">
            Hệ thống yêu cầu tài khoản để đảm bảo an toàn và minh bạch. Bạn cần có tài khoản để đăng tin hoặc xem chi tiết người bán.
            Nhấn vào nút <strong className="text-dlu-green">Đăng nhập</strong> ở góc trên bên phải màn hình. Nếu bạn chưa có tài khoản, hãy nhập Email và Mật khẩu rồi chọn <strong className="text-dlu-green">Đăng ký mới</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-dlu-green mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dlu-green text-white text-sm">2</span>
            Cập nhật Hồ sơ cá nhân
          </h2>
          <p className="ml-10 mb-2">
            Để người mua có thể liên lạc với bạn, sau khi đăng nhập hãy vào phần <strong className="text-dlu-green">Xin chào, ...</strong> và chọn <strong className="text-dlu-green">Sửa hồ sơ</strong>.
          </p>
          <ul className="list-disc ml-16 text-gray-600 space-y-1">
            <li><strong>Tên hiển thị:</strong> Điền họ tên đầy đủ hoặc biệt danh.</li>
            <li><strong>Số điện thoại:</strong> Sẽ được hiển thị khi người khác muốn mua đồ của bạn.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-dlu-green mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dlu-green text-white text-sm">3</span>
            Đăng tin bán đồ
          </h2>
          <p className="ml-10 mb-2">
            Để đăng bài, nhấn vào nút <strong className="text-dlu-gold">Đăng tin ngay</strong> hoặc vào <strong className="text-dlu-green">Quản lý kho đồ &gt; Đăng tin mới</strong>.
          </p>
          <ul className="list-disc ml-16 text-gray-600 space-y-1">
            <li><strong>Tiêu đề & Mô tả:</strong> Viết rõ ràng, mô tả chân thực tình trạng sản phẩm.</li>
            <li><strong>Giá bán:</strong> Nhập bằng số (Ví dụ: 50000).</li>
            <li><strong>Hình ảnh:</strong> Copy URL của một hình ảnh bất kỳ (Ví dụ: lấy từ Google Hình ảnh) và dán vào ô URL.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-dlu-green mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dlu-green text-white text-sm">4</span>
            Giao dịch & Thanh toán
          </h2>
          <p className="ml-10">
            Trang web <strong>Chợ Sinh Viên</strong> đóng vai trò trung gian giới thiệu sản phẩm. Mọi giao dịch, thương lượng giá cả và thanh toán sẽ do người mua và người bán <strong>tự thỏa thuận trực tiếp</strong> qua số điện thoại hoặc hẹn gặp nhau tại khuôn viên Trường Đại học Đà Lạt. Khuyến cáo giao dịch trực tiếp để tránh rủi ro.
          </p>
        </section>

      </div>
    </main>
  );
}
