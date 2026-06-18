"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useAuth } from "@clerk/nextjs";
import { CartItemType, ShippingFormInputs } from "@/lib/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripe = loadStripe(
  "pk_test_51ShVvX6AtuRIc0MX5YF3HCD9ZlxHGCVhx5Pvlu5Aq8rnvzMw3CG6bItipSWN5yCeDgjlEy3vIQnO1aEmUMcSNmOJ00qCTZFoG1",
);

const fetchClientSecret = async (cart: CartItemType[], token: string) => {
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_PAYMENT_SERVICE_URL!}/api/stripe/create-checkout-session`,
    {
      method: "POST",
      credentials: "include",

      body: JSON.stringify({
        cart,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create checkout session");
  }

  const data = await res.json();
  if (!data.checkoutSessionClientSecret) {
    throw new Error("Missing client secret from Stripe response");
  }

  return data.checkoutSessionClientSecret;
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();

  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, []);
  console.log(shippingForm, token, cart);
  if (!token) {
    return <div className="">Loading...</div>;
  }
  return (
    <CheckoutProvider
      stripe={stripe}
      options={{ clientSecret: fetchClientSecret(cart, token) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
