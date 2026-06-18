import Link from "next/link";
import { format } from "date-fns";
import Stripe from "stripe";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string | undefined }>;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Invalid Order
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            No session ID found. Please return to checkout.
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  let session: Stripe.Checkout.Session | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(
      `${process.env
        .NEXT_PUBLIC_PAYMENT_SERVICE_URL!}/api/stripe/get-checkout-session/${session_id}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch session");
    }

    const data = await res.json();
    session = data.session;
  } catch {
    error = "Failed to load order details. Please try again later.";
  }

  if (error || !session) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-lg font-semibold text-slate-900">Error</h2>
          <p className="text-slate-500 text-sm mt-2">
            {error || "Failed to load your order."}
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition duration-200"
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

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">
              Order Confirmation
            </h2>
            <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {session.payment_status === "paid" ? "Paid" : "Pending"}
            </span>
          </div>
          <p className="text-slate-200 text-sm mt-2">
            Thank you for your order!
          </p>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <p className="text-slate-500 text-sm font-medium">Order Number</p>
              <p className="text-slate-900 text-sm font-medium mt-2">
                #{orderId}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Date</p>
              <p className="text-slate-900 text-sm font-medium mt-2">
                {format(orderDate, "dd MMM, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total</p>
              <p className="text-sm font-medium text-indigo-700 mt-2">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-100 rounded-xl p-4 mb-8">
            <h3 className="text-base font-medium text-slate-900 mb-4">
              Order Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-sm font-medium">Email</p>
                <p className="text-slate-900 text-sm font-medium mt-1">
                  {customerEmail}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Payment Status
                </p>
                <p className="text-slate-900 text-sm font-medium mt-1 capitalize">
                  {session.payment_status}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-slate-900 mb-4">
              Order Items ({lineItems.length})
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                      Product
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-700">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">
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
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-900">
                            {item.description ||
                              item.price?.product_data?.name ||
                              "Product"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="text-sm text-slate-600">{itemQty}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm text-slate-600">
                            ${itemPrice.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-medium text-slate-900">
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
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="text-base font-medium text-slate-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-slate-600 font-medium">Subtotal</p>
                <p className="text-slate-900 text-sm font-semibold">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-300">
                <p className="text-[15px] font-semibold text-slate-900">
                  Total
                </p>
                <p className="text-[15px] font-semibold text-indigo-700">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              Need help?{" "}
              <a
                href="mailto:haithamb74@gmail.com"
                className="text-indigo-700 hover:underline"
              >
                Contact us
              </a>
            </p>
            <Link
              href="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[15px] py-2 px-4 rounded-lg cursor-pointer transition duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
