"use server";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "../types/auth";

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  const { colors, images } = data;
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    throw new Error("Colors array is required!");
  }

  if (!images || typeof images !== "object") {
    throw new Error("Images object is required!");
  }
  const missingColors = colors.filter((color) => !(color in images));

  if (missingColors.length > 0) {
    throw new Error("Missing images for colors!");
  }

  const product = await db.product.create({ data });
  return parseStringify(product);
};

export const getProducts = async (filter) => {
  const { sort, category, search, limit } = filter;
  const orderBy = () => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
        break;
      case "desc":
        return { price: Prisma.SortOrder.desc };
        break;
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
        break;
      default:
        return { createdAt: Prisma.SortOrder.desc };
        break;
    }
  };
  const products = await db.product.findMany({
    where: {
      category: { slug: category as string },
      name: { contains: search as string, mode: "insensitive" },
    },
    orderBy: orderBy(),
    take: limit ? Number(limit) : undefined,
  });
  return parseStringify(products);
};

export const getProduct = async (id: string) => {
  const products = await db.product.findUnique({
    where: {
      id: id,
    },
  });
  return parseStringify(products);
};

export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: Prisma.ProductUpdateInput;
}) => {
  await shouldBeAdmin();
  const updatedProduct = await db.product.update({
    where: {
      id,
    },
    data,
  });
  return parseStringify(updatedProduct);
};

export const deleteProduct = async (id: string) => {
  await shouldBeAdmin();
  const deletedProduct = await db.product.delete({
    where: {
      id,
    },
  });
  return parseStringify(deletedProduct);
};
