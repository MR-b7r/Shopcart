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
        <span className="md:text-2xl text-lg font-bold md:tracking-wide text-gray-700">Your Orders</span>

        <div className="flex justify-end items-center flex-wrap gap-3">
          <span className="font-semibold text-sm text-gray-600">
            Found{" "}
            <span className="font-bold text-gray-700">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </span>{" "}
            in{" "}
          </span>
          <Filter filterType="duration" defaultValue="all" />
        </div>
      </div>
      {orders.map((order: Order) => (
        <div
          key={order.id}
          className="border-2 border-slate-100 rounded-lg overflow-hidden bg-background shadow-slate-50 shadow-sm"
        >
          {/* Order Header */}
          <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between text-[12px] font-semibold gap-4 text-gray-500">
            <div>
              <p className="text-gray-500">ORDER DATE</p>
              <p className="text-sm">
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
              <p className="text-gray-500">TOTAL</p>
              <p className="text-sm">${order.amount / 100}</p>
            </div>

            <div>
              <p className="text-gray-500">STATUS</p>
              <p className="text-sm text-blue-600">{order.status}</p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-[12px]">ORDER # {order.id}</p>
              <div className="space-x-3">
                <button className="text-blue-600 hover:underline">
                  View order details
                </button>
              </div>
            </div>
          </div>

          {/* Order Body */}
          <div className="px-3">
            <div className="space-y-4 divide-y divide-slate-100">
              {order?.products?.map((product) => (
                <div
                  key={product.product.id}
                  className="flex items-start gap-5 p-3"
                >
                  <img
                    src={
                      Object.values(
                        product.product.images as Record<string, string>,
                      )[0]
                    }
                    alt={product.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />

                  <div className="flex-1 mb-2">
                    <Link
                      className="text-[16px] font-semibold text-blue-700 hover:underline cursor-pointer"
                      href={`/products/${product.product.id}`}
                    >
                      {product.product.name}
                    </Link>
                    <p className="text-[12px] text-gray-400 tracking-wide">
                      {product.product?.shortDescription}
                    </p>
                    <p className="text-sm font-semibold text-gray-500 tracking-wide mt-1">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-gray-500 font-semibold mt-1">
                      Price: ${(product.price * product.quantity) / 100}
                    </p>
                    <div className="flex justify-end mt-1 ml-1">
                      <Link href={`/products/${product.product.id}`}>
                        <Button
                          variant={"default"}
                          size={"lg"}
                          className="rounded-md cursor-pointer"
                        >
                          Buy it again
                        </Button>
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
