"use client";
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { ShoppingCart } from "lucide-react";
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
    <div className="shadow-lg rounded-lg overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={product.images[productTypes.color]}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>
      </Link>

      <div className="flex flex-col p-4 gap-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.shortDescription}</p>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Size</span>
            <select
              className="ring ring-gray-300 rounded-md px-2 py-1"
              name="size"
              id="size"
              onChange={(e) =>
                handleProductType({ type: "size", value: e.target.value })
              }
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Color</span>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`cursor-pointer border-1 rounded-full p-[1.2px] ${
                    productTypes.color === color
                      ? "border-gray-400"
                      : "border-gray-200"
                  }`}
                  onClick={() =>
                    handleProductType({ type: "color", value: color })
                  }
                >
                  <div
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">${product.price.toFixed(2)}</p>
          <Button onClick={handleAddToCart} size={"sm"}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
