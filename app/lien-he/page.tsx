export default function ContactPage() {
  return (
    <main className="page-enter mx-auto w-full max-w-4xl p-6 md:py-16">
      <div className="mb-8 border-b-2 border-dlu-green pb-2">
        <h1 className="text-2xl font-bold text-dlu-green uppercase tracking-wide">
          Thông tin liên hệ
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Liên hệ với Quản trị viên</h2>
          <p className="text-gray-600 mb-6">
            Mọi thắc mắc, báo cáo lỗi hệ thống, hoặc đóng góp ý kiến về dự án "Chợ Sinh Viên DLU", xin vui lòng liên hệ trực tiếp qua thông tin bên dưới:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dlu-green/10 text-dlu-green text-xl">
                📞
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">Số điện thoại / Zalo</p>
                <p className="text-lg font-bold text-gray-900">0385548656</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dlu-gold/10 text-dlu-gold text-xl">
                📧
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase">Email cá nhân</p>
                <p className="text-lg font-bold text-gray-900">lonbg5417@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dlu-green p-8 rounded-xl text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-dlu-gold mb-6 relative z-10">Về Dự Án Này</h2>
          <p className="text-white/90 mb-4 leading-relaxed relative z-10">
            Chợ Sinh Viên DLU là một dự án ứng dụng web phi lợi nhuận, được phát triển với mục đích tạo ra một không gian số an toàn, thân thiện để sinh viên Trường Đại học Đà Lạt có thể thanh lý và mua bán các vật dụng cũ.
          </p>
          <p className="text-white/90 leading-relaxed relative z-10">
            Mục tiêu là xây dựng cộng đồng tiết kiệm, bảo vệ môi trường và hỗ trợ lẫn nhau trong quá trình học tập tại DLU.
          </p>
          
          <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
             <p className="text-sm font-bold tracking-wider uppercase text-dlu-gold">Trường Đại học Đà Lạt</p>
             <p className="text-xs mt-1 text-white/70">Thụ nhân - Khai phóng - Bản sắc</p>
          </div>
        </div>
      </div>
    </main>
  );
}
