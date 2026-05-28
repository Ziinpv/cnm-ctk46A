"use client";

import { useActionState } from "react";
import { updateProductAction } from "@/lib/actions/product-edit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditProductFormProps {
  product: any;
  categories: any[];
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  // Bind Action với ID sản phẩm cần sửa
  const updateProductWithId = updateProductAction.bind(null, product.id);
  const [state, formAction, pending] = useActionState(updateProductWithId as any, { error: "" });

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 text-sm font-medium text-white bg-dlu-red rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Tiêu đề sản phẩm
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={product.title}
          required
          className="bg-white text-gray-900 border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Mô tả chi tiết
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product.description}
          required
          className="min-h-32 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-dlu-green focus:ring-1 focus:ring-dlu-green focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Giá (VNĐ)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={product.price}
            required
            className="bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Trạng thái sản phẩm
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product.status}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-dlu-green focus:ring-1 focus:ring-dlu-green focus:outline-none transition-colors"
            required
          >
            <option value="available">Đang bán (Available)</option>
            <option value="sold">Đã bán (Sold)</option>
            <option value="hidden">Ẩn bài viết (Hidden)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="category_id" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Danh mục
        </label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={product.category_id || ""}
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-dlu-green focus:ring-1 focus:ring-dlu-green focus:outline-none transition-colors"
          required
        >
          <option value="">Chọn danh mục</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Thay đổi hình ảnh (Để trống nếu giữ nguyên ảnh cũ)
        </label>
        {product.images?.[0] && (
          <div className="mb-3 relative w-32 h-24 border border-gray-200 rounded overflow-hidden bg-gray-50 shrink-0">
            <img src={product.images[0]} alt="Ảnh hiện tại" className="w-full h-full object-cover" />
          </div>
        )}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="bg-white text-gray-900 border-gray-300"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="flex-1 bg-dlu-green hover:bg-dlu-green-hover text-white py-2.5 rounded-md font-semibold text-base"
        >
          {pending ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
