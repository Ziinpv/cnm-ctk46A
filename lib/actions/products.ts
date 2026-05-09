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

export async function createProductAction(
  _prevState: { error?: string },
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Chua cau hinh Supabase environment variables" };
  }

  const parsed = createProductSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    category_id: formData.get("category_id"),
    image_url: formData.get("image_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Ban can dang nhap" };
  }

  const input = parsed.data;
  const slug = slugify(input.title);

  const { error } = await supabase.from("products").insert({
    seller_id: user.id,
    title: input.title,
    description: input.description,
    price: input.price,
    category_id: input.category_id,
    images: [input.image_url],
    slug,
    status: "available",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
