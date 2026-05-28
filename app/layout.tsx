import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["vietnamese", "latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chợ Sinh viên | Đại học Đà Lạt",
  description: "Nền tảng trao đổi và mua bán đồ cũ dành cho sinh viên Đại học Đà Lạt",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  let user = null;
  let profile = null;

  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
    if (user) {
      const { data } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', user.id).single();
      profile = data;
    }
  }

  return (
    <html
      lang="vi"
      className={`${roboto.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground flex flex-col"
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern opacity-100" />
        
        {/* Top Bar */}
        <div className="bg-dlu-green text-white/90 py-1.5 text-xs hidden sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Cựu sinh viên</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cán bộ - Giảng viên</span>
              <span className="hover:text-white cursor-pointer transition-colors">Sinh viên</span>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Thư viện</span>
              <span className="hover:text-white cursor-pointer transition-colors">E-Learning</span>
              <span className="hover:text-white cursor-pointer transition-colors">Email</span>
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <header className="bg-white py-4 shadow-sm relative z-40">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dlu-green text-white font-bold text-lg shadow-inner">
                DLU
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold text-dlu-green leading-tight">
                  ĐẠI HỌC ĐÀ LẠT
                </span>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest leading-tight">
                  Chợ Sinh Viên
                </span>
              </div>
            </Link>
            <div className="hidden md:block">
               <p className="text-lg font-bold text-dlu-gold tracking-widest uppercase">
                  Thụ nhân - Khai phóng - Bản sắc
               </p>
            </div>
          </div>
        </header>

        {/* Main Navigation */}
        <nav className="bg-white border-b border-t border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
            <ul className="flex items-center gap-1 text-sm font-bold text-gray-700 uppercase tracking-wide">
              <li>
                <Link className="block py-4 px-4 hover:text-dlu-green border-b-2 border-transparent hover:border-dlu-green transition-all" href="/">
                  Trang chủ
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link className="block py-4 px-4 hover:text-dlu-green border-b-2 border-transparent hover:border-dlu-green transition-all" href="/huong-dan">
                  Hướng dẫn
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link className="block py-4 px-4 hover:text-dlu-green border-b-2 border-transparent hover:border-dlu-green transition-all" href="/lien-he">
                  Liên hệ
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link className="text-sm font-semibold text-dlu-green flex items-center gap-2 transition-colors hover:text-dlu-green-hover" href="/dashboard/profile">
                    <div className="w-8 h-8 bg-dlu-green/10 rounded-full flex items-center justify-center text-dlu-green font-bold">
                      {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline-block">Xin chào, {profile?.display_name || 'Sinh viên'}</span>
                  </Link>
                  {profile?.role === "admin" && (
                    <Link className="text-sm font-bold text-dlu-red transition-colors hover:text-dlu-red-hover uppercase tracking-wider" href="/admin">
                      Quản trị
                    </Link>
                  )}
                  <Link className="text-sm font-medium text-gray-600 transition-colors hover:text-dlu-green" href="/dashboard/chat">
                    Tin nhắn
                  </Link>
                  <Link className="text-sm font-medium text-gray-600 transition-colors hover:text-dlu-green" href="/dashboard/orders">
                    Đơn hàng
                  </Link>
                  <Link className="text-sm font-medium text-gray-600 transition-colors hover:text-dlu-green" href="/dashboard">
                    Kho đồ
                  </Link>
                  <form action={signOutAction}>
                    <button type="submit" className="text-sm font-medium text-dlu-red transition-colors hover:text-dlu-red-hover cursor-pointer">
                      Đăng xuất
                    </button>
                  </form>
                </>
              ) : (
                <Link className="rounded bg-dlu-green px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-dlu-green-hover shadow-sm uppercase tracking-wide" href="/login">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* DLU Footer */}
        <footer className="bg-[#156536] text-white/80 mt-16 border-t-[4px] border-dlu-gold">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
            <div>
              <h3 className="mb-4 text-lg font-bold text-white uppercase">Thông tin liên hệ</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-dlu-green font-bold text-xl shrink-0">
                  DLU
                </div>
                <p className="font-bold text-white leading-tight">TRƯỜNG ĐẠI HỌC<br/>ĐÀ LẠT</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li>📍 01 Phù Đổng Thiên Vương - P8 - TP. Đà Lạt</li>
                <li>📞 SĐT: 0385548656</li>
                <li>📧 Email: lonbg5417@gmail.com</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-white uppercase">Phòng chức năng</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Phòng Quản lý Đào tạo</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Phòng Công tác Sinh viên</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Phòng Khảo thí và ĐBCL</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Phòng Kế hoạch Tài chính</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-white uppercase">Chợ Sinh Viên</h3>
              <p className="text-sm mb-4">
                Nền tảng giao lưu, trao đổi và mua bán các vật dụng học tập, đồ dùng sinh hoạt nội bộ dành cho sinh viên Trường Đại học Đà Lạt.
              </p>
              <Link href="/dashboard/new" className="inline-block rounded bg-dlu-gold px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-dlu-gold-hover">
                Đăng tin ngay
              </Link>
            </div>
          </div>
          <div className="bg-[#0f4a27] py-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Trường Đại học Đà Lạt. Phát triển bởi Sinh viên DLU.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
