export const runtime = "nodejs";

import { createOrder } from "@/lib/actions/order.actions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webHookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      const order = await createOrder({
        userId: session.client_reference_id!,
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        status: session.payment_status === "paid" ? "success" : "failed",
        products: {
          create: lineItems.data.map((item) => ({
            productId:
              (item.price?.metadata?.productId as string) ||
              "cmjdcrpjz0001f8vxv2ec8a2g",
            quantity: item.quantity ?? 1,
            price: item.price?.unit_amount ?? 0,
          })),
        },
      });
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    );
  }
}
