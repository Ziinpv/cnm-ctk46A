"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sendMessageAction } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatClientComponent({ currentUser }: { currentUser: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id");

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // 1. Tải danh sách cuộc trò chuyện
  useEffect(() => {
    if (!supabase) return;

    const fetchConversations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          buyer:profiles!conversations_buyer_id_fkey(id, display_name),
          seller:profiles!conversations_seller_id_fkey(id, display_name),
          product:products(id, title, price, images)
        `)
        .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setConversations(data);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [currentUser.id, activeId]);

  // 2. Tải tin nhắn của cuộc trò chuyện đang active
  useEffect(() => {
    if (!supabase || !activeId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    fetchMessages();

    // Lắng nghe realtime tin nhắn mới qua Supabase Realtime
    const channel = supabase
      .channel(`realtime-messages-${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Tránh duplicate tin nhắn
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeId]);

  // Tự động cuộn xuống cuối khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !inputMessage.trim() || sending) return;

    try {
      setSending(true);
      const text = inputMessage;
      setInputMessage("");
      
      const res = await sendMessageAction(activeId, text);
      if (res?.error) {
        alert(res.error);
        setInputMessage(text); // Khôi phục lại tin nhắn nếu lỗi
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId);
  const activePartner = activeConversation
    ? activeConversation.buyer.id === currentUser.id
      ? activeConversation.seller
      : activeConversation.buyer
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm h-[650px]">
      
      {/* CỘT TRÁI: DANH SÁCH CUỘC HỘI THOẠI */}
      <div className="border-r border-gray-200 flex flex-col h-full bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-heading text-lg font-bold text-dlu-green uppercase tracking-wider">Tin nhắn của bạn</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {loading && conversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">Đang tải cuộc trò chuyện...</p>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm font-medium">Chưa có cuộc trò chuyện nào.</p>
              <p className="text-xs mt-1 text-gray-400">Hãy tìm sản phẩm và nhắn tin cho người bán!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const partner = conv.buyer.id === currentUser.id ? conv.seller : conv.buyer;
              const isActive = conv.id === activeId;
              const productImg = conv.product?.images?.[0] || "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=100&auto=format&fit=crop";

              return (
                <button
                  key={conv.id}
                  onClick={() => router.push(`/dashboard/chat?id=${conv.id}`)}
                  className={`w-full text-left p-4 transition-colors flex gap-3 items-center ${
                    isActive ? "bg-white border-l-4 border-dlu-green" : "hover:bg-gray-100/70"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-dlu-green/10 flex items-center justify-center font-bold text-dlu-green shrink-0">
                    {partner?.display_name ? partner.display_name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{partner?.display_name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.product?.title || "Sản phẩm khác"}</p>
                  </div>
                  <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-gray-100 relative bg-gray-50">
                    <img src={productImg} alt="" className="w-full h-full object-cover" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* CỘT PHẢI: KHUNG CHI TIẾT CHAT */}
      <div className="col-span-2 flex flex-col h-full bg-white">
        {activeId && activeConversation ? (
          <>
            {/* Header chat */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dlu-green text-white flex items-center justify-center font-bold">
                  {activePartner?.display_name ? activePartner.display_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{activePartner?.display_name}</h3>
                  <p className="text-xs text-dlu-green font-medium">Đang liên hệ về: {activeConversation.product?.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 max-w-xs text-right shrink-0">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{activeConversation.product?.title}</p>
                  <p className="text-[11px] font-bold text-dlu-red">{activeConversation.product?.price?.toLocaleString()} đ</p>
                </div>
                <Button
                  onClick={() => router.push(`/products/${activeConversation.product?.id}`)}
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold px-2.5 h-8 text-dlu-green border-dlu-green/20 bg-white hover:bg-dlu-green/5"
                >
                  Xem
                </Button>
              </div>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-medium">Bắt đầu cuộc trò chuyện.</p>
                  <p className="text-xs mt-1">Hãy gửi tin nhắn đầu tiên để liên hệ trao đổi trực tiếp!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                          isMe
                            ? "bg-dlu-green text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-150 rounded-bl-none"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span
                          className={`text-[9px] block mt-1 text-right ${
                            isMe ? "text-white/70" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập tin nhắn */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập nội dung tin nhắn..."
                disabled={sending}
                className="flex-1 bg-gray-50 focus:bg-white border-gray-200"
              />
              <Button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold"
              >
                Gửi
              </Button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <h3 className="font-heading text-lg font-bold text-gray-700">Khung chat trống</h3>
            <p className="text-sm mt-1 max-w-sm">Hãy chọn một cuộc hội thoại ở cột bên trái hoặc bấm "Nhắn tin người bán" từ trang sản phẩm.</p>
          </div>
        )}
      </div>

    </div>
  );
}
