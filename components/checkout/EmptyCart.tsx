"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { CartSkeleton } from "./CartSkeleton";

export function EmptyCart() {
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showSkeleton && <CartSkeleton />}
      {!showSkeleton && (
        <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold text-foreground">
              Your cart is empty
            </p>
            <p className="text-sm text-muted-foreground">
              Looks like you haven't added anything yet.
            </p>
          </div>
          <button
            className="mt-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150"
            onClick={() => router.push("/products")}
          >
            Start Shopping
          </button>
        </div>
      )}
    </>
  );
}
