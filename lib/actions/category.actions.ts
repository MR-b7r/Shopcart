"use server";
import { db } from "@/app/db";
import { Prisma } from "../generated/prisma/client";
import { parseStringify } from "../utils";

export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  const category = await db.category.create({ data });
  return parseStringify(category);
};

export const getCategories = async () => {
  const categories = await db.category.findMany();
  return parseStringify(categories);
};
