"use client";
import useCartStore from "@/stores/cartStore";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();
  if (!hasHydrated) return null;
  const cartLength = cart.reduce((acc, cur) => acc + cur.quantity, 0);
  return (
    <Link
      href="/cart"
      className="relative p-2 hover:text-muted-foreground transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {cartLength}
      </span>
    </Link>
  );
};

export default ShoppingCartIcon;
