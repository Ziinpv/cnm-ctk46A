import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <p className="p-8 text-center text-gray-500">Chưa cấu hình Supabase</p>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Kiểm tra quyền Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="mx-auto w-full max-w-4xl p-6 md:py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-red-700 mb-2">Không có quyền truy cập</h1>
          <p className="text-sm text-red-600 mb-6">Bạn cần đăng nhập bằng tài khoản có vai trò Quản trị viên (Admin) để xem trang này.</p>
          <a href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded shadow-sm text-sm uppercase">Quay lại Trang chủ</a>
        </div>
      </main>
    );
  }

  // Lấy các con số thống kê cơ bản
  const { count: totalProducts } = await supabase.from("products").select("id", { count: "exact", head: true });
  const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { count: totalCategories } = await supabase.from("categories").select("id", { count: "exact", head: true });
  const { count: totalOrders } = await supabase.from("orders").select("id", { count: "exact", head: true });

  return (
    <main className="page-enter mx-auto w-full max-w-6xl p-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Dashboard Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Trang quản trị vận hành dành cho Ban quản trị Chợ Sinh Viên DLU.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <AdminNav />
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="bg-dlu-green/5 border border-dlu-green/10 p-6 rounded-xl text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-dlu-green">{totalProducts || 0}</p>
            </div>

            <div className="bg-dlu-gold/5 border border-dlu-gold/10 p-6 rounded-xl text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Người dùng</p>
              <p className="text-3xl font-bold text-dlu-gold">{totalUsers || 0}</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Danh mục</p>
              <p className="text-3xl font-bold text-blue-700">{totalCategories || 0}</p>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Đơn đặt hàng</p>
              <p className="text-3xl font-bold text-purple-700">{totalOrders || 0}</p>
            </div>

          </div>

          <div className="mt-8 bg-gray-50 border border-gray-150 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 text-base mb-2">Hướng dẫn Quản trị viên</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Chào mừng bạn đến với trang quản trị Chợ Sinh Viên DLU. Tại đây, bạn có quyền:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Kiểm duyệt sản phẩm, ẩn hoặc xóa các sản phẩm vi phạm chính sách của nhà trường.</li>
              <li>Quản lý danh mục sản phẩm (CRUD danh mục) để phân loại bài đăng hợp lý.</li>
              <li>Xem danh sách người dùng, nâng cấp vai trò thành viên thành Admin.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
