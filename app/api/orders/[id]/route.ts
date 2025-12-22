import { getUserOrders } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const orders = await getUserOrders(id);
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
