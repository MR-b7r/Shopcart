'use client';

import { Check, Lock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  onContinue: () => void;
  isLoading?: boolean;
}

export function OrderSummary({
  subtotal,
  discount = 0,
  shipping = 10,
  tax = 0,
  onContinue,
  isLoading = false,
}: OrderSummaryProps) {
  const total = subtotal - discount + shipping + tax;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Summary Card */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Order Details */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground">Order Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-primary">
                <span>Discount</span>
                <span className="font-medium">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-foreground">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {tax > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
          <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
            <p className="text-xs text-muted-foreground">
              {deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Continue to Shipping'}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Secure Checkout</p>
            <p className="text-xs text-muted-foreground">SSL Encrypted</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Stripe Verified</p>
            <p className="text-xs text-muted-foreground">Secure Payment</p>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="bg-secondary/30 rounded-lg p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Don't love it? <span className="font-medium text-primary">30-day free returns</span>
        </p>
      </div>
    </div>
  );
}
