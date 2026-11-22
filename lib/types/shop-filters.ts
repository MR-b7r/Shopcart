import { z } from "zod";

const optionalPrice = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce.number().int().min(0).max(2_147_483_647).optional(),
);

export const shopFiltersSchema = z
  .object({
    category: z.enum(["all", "t-shirts", "shoes", "accessories", "bags", "dresses", "jackets", "gloves"]).catch("all"),
    search: z.string().trim().max(100).catch(""),
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
    sort: z.enum(["newest", "oldest", "price-asc", "price-desc"]).catch("newest"),
    page: z.coerce.number().int().min(1).max(10_000).catch(1),
  })
  .transform((filters) => ({
    ...filters,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    page: Number.isFinite(filters.page) ? filters.page : 1,
  }));

export type ShopFilters = z.infer<typeof shopFiltersSchema>;
export const SHOP_PAGE_SIZE = 12;
