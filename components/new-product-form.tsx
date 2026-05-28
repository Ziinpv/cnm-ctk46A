"use client";

import { useActionState } from "react";
import { createProductAction } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewProductForm({ categories }: { categories: any[] }) {
  const [state, formAction, pending] = useActionState(createProductAction as any, { error: "" });

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 text-sm font-medium text-white bg-dlu-red rounded-md">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Tiêu đề
        </label>
        <Input id="title" name="title" required className="bg-white text-gray-900 border-gray-300" />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Mô tả chi tiết
        </label>
        <textarea
          id="description"
          name="description"
          required
          className="min-h-32 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-dlu-green focus:ring-1 focus:ring-dlu-green focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="price" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Giá (VNĐ)
        </label>
        <Input id="price" name="price" type="number" min={0} required className="bg-white text-gray-900 border-gray-300" />
      </div>
      <div>
        <label htmlFor="category_id" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Danh mục
        </label>
        <select
          id="category_id"
          name="category_id"
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
          Hình ảnh sản phẩm
        </label>
        <Input id="image" name="image" type="file" accept="image/*" required className="bg-white text-gray-900 border-gray-300" />
      </div>
      <Button type="submit" disabled={pending} className="w-full bg-dlu-green hover:bg-dlu-green-hover text-white py-2.5 mt-2 rounded-md font-semibold text-base">
        {pending ? "Đang xử lý..." : "Đăng bài"}
      </Button>
    </form>
  );
}
