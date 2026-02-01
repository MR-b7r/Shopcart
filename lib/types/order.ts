import type { Order, OrderItem, OrderStatus } from "@prisma/client";
import z from "zod";

export type OrderType = Order & {};
export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};
