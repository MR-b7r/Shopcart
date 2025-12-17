"use client";
import { ProductType } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  const handleTypeChange = (type: "size" | "color", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) setQuantity((prev) => prev - 1);
    }
  };
  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, selectedColor, quantity });
    toast.success("Product added to cart");
  };
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* SIZE */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Size</span>
        <div className="flex items-center gap-2">
          {product.sizes.map((size) => (
            <div
              key={size}
              className={`cursor-pointer border-1 p-[2px] ${
                selectedSize === size
                  ? "border-gray-600 bg-[#222] text-white"
                  : "border-gray-300 bg-white text-black"
              } rounded-sm`}
              onClick={() => handleTypeChange("size", size)}
            >
              <div
                className={`w-6 h-6 text-center flex items-center justify-center `}
              >
                {size.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Color */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Color</span>
        <div className="flex items-center gap-2">
          {product.colors.map((color) => (
            <div
              key={color}
              className={`cursor-pointer border-1 p-[2px] ${
                selectedColor === color
                  ? "border-gray-600 border-2"
                  : "border-white"
              } rounded-sm`}
              style={{ backgroundColor: color }}
              onClick={() => handleTypeChange("color", color)}
            >
              <div className={`w-6 h-6`} />
            </div>
          ))}
        </div>
      </div>
      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Button */}
      <Button onClick={handleAddToCart} variant={"default"}>
        <Plus className="w-4 h-4" />
        Add to Cart
      </Button>
      <Button variant={"outline"}>
        <ShoppingCart className="w-4 h-4" />
        Buy this Item
      </Button>
    </div>
  );
};

export default ProductInteraction;
