"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  CreditCard,
  Lock,
  Plus,
  Minus,
  Tag,
  CheckCircle2,
  ArrowLeft,
  LogInIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/stores/cartStore";
import { CartItemType, ShippingFormInputs } from "@/lib/types/cart";
import ShippingForm from "@/components/ShippingForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { EmptyCart } from "@/components/checkout/EmptyCart";
import { CartItemCard } from "@/components/checkout/CartItemCard";
import StripePaymentForm from "@/components/StripePaymentForm";
import { SignedOut, SignInButton, useAuth, useUser } from "@clerk/nextjs";
export default function page() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentStep = stepParam ? parseInt(stepParam) : 1;
  const { cart: items } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  // Items length check with quantity
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const isEmpty = totalItems === 0;
  console.log(shippingForm);
  const navigateToStep = useCallback(
    (step: number) => {
      router.push(`?step=${step}`);
    },
    [router],
  );

  // Redirect to step 1 if cart is empty on steps 2 or 3
  useEffect(() => {
    if (isEmpty && currentStep > 1) {
      navigateToStep(1);
    }
  }, [isEmpty, currentStep, navigateToStep]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      navigateToStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discountRate = promoApplied ? 0.2 : 0.1;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 pb-28 md:pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span>
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </span>
          </p>
        </div>

        <CheckoutStepper currentStep={currentStep} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            {/* STEP 1: Shopping Cart */}
            {currentStep === 1 && (
              <CartItemCard
                items={items}
                isEmpty={isEmpty}
                totalItems={totalItems}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                handleApplyPromo={handleApplyPromo}
                promoApplied={promoApplied}
              />
            )}

            {/* STEP 2: Shipping Address */}
            {currentStep === 2 && (
              <ShippingForm setShippingForm={setShippingForm} />
            )}

            {/* STEP 3: Payment Method */}
            {currentStep === 3 && isLoaded && isSignedIn ? (
              <StripePaymentForm shippingForm={shippingForm} />
            ) : (
              currentStep === 3 && (
                <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <LogInIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Looks like you haven't signed in. Please sign in to
                      continue with your purchase.
                    </p>
                  </div>
                  <button className="mt-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150">
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                  </button>
                </div>
              )
            )}
          </div>
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            currentStep={currentStep}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
            isEmpty={isEmpty}
          />
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-4 md:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
            Total
          </span>
          <span className="text-lg font-bold text-foreground">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2 flex-1">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex-1 max-w-xs h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 border border-border bg-background text-foreground hover:bg-muted active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button
            disabled={isEmpty && currentStep === 1}
            onClick={handleNextStep}
            type="submit"
            form={`${currentStep === 2 && "shipping-form"}`}
            className={cn(
              "flex-1 max-w-xs h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150",
              isEmpty && currentStep === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",
            )}
          >
            <span>
              {currentStep === 1
                ? "Continue"
                : currentStep === 2
                  ? "Payment"
                  : "Complete"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
