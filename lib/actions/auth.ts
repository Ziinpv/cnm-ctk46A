"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validations/auth";

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Chua cau hinh Supabase environment variables" };
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _prevState: { error?: string },
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Chua cau hinh Supabase environment variables" };
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const { error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function loginWithGithubAction() {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Chua cau hinh Supabase environment variables" };
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
