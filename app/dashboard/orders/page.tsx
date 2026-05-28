import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrdersClientComponent from "@/components/orders-client";

export default async function OrdersPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <p className="p-8 text-center text-gray-500">Chưa cấu hình Supabase</p>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 1. Tải đơn hàng đã MUA (buying orders)
  const { data: buyingOrders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      created_at,
      product:products(id, title, price),
      seller:profiles!orders_seller_id_fkey(id, display_name, phone)
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  // 2. Tải đơn hàng được BÁN (selling orders)
  const { data: sellingOrders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      created_at,
      product:products(id, title, price),
      buyer:profiles!orders_buyer_id_fkey(id, display_name, phone)
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="page-enter mx-auto w-full max-w-5xl p-6 md:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-dlu-green pb-2 gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dlu-green uppercase tracking-wide">
            Quản lý giao dịch
          </h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi, phê duyệt và hoàn tất các yêu cầu giao dịch trong hệ thống.</p>
        </div>
      </div>

      <OrdersClientComponent
        initialBuyingOrders={buyingOrders || []}
        initialSellingOrders={sellingOrders || []}
        currentUserId={user.id}
      />
    </main>
  );
}
