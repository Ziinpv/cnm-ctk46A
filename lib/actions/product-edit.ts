"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validations/product";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function deleteProductAction(productId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn chưa đăng nhập" };

  // Kiểm tra xem sản phẩm có phải của người dùng này không (bảo vệ RLS & Action)
  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();

  if (!product) return { error: "Không tìm thấy sản phẩm" };
  if (product.seller_id !== user.id) return { error: "Bạn không có quyền xóa sản phẩm này" };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleProductStatusAction(productId: string, currentStatus: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn chưa đăng nhập" };

  // Kiểm tra quyền sở hữu
  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();

  if (!product) return { error: "Không tìm thấy sản phẩm" };
  if (product.seller_id !== user.id) return { error: "Bạn không có quyền thay đổi trạng thái sản phẩm này" };

  const newStatus = currentStatus === "available" ? "sold" : "available";

  const { error } = await supabase
    .from("products")
    .update({ status: newStatus })
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function updateProductAction(
  productId: string,
  _prevState: { error?: string },
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Chưa cấu hình Supabase" };
  }

  const parsed = createProductSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    category_id: formData.get("category_id"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Bạn cần đăng nhập" };
  }

  // Kiểm tra quyền sở hữu sản phẩm
  const { data: product } = await supabase
    .from("products")
    .select("seller_id, images, status")
    .eq("id", productId)
    .single();

  if (!product) return { error: "Không tìm thấy sản phẩm" };
  if (product.seller_id !== user.id) return { error: "Bạn không có quyền sửa sản phẩm này" };

  const status = formData.get("status") as string;
  const input = parsed.data;
  const slug = slugify(input.title);

  let imageUrl = product.images?.[0] || "";

  // Xử lý upload ảnh mới nếu được cung cấp
  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      return { error: "Lỗi khi upload ảnh mới: " + uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("products")
    .update({
      title: input.title,
      description: input.description,
      price: input.price,
      category_id: input.category_id,
      images: imageUrl ? [imageUrl] : [],
      slug,
      status: status || product.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/products/${productId}`);
  
  redirect("/dashboard");
}
