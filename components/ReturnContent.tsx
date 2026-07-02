"use client";
import Link from "next/link";
import { format } from "date-fns";
import Stripe from "stripe";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

const ReturnContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return (
        <div className="bg-muted/30 min-h-screen flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border rounded-2xl shadow-sm p-8 max-w-md text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Invalid Order
            </h2>

            <p className="text-muted-foreground text-sm mt-2">
              No session ID found. Please return to checkout.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      );
    }

    const loadSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/api/stripe/get-checkout-session/${sessionId}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch session");
        }

        const data = await res.json();
        setSession(data.session);
      } catch {
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Spinner className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border rounded-2xl shadow-sm p-8 max-w-md text-center">
          <h2 className="text-lg font-semibold text-foreground">Error</h2>

          <p className="text-muted-foreground text-sm mt-2">
            {error || "Failed to load your order."}
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const lineItems = session.line_items?.data || [];
  const customerEmail = session.customer_details?.email;
  const totalAmount = (session.amount_total || 0) / 100;
  const orderDate = new Date(session.created * 1000);
  const orderId = session.id.slice(-8).toUpperCase();
  const shippingDetails =
    session.collected_information?.shipping_details?.address;
  console.log(session);
  return (
    <div className="bg-muted/30 min-h-screen flex items-center justify-center p-4 py-12">
      <div className="bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden w-full max-w-2xl">
        {/* Header */}
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-primary-foreground">
              Order Confirmation
            </h2>

            <span className="bg-primary-foreground/10 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              {session.payment_status === "paid" ? "Paid" : "Pending"}
            </span>
          </div>

          <p className="text-primary-foreground/80 text-sm mt-2">
            Thank you for your order!
          </p>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Order Number
              </p>
              <p className="text-foreground text-sm font-medium mt-2">
                #{orderId}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">Date</p>
              <p className="text-foreground text-sm font-medium mt-2">
                {format(orderDate, "dd MMM, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">Total</p>
              <p className="text-sm font-medium text-primary mt-2">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-muted rounded-xl p-4 mb-8">
            <h3 className="text-base font-medium text-foreground mb-4">
              Order Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Email
                </p>
                <p className="text-foreground text-sm font-medium mt-1">
                  {customerEmail}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Payment Status
                </p>
                <p className="text-foreground text-sm font-medium mt-1 capitalize">
                  {session.payment_status}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-muted rounded-xl p-4 mb-8">
            <h3 className="text-base font-medium text-foreground mb-4">
              Shipping Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  City
                </p>
                <p className="text-foreground text-sm font-medium mt-1">
                  {shippingDetails?.city || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Country
                </p>
                <p className="text-foreground text-sm font-medium mt-1">
                  {shippingDetails?.country || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Address
                </p>
                <p className="text-foreground text-sm font-medium mt-1">
                  {shippingDetails?.line1 || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Postal Code
                </p>
                <p className="text-foreground text-sm font-medium mt-1">
                  {shippingDetails?.postal_code || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-foreground mb-4">
              Order Items ({lineItems.length})
            </h3>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Product
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Price
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lineItems.map((item, index) => {
                    const itemPrice = (item.price?.unit_amount || 0) / 100;
                    const itemQty = item.quantity || 1;
                    const itemTotal = itemPrice * itemQty;

                    return (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-muted/50"
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground">
                            {item.description ||
                              item.price?.product_data?.name ||
                              "Product"}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <p className="text-sm text-muted-foreground">
                            {itemQty}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <p className="text-sm text-muted-foreground">
                            ${itemPrice.toFixed(2)}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-medium text-foreground">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-muted rounded-xl p-4">
            <h3 className="text-base font-medium text-foreground mb-4">
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground font-medium">
                  Subtotal
                </p>

                <p className="text-foreground text-sm font-semibold">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <p className="text-[15px] font-semibold text-foreground">
                  Total
                </p>

                <p className="text-[15px] font-semibold text-primary">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted px-6 py-4 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm font-medium">
              Need help?{" "}
              <a
                href="mailto:haithamb74@gmail.com"
                className="text-primary hover:underline"
              >
                Contact us
              </a>
            </p>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnContent;
