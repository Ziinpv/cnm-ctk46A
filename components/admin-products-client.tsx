"use client";

import { adminUpdateProductStatus, adminDeleteProduct } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleUpdateStatus = async (productId: string, newStatus: "available" | "sold" | "hidden") => {
    if (!confirm(`Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm sang "${newStatus === 'hidden' ? 'Ẩn' : 'Hiện'}"?`)) {
      return;
    }

    try {
      setLoadingMap(prev => ({ ...prev, [productId]: true }));
      const res = await adminUpdateProductStatus(productId, newStatus);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      alert("Lỗi kết nối Server Action.");
    } finally {
      setLoadingMap(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("HÀNH ĐỘNG NÀY KHÔNG THỂ KHÔI PHỤC! Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này không?")) {
      return;
    }

    try {
      setLoadingMap(prev => ({ ...prev, [productId]: true }));
      const res = await adminDeleteProduct(productId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (err) {
      alert("Lỗi vĩnh viễn.");
    } finally {
      setLoadingMap(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 border-none">Đang bán</Badge>;
      case "sold":
        return <Badge className="bg-gray-100 text-gray-800 border-none">Đã bán</Badge>;
      case "hidden":
        return <Badge className="bg-red-100 text-red-800 border-none">Bị ẩn</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-none">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      {products.length === 0 ? (
        <p className="p-8 text-center text-gray-500 text-sm">Chưa có sản phẩm nào được đăng tải.</p>
      ) : (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tiêu đề sản phẩm</th>
              <th className="p-4">Người bán</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="w-12 h-12 rounded overflow-hidden relative border border-gray-100 bg-gray-50 shrink-0">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=100&auto=format&fit=crop"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-900">
                  <a href={`/products/${product.id}`} className="hover:underline hover:text-dlu-green block max-w-sm truncate">
                    {product.title}
                  </a>
                  <span className="text-[11px] font-normal text-gray-500 block mt-0.5">Danh mục: {product.categories?.name || "Khác"}</span>
                </td>
                <td className="p-4 text-gray-600 font-medium">
                  {product.profiles?.display_name || "N/A"}
                </td>
                <td className="p-4 font-data font-bold text-gray-900">
                  {product.price.toLocaleString()} đ
                </td>
                <td className="p-4">{getStatusBadge(product.status)}</td>
                <td className="p-4 text-right space-x-2">
                  {product.status === "hidden" ? (
                    <Button
                      onClick={() => handleUpdateStatus(product.id, "available")}
                      disabled={loadingMap[product.id]}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                    >
                      Hiện
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpdateStatus(product.id, "hidden")}
                      disabled={loadingMap[product.id]}
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 font-semibold text-xs"
                    >
                      Ẩn
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleDelete(product.id)}
                    disabled={loadingMap[product.id]}
                    variant="outline"
                    size="sm"
                    className="text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5 font-semibold text-xs"
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
