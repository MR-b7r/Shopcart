'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-secondary rounded-full">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground mb-2">Cart is Empty</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added any items yet. Start shopping to find products you love.
        </p>

        <Button asChild size="lg" className="w-full">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
