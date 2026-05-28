"use client";

import { updateOrderStatusAction } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrdersClientProps {
  initialBuyingOrders: any[];
  initialSellingOrders: any[];
  currentUserId: string;
}

export default function OrdersClientComponent({
  initialBuyingOrders,
  initialSellingOrders,
  currentUserId,
}: OrdersClientProps) {
  const router = useRouter();
  const [buyingOrders, setBuyingOrders] = useState(initialBuyingOrders);
  const [sellingOrders, setSellingOrders] = useState(initialSellingOrders);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleStatusUpdate = async (orderId: string, newStatus: 'accepted' | 'rejected' | 'completed' | 'cancelled') => {
    if (!confirm(`Bạn có chắc chắn muốn chuyển trạng thái giao dịch này thành "${
      newStatus === 'accepted' ? 'Chấp nhận' : 
      newStatus === 'rejected' ? 'Từ chối' : 
      newStatus === 'completed' ? 'Hoàn tất' : 'Huỷ bỏ'
    }"?`)) {
      return;
    }

    try {
      setLoadingMap(prev => ({ ...prev, [orderId]: true }));
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
        // Cập nhật state UI nhanh
        const updateState = (orders: any[]) =>
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        setBuyingOrders(updateState);
        setSellingOrders(updateState);
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi thực hiện.");
    } finally {
      setLoadingMap(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-none">Đang chờ</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 text-blue-800 border-none">Đã duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-none">Từ chối</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-none">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800 border-none">Đã huỷ</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-none">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. YÊU CẦU MUA HÀNG (ĐƠN MUA CỦA BẠN) */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-heading text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-dlu-gold inline-block"></span>
            Đơn mua của bạn ({buyingOrders.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">Các sản phẩm bạn đã gửi yêu cầu mua tới người bán.</p>
        </div>
        
        {buyingOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Bạn chưa gửi yêu cầu đặt mua sản phẩm nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Người bán</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">
                      <a href={`/products/${order.product?.id}`} className="hover:underline hover:text-dlu-green">
                        {order.product?.title}
                      </a>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {order.seller?.display_name} ({order.seller?.phone || "Chưa có SĐT"})
                    </td>
                    <td className="p-4 font-data font-bold text-gray-900">
                      {order.product?.price?.toLocaleString()} đ
                    </td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      {order.status === "pending" && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, "cancelled")}
                          disabled={loadingMap[order.id]}
                          variant="outline"
                          size="sm"
                          className="text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5 font-semibold text-xs"
                        >
                          Huỷ yêu cầu
                        </Button>
                      )}
                      
                      {order.status === "accepted" && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, "completed")}
                          disabled={loadingMap[order.id]}
                          size="sm"
                          className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold text-xs"
                        >
                          Đã nhận hàng
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => router.push(`/dashboard/chat`)}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs font-semibold"
                      >
                        Chat
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 2. YÊU CẦU NHẬN ĐƯỢC (ĐƠN BÁN CỦA BẠN) */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-heading text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-dlu-green inline-block"></span>
            Yêu cầu mua bạn nhận được ({sellingOrders.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý các yêu cầu mua sản phẩm của bạn từ người dùng khác.</p>
        </div>
        
        {sellingOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Chưa có ai gửi yêu cầu đặt mua sản phẩm của bạn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Người mua</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">
                      <a href={`/products/${order.product?.id}`} className="hover:underline hover:text-dlu-green">
                        {order.product?.title}
                      </a>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {order.buyer?.display_name} ({order.buyer?.phone || "Chưa có SĐT"})
                    </td>
                    <td className="p-4 font-data font-bold text-gray-900">
                      {order.product?.price?.toLocaleString()} đ
                    </td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      {order.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleStatusUpdate(order.id, "accepted")}
                            disabled={loadingMap[order.id]}
                            size="sm"
                            className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold text-xs"
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(order.id, "rejected")}
                            disabled={loadingMap[order.id]}
                            variant="outline"
                            size="sm"
                            className="text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5 font-semibold text-xs"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                      
                      {order.status === "accepted" && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, "completed")}
                          disabled={loadingMap[order.id]}
                          size="sm"
                          className="bg-dlu-gold hover:bg-dlu-gold-hover text-white font-bold text-xs"
                        >
                          Xác nhận hoàn tất
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => router.push(`/dashboard/chat`)}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs font-semibold"
                      >
                        Chat
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
