"use client";

import { toggleProductStatusAction, deleteProductAction } from "@/lib/actions/product-edit";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductRowActionsProps {
  productId: string;
  productStatus: string;
}

export default function ProductRowActions({ productId, productStatus }: ProductRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await toggleProductStatusAction(productId, productStatus);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi thực hiện.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn XÓA sản phẩm này vĩnh viễn? Hành động này không thể khôi phục!")) {
      return;
    }

    try {
      setLoading(true);
      const res = await deleteProductAction(productId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-150 justify-between items-center w-full">
      <Button
        onClick={() => router.push(`/dashboard/edit/${productId}`)}
        disabled={loading}
        variant="outline"
        size="sm"
        className="text-gray-600 border-gray-200 hover:bg-gray-50 flex-1 py-1.5 font-bold text-xs"
      >
        Sửa
      </Button>

      <Button
        onClick={handleToggleStatus}
        disabled={loading}
        variant="outline"
        size="sm"
        className={`flex-1 py-1.5 font-bold text-xs ${
          productStatus === "sold"
            ? "text-green-600 border-green-200 hover:bg-green-50"
            : "text-amber-600 border-amber-200 hover:bg-amber-50"
        }`}
      >
        {productStatus === "sold" ? "Bán lại" : "Đã bán"}
      </Button>

      <Button
        onClick={handleDelete}
        disabled={loading}
        variant="outline"
        size="sm"
        className="text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5 flex-1 py-1.5 font-bold text-xs"
      >
        Xóa
      </Button>
    </div>
  );
}
