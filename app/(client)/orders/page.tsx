import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { getUserOrders } from "@/lib/actions/order.actions";
import { auth } from "@clerk/nextjs/server";
import { Order } from "@prisma/client";
import Link from "next/link";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ duration: string }>;
}) => {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }
  const duration = (await searchParams).duration || "all";
  const orders = await getUserOrders({ userId, duration });

  if (!orders) {
    return <div className="">No orders found!</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <span className="md:text-2xl text-lg font-bold md:tracking-wide text-foreground">
          Your Orders
        </span>

        <div className="flex justify-end items-center flex-wrap gap-3">
          <span className="font-semibold text-sm text-muted-foreground">
            Found{" "}
            <span className="font-bold text-foreground">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </span>{" "}
            in
          </span>

          <Filter filterType="duration" defaultValue="all" />
        </div>
      </div>

      {orders.map((order: Order) => (
        <div
          key={order.id}
          className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
        >
          {/* Order Header */}
          <div className="bg-muted px-4 py-3 flex flex-wrap justify-between gap-4 text-xs font-semibold text-muted-foreground">
            <div>
              <p>ORDER DATE</p>
              <p className="mt-1 text-sm text-foreground">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>

            <div>
              <p>TOTAL</p>
              <p className="mt-1 text-sm text-foreground">
                ${order.amount / 100}
              </p>
            </div>

            <div>
              <p>STATUS</p>
              <p className="mt-1 text-sm text-primary capitalize">
                {order.status}
              </p>
            </div>

            <div className="ml-auto text-right">
              <p>ORDER # {order.id}</p>

              <Link
                href={`/orders/${order.id}`}
                className="mt-1 text-primary hover:underline"
              >
                View order details
              </Link>
            </div>
          </div>

          {/* Order Body */}
          <div className="px-3">
            <div className="divide-y divide-border">
              {order.products?.map((product) => (
                <div
                  key={product.product.id}
                  className="flex items-start gap-5 p-4"
                >
                  <img
                    src={
                      Object.values(
                        product.product.images as Record<string, string>,
                      )[0]
                    }
                    alt={product.product.name}
                    className="h-24 w-24 rounded-lg border object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/products/${product.product.id}`}
                      className="text-base font-semibold text-primary hover:underline"
                    >
                      {product.product.name}
                    </Link>

                    <p className="mt-1 text-xs tracking-wide text-muted-foreground">
                      {product.product.shortDescription}
                    </p>

                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      Quantity: {product.quantity}
                    </p>

                    <p className="mt-1 font-semibold text-foreground">
                      Price: ${(product.price * product.quantity) / 100}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <Link href={`/products/${product.product.id}`}>
                        <Button size="lg">Buy it again</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
