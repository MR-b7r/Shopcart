"use server";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "./payment.actions";

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  const newOrder = await db.order.create({ data });

  return parseStringify(newOrder);
};

export const getOrders = async () => {
  await shouldBeAdmin();

  const orders = await db.order.findMany();
  return parseStringify(orders);
};

export const getUserOrders = async ({
  userId,
  duration,
}: {
  userId: string;
  duration: string;
}) => {
  // check if userId is same as the logged in user

  const getFromDate = () => {
    const now = new Date();
    switch (duration) {
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "quarter":
        return new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "half-year":
        return new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
        break;

      case "all":
      default:
        return undefined;
    }
  };
  const orders = await db.order.findMany({
    where: {
      userId,
      ...(getFromDate && {
        createdAt: {
          gte: getFromDate(),
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      products: {
        select: {
          quantity: true,
          price: true,
          product: {
            select: {
              name: true,
              images: true,
              shortDescription: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return parseStringify(orders);
};
