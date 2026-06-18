import { createOrder, getOrders } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("[POST /api/orders] Received body:", body);

    if (!body.userId) {
      throw new Error("userId is required in request body");
    }
    if (!body.email) {
      throw new Error("email is required in request body");
    }
    if (body.amount === undefined || body.amount === null) {
      throw new Error("amount is required in request body");
    }

    const order = await createOrder(body);
    console.log("[POST /api/orders] Order created:", order);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/orders] Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order", error: error.toString() },
      { status: 400 }
    );
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
