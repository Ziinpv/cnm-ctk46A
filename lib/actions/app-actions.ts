"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// =========================================================================
// 1. ACTIONS CHO HỆ THỐNG CHAT
// =========================================================================

export async function getOrCreateConversation(
  sellerId: string,
  productId: string
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Chưa cấu hình Supabase");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  if (user.id === sellerId) {
    throw new Error("Bạn không thể chat với chính mình.");
  }

  // Tìm cuộc hội thoại đã tồn tại
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", user.id)
    .eq("seller_id", sellerId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  // Nếu chưa có, tạo cuộc hội thoại mới
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({
      buyer_id: user.id,
      seller_id: sellerId,
      product_id: productId,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return newConv.id;
}

export async function sendMessageAction(conversationId: string, content: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn chưa đăng nhập" };

  if (!content || content.trim() === "") {
    return { error: "Nội dung tin nhắn không được để trống" };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: error.message };

  return { success: true };
}

// =========================================================================
// 2. ACTIONS CHO CƠ CHẾ ĐẶT HÀNG (ORDERS)
// =========================================================================

export async function createOrderAction(productId: string, sellerId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (user.id === sellerId) {
    return { error: "Bạn không thể tự mua sản phẩm của chính mình" };
  }

  // Kiểm tra xem sản phẩm có đang trong giao dịch thành công hoặc đã bán chưa
  const { data: product } = await supabase
    .from("products")
    .select("status")
    .eq("id", productId)
    .single();

  if (!product || product.status === "sold") {
    return { error: "Sản phẩm này đã được bán" };
  }

  // Tạo yêu cầu đặt hàng mới
  const { error } = await supabase.from("orders").insert({
    product_id: productId,
    buyer_id: user.id,
    seller_id: sellerId,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath(`/products/${productId}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function updateOrderStatusAction(orderId: string, status: 'accepted' | 'rejected' | 'completed' | 'cancelled') {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn chưa đăng nhập" };

  // Lấy thông tin đơn hàng hiện tại
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) return { error: "Không tìm thấy giao dịch" };

  // Kiểm tra phân quyền cập nhật trạng thái đơn hàng
  const isAdmin = await checkIsAdmin(supabase, user.id);
  const isBuyer = order.buyer_id === user.id;
  const isSeller = order.seller_id === user.id;

  if (!isBuyer && !isSeller && !isAdmin) {
    return { error: "Bạn không có quyền thao tác trên giao dịch này" };
  }

  // Người bán mới có quyền accept/reject
  if ((status === "accepted" || status === "rejected") && !isSeller && !isAdmin) {
    return { error: "Chỉ người bán mới có quyền duyệt yêu cầu giao dịch này" };
  }

  // Người mua mới có quyền huỷ yêu cầu khi đang chờ duyệt
  if (status === "cancelled" && !isBuyer && !isAdmin) {
    return { error: "Chỉ người mua mới có quyền huỷ yêu cầu này" };
  }

  // Cập nhật trạng thái đơn hàng
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateErr) return { error: updateErr.message };

  // Khi giao dịch thành công (completed), tự động cập nhật sản phẩm thành 'sold'
  if (status === "completed") {
    await supabase
      .from("products")
      .update({ status: "sold" })
      .eq("id", order.product_id);
  }

  revalidatePath("/dashboard/orders");
  revalidatePath(`/products/${order.product_id}`);
  return { success: true };
}

// Helper kiểm tra quyền Admin
async function checkIsAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}

// =========================================================================
// 3. ACTIONS CHO HỆ THỐNG ADMIN
// =========================================================================

export async function verifyAdminAccess() {
  const supabase = await createClient();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  return checkIsAdmin(supabase, user.id);
}

export async function adminUpdateProductStatus(productId: string, status: "available" | "sold" | "hidden") {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function adminDeleteProduct(productId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { success: true };
}

// Quản lý Danh mục (Categories)
export async function adminAddCategory(name: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  if (!name || name.trim() === "") {
    return { error: "Tên danh mục không được để trống" };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ name: name.trim() });

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function adminUpdateCategory(id: string, name: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  if (!name || name.trim() === "") {
    return { error: "Tên danh mục không được để trống" };
  }

  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function adminDeleteCategory(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

// Quản lý người dùng
export async function adminUpdateUserRole(targetUserId: string, role: "user" | "admin") {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await checkIsAdmin(supabase, user.id))) {
    return { error: "Không có quyền Admin" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}
