"use client";

import { CheckCircle2, Minus, Plus, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyCart } from "./EmptyCart";
import { CartItemType } from "@/lib/types/cart";
import useCartStore from "@/stores/cartStore";
import { useState } from "react";

interface CartItemCardProps {
  items: CartItemType[];
  isEmpty: boolean;
  totalItems: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  handleApplyPromo: () => void;
  promoApplied: boolean;
}

export function CartItemCard({
  items,
  isEmpty,
  totalItems,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  promoApplied,
}: CartItemCardProps) {
  const { removeFromCart, updateQuantity } = useCartStore();
  const handleUpdateQuantity = (item: CartItemType, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      updateQuantity(item, newQuantity);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Shopping Cart</h2>
        <span className="text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full uppercase tracking-wide">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {isEmpty && <EmptyCart />}

      {/* Cart Item Cards */}
      {!isEmpty && (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <article
              key={item.id + item.selectedSize + item.selectedColor}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                  <img
                    src={
                      (item.images as Record<string, string>)?.[
                        item.selectedColor
                      ]
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-foreground leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                        {item.shortDescription}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-foreground flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted/40 border border-border rounded-md text-xs text-foreground">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{item.selectedSize}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 border border-border rounded-md text-xs text-foreground">
                      <span
                        className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                        style={{
                          backgroundColor: item.selectedColor,
                        }}
                      />
                      <span className="font-medium">{item.selectedColor}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                        <button
                          onClick={() => handleUpdateQuantity(item, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors duration-150 active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold text-foreground px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors duration-150 active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item)}
                      aria-label={`Remove ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Promo Code Row */}
      {!isEmpty && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Promo Code
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 h-10 px-3 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 h-10 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex-shrink-0"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className="text-xs text-accent-foreground mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Promo code applied — 20% off!</span>
            </p>
          )}
        </div>
      )}
    </>
  );
}
