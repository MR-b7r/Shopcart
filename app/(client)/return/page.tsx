import Link from "next/link";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string | undefined }>;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_PAYMENT_SERVICE_URL!}/api/stripe/get-checkout-session/${session_id}`
  );
  const data = await res.json();
  console.log("data from return page", data);
  return (
    <div className="">
      <h1>Payment {data.status}</h1>
      <p>Payment status: {data.paymentStatus}</p>
      <Link href="/orders">See your orders</Link>
    </div>
  );
};

export default page;
