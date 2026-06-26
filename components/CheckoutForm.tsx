"use client";
import React, { useState } from "react";
import { ShippingFormInputs } from "@/lib/types";
import { ConfirmError } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";

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
      console.log("Error confirming checkout:", res.error);
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <Button
        className="my-5 px-3 py-2"
        size={"lg"}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Loading..." : "Pay now"}
      </Button>

      {error && (
        <div className="text-red-500 text-sm font-semibold">
          {error.message}
        </div>
      )}
    </form>
  );
};
export default CheckoutForm;
