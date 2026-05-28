"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ActionState = { error?: string };

interface AuthFormProps {
  title: string;
  action: (state: any, formData: FormData) => Promise<any>;
  submitText: string;
}

const initialState: ActionState = {};

export function AuthForm({ title, action, submitText }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-dlu-green uppercase tracking-wide">{title}</h1>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Email (Sử dụng email @dlu.edu.vn nếu có)
        </label>
        <Input id="email" name="email" type="email" required className="w-full" placeholder="mssv@dlu.edu.vn" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
          Mật khẩu
        </label>
        <Input id="password" name="password" type="password" required className="w-full" />
      </div>
      {state?.error ? <p className="text-sm font-medium text-dlu-red bg-dlu-red/10 p-2 rounded-md">{state.error}</p> : null}
      
      <Button type="submit" disabled={pending} className="w-full bg-dlu-green hover:bg-dlu-green-hover text-white py-2.5 rounded-md mt-4">
        {pending ? "Đang xử lý..." : submitText}
      </Button>
    </form>
  );
}
