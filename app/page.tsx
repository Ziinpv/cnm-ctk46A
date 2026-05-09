import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const supabase = await createClient();

  if (!supabase) {
    return <p className="p-8 text-center text-gray-500">Vui lòng cấu hình môi trường SUPABASE để xem dữ liệu.</p>;
  }

  let query = supabase
    .from("products")
    .select("id,title,price,status,slug,description,images,categories(name)")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (params.q) query = query.textSearch("fts", params.q);
  if (params.category) query = query.eq("category_id", params.category);
  if (params.min) query = query.gte("price", Number(params.min));
  if (params.max) query = query.lte("price", Number(params.max));

  const { data: products, error } = await query.limit(20);

  if (error) {
    return <p className="p-8 text-center text-dlu-red font-medium">{error.message}</p>;
  }

  return (
    <div className="page-enter w-full">
      {/* Hero Slider Area */}
      <section className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] bg-[#156536] overflow-hidden">
        {/* Placeholder for DLU image */}
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          alt="Trường Đại học Đà Lạt"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl uppercase tracking-wider drop-shadow-lg">
            Chợ Sinh Viên
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 md:text-xl drop-shadow-md">
            Môi trường trao đổi, mua bán an toàn và tiện lợi dành riêng cho sinh viên DLU
          </p>
          <div className="mt-8 flex gap-4">
             <Link href="/dashboard/new" className="rounded bg-dlu-gold px-8 py-3.5 text-sm font-bold text-white shadow hover:bg-dlu-gold-hover uppercase tracking-wide transition-colors">
               Đăng tin ngay
             </Link>
             <Link href="#products" className="rounded bg-white/20 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 uppercase tracking-wide transition-colors">
               Khám phá
             </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="products" className="mx-auto w-full max-w-7xl p-6 md:py-16">
        <div className="mb-8 border-b-2 border-[#156536] pb-2 flex items-center justify-between">
           <h2 className="text-2xl font-bold text-[#156536] uppercase inline-block pr-4 bg-background tracking-wide">
             Sản phẩm mới nhất
           </h2>
        </div>

        {!products?.length ? (
          <section className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dlu-green/10 text-dlu-green">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <p className="font-heading text-2xl font-bold text-gray-800">Chưa có sản phẩm nào</p>
            <p className="mt-2 text-gray-500">
              Thị trường đang trống. Hãy là người đầu tiên đăng tin trên Chợ Sinh Viên DLU.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-gray-200 bg-white rounded-none transition-all hover:shadow-md group">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative mb-4 overflow-hidden bg-gray-100 aspect-[4/3]">
                  <Image
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2 bg-[#f37a21] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
                    Mới
                  </div>
                </div>
              </Link>
              
              <div className="px-4 pb-4">
                <Link href={`/products/${product.id}`} className="block">
                  <CardTitle className="text-base font-bold text-[#333] group-hover:text-[#156536] transition-colors line-clamp-2 leading-snug h-[2.75rem]">
                    {product.title}
                  </CardTitle>
                </Link>
                <div className="mt-2 flex items-center text-xs text-gray-500 gap-2 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded-sm">{product.categories?.name ?? "Khác"}</span>
                  <span>•</span>
                  <span>Hôm nay</span>
                </div>
                
                <CardContent className="flex items-end justify-between p-0 mt-4 border-t border-gray-100 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">Giá bán</span>
                    <span className="font-bold text-[#cc0000] text-lg leading-none mt-1">
                      {product.price.toLocaleString()} đ
                    </span>
                  </div>
                  <Link href={`/products/${product.id}`} className="text-[13px] font-medium text-[#156536] hover:underline flex items-center gap-1">
                    Chi tiết <span className="text-lg leading-none">»</span>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </section>
        )}
      </main>
    </div>
  );
}
