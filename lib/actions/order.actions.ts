"use server";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "../types/auth";

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  const newOrder = await db.order.create({ data });

  return parseStringify(newOrder);
};

export const getOrders = async () => {
  await shouldBeAdmin();

  const orders = await db.order.findMany();
  return parseStringify(orders);
};

export const getUserOrders = async (userId: string) => {
  // check if userId is same as the logged in user

  const orders = await db.order.findMany({
    where: { userId },
  });
  return parseStringify(orders);
};
