"use client";

import { adminUpdateUserRole } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleRoleChange = async (targetUserId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    if (targetUserId === currentUserId) {
      alert("Bạn không thể tự hạ quyền hạn Admin của chính mình!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn thay đổi quyền hạn người dùng này thành "${newRole === 'admin' ? 'Quản trị viên' : 'Sinh viên thông thường'}"?`)) {
      return;
    }

    try {
      setLoadingMap(prev => ({ ...prev, [targetUserId]: true }));
      const res = await adminUpdateUserRole(targetUserId, newRole);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
        setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      alert("Lỗi.");
    } finally {
      setLoadingMap(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  return (
    <div className="overflow-x-auto">
      {users.length === 0 ? (
        <p className="p-8 text-center text-gray-500 text-sm">Chưa có người dùng nào đăng ký.</p>
      ) : (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
              <th className="p-4">Tên hiển thị</th>
              <th className="p-4">Số điện thoại / Zalo</th>
              <th className="p-4">Ngày đăng ký</th>
              <th className="p-4">Quyền hạn</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-dlu-green/10 flex items-center justify-center font-bold text-dlu-green shrink-0">
                      {user.display_name ? user.display_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <span>{user.display_name || "Chưa đặt tên"}</span>
                      {isSelf && <span className="text-[10px] bg-red-100 text-red-700 font-bold rounded px-1.5 py-0.5 ml-2 uppercase shrink-0">Bạn</span>}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium font-data">
                    {user.phone || "Chưa cập nhật"}
                  </td>
                  <td className="p-4 text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td className="p-4">
                    {user.role === "admin" ? (
                      <Badge className="bg-red-100 text-red-800 border-none font-bold">Admin</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 border-none">Sinh viên</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      disabled={loadingMap[user.id] || isSelf}
                      variant="outline"
                      size="sm"
                      className={`text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'text-gray-600 hover:bg-gray-50' 
                          : 'text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5'
                      }`}
                    >
                      {loadingMap[user.id] ? "Đang xử lý..." : user.role === "admin" ? "Hạ xuống Sinh viên" : "Nâng cấp Admin"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
