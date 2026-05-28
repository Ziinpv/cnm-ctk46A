import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatClientComponent from "@/components/chat-client";

export default async function ChatPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <p className="p-8 text-center text-gray-500">Chưa cấu hình Supabase</p>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Lấy display_name của user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="page-enter mx-auto w-full max-w-6xl p-6 md:py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Trò chuyện liên hệ</h1>
          <p className="text-sm text-gray-500 mt-1">Trao đổi thông tin trực tiếp, thống nhất địa điểm giao dịch trong khuôn viên DLU.</p>
        </div>
      </div>
      
      <ChatClientComponent currentUser={profile || user} />
    </main>
  );
}
