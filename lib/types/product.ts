import type { Product, Category } from "@prisma/client";
import z from "zod";

export type ProductType = Product;
export type CategoryType = Category;

export type stripeProductType = {
  id: string;
  name: string;
  price: number;
};
