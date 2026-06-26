"use client";

import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  onNext: () => void | Promise<void>;
  onBack?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export function OrderSummary({
  subtotal,
  discount = 0,
  onNext,
  onBack,
  nextLabel,
  nextDisabled = false,
  isLoading = false,
}: OrderSummaryProps) {
  const total = subtotal - discount;
  const showBackButton = !!onBack;

  const handleNext = async () => {
    await onNext();
  };

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

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2">
          {showBackButton && (
            <button
              onClick={onBack}
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-150 border border-border bg-background text-foreground hover:bg-muted active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={nextDisabled || isLoading}
            className={cn(
              "w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-150",
              nextDisabled || isLoading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99] shadow-sm",
            )}
          >
            <span>{isLoading ? "Processing..." : nextLabel}</span>
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
