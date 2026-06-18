"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, CreditCard, ShoppingBag, Truck } from "lucide-react";

interface StepItem {
  id: number;
  label: string;
  icon: React.ElementType;
}
export function CheckoutStepper({ currentStep }: { currentStep: number }) {
  const STEPS: StepItem[] = [
    {
      id: 1,
      label: "Shopping Cart",
      icon: ShoppingBag,
    },
    {
      id: 2,
      label: "Shipping Address",
      icon: Truck,
    },
    {
      id: 3,
      label: "Payment Method",
      icon: CreditCard,
    },
  ];

  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex items-center w-full">
        {STEPS.map((step, idx) => (
          <li
            key={step.id}
            className={cn(
              "flex items-center",
              idx < STEPS.length - 1 ? "flex-1" : "",
            )}
          >
            <div className="flex flex-col items-center gap-1.5 relative">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200",
                  currentStep === step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground",
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap transition-colors duration-200",
                  currentStep === step.id
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
              {currentStep === step.id && (
                <div className="h-0.5 w-full bg-primary rounded-full mt-0.5" />
              )}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4 mb-5 transition-colors duration-200",
                  currentStep > step.id ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
