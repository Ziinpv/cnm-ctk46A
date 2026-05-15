import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(5, "Tieu de toi thieu 5 ky tu"),
  description: z.string().min(10, "Mo ta toi thieu 10 ky tu"),
  price: z.coerce.number().int().nonnegative(),
  category_id: z.string().uuid("Category khong hop le"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
