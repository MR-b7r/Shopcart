export const runtime = "nodejs";
import { createOrder, sendOrderEmail } from "@/lib/actions/order.actions";
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
      if (
        !event.data.object.customer_details?.email ||
        !event.data.object.client_reference_id
      ) {
        throw new Error("Missing user email or client reference ID");
      }
      const session = event.data.object as Stripe.Checkout.Session;

      // Start fetching line items early (async-api-routes pattern)
      const lineItemsPromise = stripe.checkout.sessions.listLineItems(
        session.id,
      );

      console.log("=== WEBHOOK DEBUG ===");
      console.log("Session ID:", session.id);
      console.log("Client Reference ID (userId):", session.client_reference_id);
      console.log("Customer Email:", session.customer_details?.email);
      console.log("Amount Total:", session.amount_total);
      console.log("Payment Status:", session.payment_status);

      // Await line items
      const lineItems = await lineItemsPromise;
      console.log("Number of line items:", lineItems.data.length);

      // Extract and validate product IDs from line items (async-cheap-condition-before-await)
      if (lineItems.data.length === 0) {
        throw new Error("No line items found in checkout session");
      }

      const stripeProducts = lineItems.data.map((item, index) => {
        const productId = item.price?.product?.metadata?.productId as string;
        
        console.log(`Line item ${index}:`, {
          description: item.description,
          quantity: item.quantity,
          unitAmount: item.price?.unit_amount,
          productId: productId,
          hasMetadata: !!item.price?.product?.metadata,
          metadata: item.price?.product?.metadata,
        });

        if (!productId) {
          throw new Error(
            `Product ID not found in line item ${index}. Stripe metadata: ${JSON.stringify(
              item.price?.product?.metadata,
            )}. Make sure products in Stripe have 'productId' in their metadata.`,
          );
        }

        return {
          productId,
          quantity: item.quantity ?? 1,
          price: item.price?.unit_amount ?? 0,
        };
      });

      console.log(
        "Products to create:",
        JSON.stringify(stripeProducts, null, 2),
      );

      const orderData = {
        userId: session.client_reference_id!,
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        status: session.payment_status === "paid" ? "success" : "failed",
        products: {
          create: stripeProducts,
        },
      };

      console.log("Order data structure:", JSON.stringify(orderData, null, 2));

      try {
        const order = await createOrder(orderData);
        console.log("✅ Order created successfully:", order.id);

        // Send order confirmation email in parallel (async-parallel pattern)
        const orderProducts = lineItems.data.map((item) => ({
          name: item.price?.product?.name || "Product",
          quantity: item.quantity ?? 1,
          price: item.price?.unit_amount ?? 0,
        }));

        // Don't await email - return response immediately (async-api-routes pattern)
        sendOrderEmail(
          session.customer_details?.email!,
          orderProducts,
          session.amount_total!,
        ).catch((emailError) => {
          console.error("❌ Error sending confirmation email:", emailError.message);
        });
      } catch (createError: any) {
        console.error(
          "❌ Error creating order:",
          createError.message,
        );
        console.error("Full error:", createError);
        throw createError;
      }
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    console.error("Full error:", err);

    return NextResponse.json(
      {
        message: "Something went wrong",
        ok: false,
        error: err.message,
      },
      { status: 500 },
    );
  }
}
