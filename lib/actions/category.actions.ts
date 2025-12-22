"use server";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "../types/auth";

export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  await shouldBeAdmin();

  const category = await db.category.create({ data });
  return parseStringify(category);
};

export const updateCategory = async ({
  id,
  data,
}: {
  id: number;
  data: Prisma.CategoryCreateInput;
}) => {
  await shouldBeAdmin();
  const category = await db.category.update({
    where: { id: Number(id) },
    data,
  });
  return parseStringify(category);
};

export const deleteCategory = async (id: number) => {
  await shouldBeAdmin();
  const deleteCategory = await db.category.delete({
    where: {
      id: Number(id),
    },
  });
  return parseStringify(deleteCategory);
};

export const getCategories = async () => {
  const categories = await db.category.findMany();
  return parseStringify(categories);
};
