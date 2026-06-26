"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, LogInIcon } from "lucide-react";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@/lib/types/cart";
import { ShippingFormHandle } from "@/components/ShippingForm";
import ShippingForm from "@/components/ShippingForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { CartItemCard } from "@/components/checkout/CartItemCard";
import StripePaymentForm from "@/components/StripePaymentForm";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { checkoutSteps } from "@/lib/checkoutSteps";

export default function CheckoutPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentStep = stepParam ? parseInt(stepParam) : 1;

  const { cart: items } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const shippingFormRef = useRef<ShippingFormHandle>(null);

  // Calculate totals
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const isEmpty = totalItems === 0;
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discountRate = promoApplied ? 0.2 : 0.1;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  // Navigation helpers
  const navigateToStep = useCallback(
    (step: number) => {
      router.push(`?step=${step}`, { scroll: false });
    },
    [router],
  );
  // Redirect to step 1 if cart is empty on steps 2 or 3
  useEffect(() => {
    if (isEmpty && currentStep > 1) {
      navigateToStep(1);
    }
  }, [isEmpty, currentStep, navigateToStep]);

  // Handle step progression with validation
  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      const stepConfig = checkoutSteps[currentStep - 1];

      // If step has a submit handler, execute it
      if (stepConfig.onSubmit) {
        const success = await stepConfig.onSubmit(shippingFormRef);
        if (!success) {
          setIsLoading(false);
          return;
        }
      }

      // Advance to next step
      if (currentStep < checkoutSteps.length) {
        navigateToStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Step progression error:", error);
    } finally {
      setIsLoading(false);
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

  const handleShippingSubmit = (data: ShippingFormInputs) => {
    setShippingForm(data);
  };

  // Get current step config
  const currentStepConfig = checkoutSteps[currentStep - 1];

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 pb-28 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Progress Stepper */}
        <CheckoutStepper currentStep={currentStep} />

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            {/* Step 1: Shopping Cart */}
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

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <ShippingForm
                ref={shippingFormRef}
                onSubmitSuccess={handleShippingSubmit}
              />
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && isLoaded && isSignedIn ? (
              <StripePaymentForm shippingForm={shippingForm!} />
            ) : (
              currentStep === 3 && (
                <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <LogInIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Looks like you haven&apos;t signed in. Please sign in to
                      continue with your purchase.
                    </p>
                  </div>
                  <SignedOut>
                    <button className="mt-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150">
                      <SignInButton />
                    </button>
                  </SignedOut>
                </div>
              )
            )}
          </div>

          {/* Order Summary Sidebar */}
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            nextLabel={currentStepConfig.buttonLabel}
            onNext={handleNextStep}
            onBack={currentStep > 1 ? handlePreviousStep : undefined}
            nextDisabled={isEmpty && currentStep === 1}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Mobile Sticky Footer */}
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
              disabled={isLoading}
              className="flex-1 max-w-xs h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 border border-border bg-background text-foreground hover:bg-muted active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button
            disabled={(isEmpty && currentStep === 1) || isLoading}
            onClick={handleNextStep}
            className="flex-1 max-w-xs h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Processing..." : "Next"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
