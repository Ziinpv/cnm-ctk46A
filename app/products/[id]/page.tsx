import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <p className="p-8 text-gray-600">Vui lòng cấu hình Supabase.</p>;
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("id,title,description,price,status,images,profiles!products_seller_id_fkey(display_name,phone),categories(name)")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="page-enter mx-auto w-full max-w-6xl p-6 md:py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square shadow-sm border border-gray-200">
          <Image
            src={
              product.images?.[0] ||
              "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop"
            }
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {product.categories?.name || "Khác"}
            </span>
          </div>
          
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {product.title}
          </h1>
          
          <div className="mb-6 pb-6 border-b border-gray-100 flex items-center">
            <span className="font-data text-3xl font-bold text-dlu-red">
              {product.price.toLocaleString()} đ
            </span>
            <Badge className={`ml-4 ${product.status === "sold" ? "bg-gray-200 text-gray-600" : "bg-dlu-green/10 text-dlu-green"} border-none text-sm px-3 py-1`}>
              {product.status === "sold" ? "Đã bán" : "Đang bán"}
            </Badge>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Mô tả chi tiết</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <section className="mt-auto rounded-xl border border-dlu-green/20 bg-dlu-green/5 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-dlu-green mb-4">
              Thông tin người bán
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dlu-green text-white font-bold text-lg shadow-sm">
                {product.profiles?.display_name ? product.profiles.display_name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{product.profiles?.display_name ?? "Chưa cập nhật tên"}</p>
                <p className="text-sm text-gray-500">Sinh viên DLU</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Số điện thoại / Zalo</p>
                <p className="font-data text-xl font-bold text-gray-900">
                  {product.profiles?.phone ? product.profiles.phone : "Chưa cập nhật SĐT"}
                </p>
              </div>
              {product.profiles?.phone && (
                <a href={`tel:${product.profiles.phone}`} className="bg-dlu-gold hover:bg-dlu-gold-hover text-white font-bold py-2.5 px-6 rounded transition-colors shadow-sm">
                  Gọi ngay
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic text-center">
              * Khuyến nghị: Hãy giao dịch và kiểm tra hàng trực tiếp tại trường để đảm bảo an toàn.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
