'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const total = item.price * item.quantity;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-secondary rounded-lg border border-border flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="text-muted-foreground italic text-sm">Product Image</div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
                  {item.category}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4 mb-4">
              {item.selectedOptions.size && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Size: {item.selectedOptions.size}</p>
                </div>
              )}
              {item.selectedOptions.color && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground font-medium">Color:</p>
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: item.selectedOptions.color }} />
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
              <button
                onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                className="p-1 hover:bg-background rounded transition-colors"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="p-1 hover:bg-background rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
              <p className="text-lg font-bold text-foreground">${total.toFixed(2)}</p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
            >
              <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
