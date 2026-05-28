"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getOrCreateConversation, createOrderAction } from "@/lib/actions/app-actions";

interface ProductActionsProps {
  productId: string;
  sellerId: string;
  isOwner: boolean;
  productStatus: string;
  isAuthenticated: boolean;
}

export default function ProductActions({
  productId,
  sellerId,
  isOwner,
  productStatus,
  isAuthenticated,
}: ProductActionsProps) {
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChat = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setLoadingChat(true);
      setErrorMessage("");
      const conversationId = await getOrCreateConversation(sellerId, productId);
      router.push(`/dashboard/chat?id=${conversationId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể mở cuộc trò chuyện.");
      setLoadingChat(false);
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn gửi yêu cầu đặt mua sản phẩm này? Người bán sẽ nhận được thông báo yêu cầu của bạn.")) {
      return;
    }

    try {
      setLoadingOrder(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await createOrderAction(productId, sellerId);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Đã gửi yêu cầu mua hàng thành công! Bạn có thể theo dõi trong Quản lý đơn hàng.");
      }
    } catch (err: any) {
      setErrorMessage("Lỗi khi gửi yêu cầu.");
    } finally {
      setLoadingOrder(false);
    }
  };

  if (isOwner) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center mt-4">
        <p className="text-sm text-gray-500 font-medium">Đây là sản phẩm do bạn đăng bán.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleChat}
          disabled={loadingChat || productStatus === "sold"}
          className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold py-3 px-6 rounded transition-colors shadow-sm text-sm uppercase tracking-wide"
        >
          {loadingChat ? "Đang xử lý..." : "Nhắn tin người bán"}
        </Button>

        <Button
          onClick={handleOrder}
          disabled={loadingOrder || productStatus === "sold"}
          className="bg-dlu-gold hover:bg-dlu-gold-hover text-white font-bold py-3 px-6 rounded transition-colors shadow-sm text-sm uppercase tracking-wide"
        >
          {loadingOrder ? "Đang gửi..." : productStatus === "sold" ? "Đã bán" : "Đặt mua ngay"}
        </Button>
      </div>

      {errorMessage && (
        <p className="text-sm font-semibold text-dlu-red bg-dlu-red/10 p-3 rounded-md text-center">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <div className="bg-dlu-green/10 border border-dlu-green/20 rounded-md p-3 text-center">
          <p className="text-sm font-semibold text-dlu-green mb-1">{successMessage}</p>
          <Button
            onClick={() => router.push("/dashboard/orders")}
            variant="outline"
            className="text-dlu-green font-bold hover:underline p-0 h-auto text-xs uppercase"
          >
            Đi đến đơn hàng
          </Button>
        </div>
      )}
    </div>
  );
}
