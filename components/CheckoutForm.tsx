"use client";
import React, { useState } from "react";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";

import { ShippingFormInputs } from "@/lib/types";
import { ConfirmError } from "@stripe/stripe-js";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null);

  const handleClick = async () => {
    setLoading(true);
    await checkout.checkout.updateEmail(shippingForm.email);
    await checkout.checkout.updateShippingAddress({
      name: "shipping_address",
      address: {
        line1: shippingForm.address,
        city: shippingForm.city,
        country: "EG",
      },
    });

    const res = await checkout.checkout.confirm();
    if (res.type === "error") {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}>
        {loading ? "Loading..." : "Pay"}
      </button>
      {error && <div className="">{error.message}</div>}
    </form>
  );
};
export default CheckoutForm;
