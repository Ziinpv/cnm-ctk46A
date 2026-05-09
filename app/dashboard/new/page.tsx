import { createClient } from "@/lib/supabase/server";
import { NewProductForm } from "@/components/new-product-form";

export default async function NewProductPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <p className="p-8">Hay cau hinh SUPABASE env.</p>;
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("name");

  return (
    <main className="page-enter mx-auto w-full max-w-2xl p-6 md:p-10">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading mb-6 text-2xl font-bold text-dlu-green uppercase">Đăng tin bán đồ</h1>
        <NewProductForm categories={categories || []} />
      </div>
    </main>
  );
}
