import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau toi thieu 6 ky tu"),
});

export type AuthInput = z.infer<typeof authSchema>;
