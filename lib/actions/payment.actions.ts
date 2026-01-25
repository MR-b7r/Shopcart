"use server";

import { stripe } from "../stripe";
import { CartItemType } from "../types";
import { parseStringify } from "../utils";

import { auth } from "@clerk/nextjs/server";
import type { JwtSessionClaims } from "@clerk/nextjs/server";

export async function shouldBeAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const claims = sessionClaims as JwtSessionClaims & {
    metadata?: { role?: "admin" | "user" };
  };

  if (claims.metadata?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return userId;
}

export async function createStripeProduct(item) {
  const product = await stripe.products.create({
    id: item.id,
    name: item.name,
    default_price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
    },
  });

  return parseStringify(product);
}

export async function getStripeProductPrice(productId: string) {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
    });
    return res.data[0]?.unit_amount;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteStripeProduct(productId: string) {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function createCheckoutSession({
  cart,
  userId,
}: {
  cart: CartItemType[];
  userId: string;
}) {
  console.log("createCheckoutSession called with:", userId);
  const lineItems = await Promise.all(
    cart.map(async (item) => {
      const unitAmount = await getStripeProductPrice(item.id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
      };
    }),
  );

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    client_reference_id: userId,
    mode: "payment",
    ui_mode: "custom",
    return_url: `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  return parseStringify({ checkoutSessionClientSecret: session.client_secret });
}
