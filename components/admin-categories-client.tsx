"use client";

import { adminAddCategory, adminUpdateCategory, adminDeleteCategory } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || loading) return;

    try {
      setLoading(true);
      const res = await adminAddCategory(newCatName);
      if (res?.error) {
        alert(res.error);
      } else {
        setNewCatName("");
        router.refresh();
        // Để đơn giản, reload lại trang để lấy ID thực tế từ database
        window.location.reload();
      }
    } catch (err) {
      alert("Lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim() || loading) return;

    try {
      setLoading(true);
      const res = await adminUpdateCategory(id, editingName);
      if (res?.error) {
        alert(res.error);
      } else {
        setEditingId(null);
        router.refresh();
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editingName } : c));
      }
    } catch (err) {
      alert("Lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa danh mục này có thể ảnh hưởng đến các sản phẩm đang liên kết. Bạn có chắc chắn muốn xóa?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await adminDeleteCategory(id);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      
      {/* Form thêm danh mục */}
      <form onSubmit={handleAdd} className="bg-gray-50 border border-gray-150 rounded-xl p-5 max-w-xl">
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Thêm danh mục mới</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Tên danh mục (ví dụ: Giáo trình học tập)..."
            disabled={loading}
            className="flex-1 bg-white border-gray-200"
            required
          />
          <Button
            type="submit"
            disabled={loading || !newCatName.trim()}
            className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold shrink-0"
          >
            Thêm mới
          </Button>
        </div>
      </form>

      {/* Danh sách danh mục */}
      <div className="max-w-3xl">
        <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Danh sách hiện tại</h3>
        
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có danh mục nào được khởi tạo.</p>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white shadow-xs">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50/30">
                {editingId === cat.id ? (
                  <div className="flex gap-2 flex-1 mr-4">
                    <Input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={loading}
                      className="bg-white border-gray-200 flex-1 max-w-sm"
                    />
                    <Button
                      onClick={() => handleUpdate(cat.id)}
                      disabled={loading || !editingName.trim()}
                      size="sm"
                      className="bg-dlu-green hover:bg-dlu-green-hover text-white font-bold text-xs"
                    >
                      Lưu
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      size="sm"
                      className="text-gray-500 text-xs font-semibold"
                    >
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-gray-900 text-sm">{cat.name}</span>
                    <div className="space-x-2">
                      <Button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditingName(cat.name);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs font-semibold"
                      >
                        Sửa
                      </Button>
                      <Button
                        onClick={() => handleDelete(cat.id)}
                        variant="outline"
                        size="sm"
                        className="text-dlu-red border-dlu-red/20 bg-white hover:bg-dlu-red/5 font-semibold text-xs"
                      >
                        Xóa
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
