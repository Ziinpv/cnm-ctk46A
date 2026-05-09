"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  _prevState: { message?: string; error?: string },
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase) return { error: "Chưa cấu hình Supabase" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn chưa đăng nhập" };

  const display_name = formData.get("display_name") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name, phone })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { message: "Cập nhật hồ sơ thành công!" };
}
