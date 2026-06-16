'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { CartItemCard } from '@/components/checkout/CartItemCard';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { CartSkeleton } from '@/components/checkout/CartSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  selectedOptions: {
    size?: string;
    color?: string;
  };
  image?: string;
}

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Quantum Headphones',
    category: 'Audio',
    price: 299,
    quantity: 1,
    selectedOptions: { color: '#2d5016' },
    image: '',
  },
  {
    id: '2',
    name: 'Nexus Smartwatch',
    category: 'Wearables',
    price: 449,
    quantity: 1,
    selectedOptions: { size: 'M' },
    image: '',
  },
  {
    id: '3',
    name: 'Core Tablet Air',
    category: 'Electronics',
    price: 899,
    quantity: 2,
    selectedOptions: { color: '#1a4d2e' },
    image: '',
  },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate loading cart data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems(MOCK_CART_ITEMS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(2);
    setIsProcessing(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal > 1500 ? 100 : 0;
  const shipping = subtotal > 150 ? 0 : 10;
  const tax = Math.round((subtotal - discount + shipping) * 0.08 * 100) / 100;

  const isEmpty = cartItems.length === 0 && !isLoading;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Sticky Header with Back Button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-xl font-bold">
            SHOP<span className="text-primary">CART</span>
          </h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Checkout Stepper */}
      <CheckoutStepper currentStep={currentStep} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items (70% on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Shopping Cart
                  <span className="text-sm text-muted-foreground font-normal ml-2">
                    ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                </h2>

                {isLoading ? (
                  <CartSkeleton />
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {!isLoading && cartItems.length > 0 && (
                <div className="bg-secondary/30 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    💡 Add $150 more to your order for free shipping!
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/">Explore Products</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Side - Order Summary (30% on desktop) */}
            {!isLoading && cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  discount={discount}
                  shipping={shipping}
                  tax={tax}
                  onContinue={handleContinue}
                  isLoading={isProcessing}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Button */}
      {!isEmpty && !isLoading && cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4">
          <Button
            onClick={handleContinue}
            disabled={isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? 'Processing...' : `Checkout - $${(subtotal - discount + shipping + tax).toFixed(2)}`}
          </Button>
        </div>
      )}
    </main>
  );
}
