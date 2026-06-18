"use client";

import { ArrowRight, Check, Lock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  currentStep: number;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
  isEmpty: boolean;
}

export function OrderSummary({
  subtotal,
  discount = 0,
  currentStep,
  handlePreviousStep,
  handleNextStep,
  isEmpty,
}: OrderSummaryProps) {
  const total = subtotal - discount;

  return (
    <aside className="w-full lg:w-[30%]">
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:sticky lg:top-6 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

        {/* Line Items */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded uppercase tracking-wide">
                SAVE10
              </span>
            </div>
            <span className="font-medium text-accent-foreground">
              −${discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-accent-foreground">FREE</span>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold text-foreground">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-2">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-150 border border-border bg-background text-foreground hover:bg-muted active:scale-[0.99]"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back</span>
            </button>
          )}
          <button
            type="submit"
            form={`${currentStep === 2 && "shipping-form"}`}
            disabled={isEmpty && currentStep === 1}
            onClick={handleNextStep}
            className={cn(
              "w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-150",
              isEmpty && currentStep === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99] shadow-sm",
            )}
          >
            <span>
              {currentStep === 1
                ? "Continue to Shipping"
                : currentStep === 2
                  ? "Continue to Payment"
                  : "Complete Order"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Secure Checkout</span>
            </span>
            <span className="text-border">|</span>
            <span>Free Returns</span>
          </div>
          <p className="text-[11px] text-center text-muted-foreground">
            <span>Payments processed securely via Stripe</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
