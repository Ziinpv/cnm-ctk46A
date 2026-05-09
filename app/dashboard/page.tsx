import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <p className="p-8 text-gray-600">Vui lòng cấu hình Supabase.</p>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="p-8 text-gray-600">Bạn cần đăng nhập.</p>;
  }

  const { data: products } = await supabase
    .from("products")
    .select("id,title,price,status,images")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="page-enter mx-auto w-full max-w-5xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between border-b-2 border-dlu-green pb-2">
        <h1 className="font-heading text-2xl font-bold text-dlu-green uppercase tracking-wide">Kho đồ của bạn</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/profile"
            className="rounded bg-gray-100 px-5 py-2.5 text-sm font-bold uppercase text-gray-700 transition-colors hover:bg-gray-200 shadow-sm"
          >
            Sửa hồ sơ
          </Link>
          <Link
            href="/dashboard/new"
            className="rounded bg-dlu-gold px-5 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-dlu-gold-hover shadow-sm"
          >
            Đăng tin mới
          </Link>
        </div>
      </div>

      {!products?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dlu-green/10 text-dlu-green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <p className="font-heading text-2xl font-bold text-gray-800">Kho đồ đang trống</p>
          <p className="mt-2 text-gray-500">
            Bạn chưa đăng bài nào. Hãy tạo sản phẩm đầu tiên để bắt đầu bán đồ.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-6 inline-flex rounded bg-dlu-green px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-dlu-green-hover shadow-sm"
          >
            Đăng sản phẩm đầu tiên
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden border-gray-200 shadow-sm transition-all hover:shadow-md rounded-none group flex flex-col h-full">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] border-b border-gray-200">
                  <Image
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <Link href={`/products/${product.id}`} className="block">
                    <CardTitle className="text-base font-bold text-gray-900 group-hover:text-dlu-green transition-colors leading-snug line-clamp-2">{product.title}</CardTitle>
                  </Link>
                </div>
                <div className="mb-3">
                  <Badge className={product.status === 'sold' ? 'bg-gray-100 text-gray-600 border-none' : 'bg-dlu-green/10 text-dlu-green border-none'}>
                    {product.status === 'sold' ? 'Đã bán' : 'Đang bán'}
                  </Badge>
                </div>
                <CardContent className="p-0 mt-auto pt-4 border-t border-gray-100">
                  <p className="font-data text-dlu-red font-bold text-lg">{product.price.toLocaleString()} đ</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
