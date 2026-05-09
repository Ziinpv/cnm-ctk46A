import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <main className="page-enter mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md items-center p-6">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <AuthForm title="Đăng ký tài khoản" action={registerAction} submitText="Đăng ký" />
        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link className="font-semibold text-dlu-green hover:underline" href="/login">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
