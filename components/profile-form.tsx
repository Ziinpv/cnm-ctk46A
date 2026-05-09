"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/lib/actions/profile";

export default function ProfileForm({ profile }: { profile: any }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="display_name" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Tên hiển thị
        </label>
        <Input 
          id="display_name" 
          name="display_name" 
          defaultValue={profile?.display_name || ""} 
          required 
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Số điện thoại liên hệ
        </label>
        <Input 
          id="phone" 
          name="phone" 
          defaultValue={profile?.phone || ""} 
        />
      </div>
      
      {state.error && <p className="text-sm font-medium text-dlu-red bg-dlu-red/10 p-2 rounded-md">{state.error}</p>}
      {state.message && <p className="text-sm font-medium text-dlu-green bg-dlu-green/10 p-2 rounded-md">{state.message}</p>}
      
      <Button type="submit" disabled={pending} className="w-full bg-dlu-green hover:bg-dlu-green-hover text-white py-2.5 mt-2 rounded-md font-semibold text-base">
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
