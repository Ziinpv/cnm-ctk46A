import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditProductForm } from "@/components/edit-product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return <p className="p-8 text-center text-gray-500">Chưa cấu hình Supabase</p>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Tải chi tiết sản phẩm và xác thực quyền sở hữu
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  if (product.seller_id !== user.id) {
    return (
      <main className="mx-auto w-full max-w-4xl p-6 md:py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-red-700 mb-2">Quyền truy cập bị từ chối</h1>
          <p className="text-sm text-red-600 mb-6">Bạn không có quyền chỉnh sửa bài viết của người khác.</p>
          <a href="/dashboard" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded shadow-sm text-sm uppercase">Quay về kho đồ</a>
        </div>
      </main>
    );
  }

  // Tải danh mục sản phẩm phục vụ select dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <main className="page-enter mx-auto w-full max-w-2xl p-6 md:p-10">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading mb-2 text-2xl font-bold text-dlu-green uppercase tracking-wide">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100">Cập nhật thông tin chi tiết, giá cả hoặc trạng thái bài đăng của bạn.</p>
        <EditProductForm product={product} categories={categories || []} />
      </div>
    </main>
  );
}
