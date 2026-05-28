import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import AdminProductsClient from "@/components/admin-products-client";

export default async function AdminProductsPage() {
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
    redirect("/");
  }

  // Tải danh sách tất cả sản phẩm trên hệ thống
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      status,
      images,
      created_at,
      profiles:seller_id (display_name),
      categories:category_id (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="page-enter mx-auto w-full max-w-6xl p-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Quản lý bài đăng</h1>
        <p className="text-sm text-gray-500 mt-1">Duyệt, ẩn hoặc xóa vĩnh viễn sản phẩm đăng tải vi phạm nội quy.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <AdminNav />
        <AdminProductsClient initialProducts={products || []} />
      </div>
    </main>
  );
}
