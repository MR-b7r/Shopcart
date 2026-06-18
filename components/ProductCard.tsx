"use client";
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/lib/types";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { createProduct } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addToCart } = useCartStore();
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0],
    color: product.colors[0],
  });

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({ ...prev, [type]: value }));
  };
  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
    });
    toast.success("Product added to cart!");
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="aspect-[4/3] bg-background relative flex items-center justify-center p-6 border-b border-border">
        <div className="bg-muted rounded-lg border border-border flex items-center justify-center">
          <Image
            src={
              (product.images as Record<string, string>)?.[productTypes.color]
            }
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-4 right-4 text-xs font-semibold text-primary bg-background/50 backdrop-blur px-3 py-1 rounded-full">
          New
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              Price
            </div>
            <div className="text-xl font-semibold tracking-tight">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="space-y-6 mt-auto">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Size
              </div>
              <select
                className="ring ring-gray-300 rounded-md px-2 py-1"
                name="size"
                id="size"
                onChange={(e) =>
                  handleProductType({ type: "size", value: e.target.value })
                }
              >
                {product.sizes.map((size) => (
                  <option
                    key={size}
                    value={size}
                    className="px-3 py-1 text-sm border border-border rounded-full bg-foreground text-background hover:opacity-80"
                  >
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Color
              </div>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 hover:scale-110 ${
                      productTypes.color === color
                        ? "border-gray-400"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleProductType({ type: "color", value: color })
                    }
                  >
                    <div
                      className="rounded-full w-full h-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            Add to Cart
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
