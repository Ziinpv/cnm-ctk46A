import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import AdminCategoriesClient from "@/components/admin-categories-client";

export default async function AdminCategoriesPage() {
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

  // Tải danh sách danh mục
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <main className="page-enter mx-auto w-full max-w-6xl p-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Quản lý danh mục</h1>
        <p className="text-sm text-gray-500 mt-1">Khởi tạo, chỉnh sửa hoặc xoá các danh mục phân loại đồ cũ.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <AdminNav />
        <AdminCategoriesClient initialCategories={categories || []} />
      </div>
    </main>
  );
}
