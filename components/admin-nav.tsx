"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/products", label: "Quản lý sản phẩm" },
    { href: "/admin/categories", label: "Quản lý danh mục" },
    { href: "/admin/users", label: "Quản lý người dùng" },
  ];

  return (
    <div className="flex border-b border-gray-200 bg-white p-2 rounded-t-xl gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${
              isActive
                ? "bg-dlu-red/10 text-dlu-red"
                : "text-gray-600 hover:bg-gray-150/70"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
