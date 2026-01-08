import { auth } from "@clerk/nextjs/server";
import { createOrder, getOrders } from "@/lib/actions/order.actions";
import {
  createCheckoutSession,
  createStripeProduct,
  getStripeProductPrice,
} from "@/lib/actions/payment.actions";
import { NextResponse } from "next/server";
import { CartItemType } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const item = await req.json();

    const product = await createStripeProduct(item);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    const productPrice = await getStripeProductPrice("1235");
    return NextResponse.json(productPrice, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
