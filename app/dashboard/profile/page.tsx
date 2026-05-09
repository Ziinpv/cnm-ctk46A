import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  if (!supabase) {
    return <p className="p-8">Chưa cấu hình Supabase</p>;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="page-enter mx-auto w-full max-w-2xl p-6 md:p-10">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading mb-6 text-2xl font-bold text-dlu-green uppercase tracking-wide">
          Hồ sơ cá nhân
        </h1>
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dlu-green/10 text-2xl font-bold text-dlu-green">
             {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : "U"}
           </div>
           <div>
             <p className="text-lg font-bold text-gray-900">{profile?.display_name || "Chưa cập nhật tên"}</p>
             <p className="text-sm text-gray-500">{user.email}</p>
           </div>
        </div>
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}
