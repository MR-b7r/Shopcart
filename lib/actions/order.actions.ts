"use server";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "./payment.actions";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "../types";

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  const newOrder = await db.order.create({ data });

  return parseStringify(newOrder);
};

export const getOrders = async (limit?: number) => {
  await shouldBeAdmin();

  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit ? Number(limit) : undefined,
  });
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

export const orderChart = async () => {
  await shouldBeAdmin();
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  const orders = await db.order.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
        lte: now,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const map = new Map<string, { total: number; successful: number }>();

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!map.has(key)) map.set(key, { total: 0, successful: 0 });
    const entry = map.get(key)!;

    entry.total++;
    if (o.status === "success") entry.successful++;
  }

  const results = [];

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const data = map.get(key);

    results.push({
      month: monthNames[d.getMonth()],
      total: data?.total ?? 0,
      successful: data?.successful ?? 0,
    });
  }

  return parseStringify(results);
};
