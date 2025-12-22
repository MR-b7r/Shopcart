import { createOrder, getOrders } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
