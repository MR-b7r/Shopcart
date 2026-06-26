"use client";

import { Star } from "lucide-react";
import React from "react";

interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  onReviewClick?: () => void;
}

export default function ProductInfo({
  name,
  description,
  price,
  rating,
  reviewCount,
  onReviewClick,
}: ProductInfoProps) {
  const displayPrice = (price / 100).toFixed(2);
  const stars = Math.round(rating);

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
        {name}
      </h1>

      {/* Rating and Reviews */}
      <button
        onClick={onReviewClick}
        className="flex items-center gap-2 w-fit text-sm hover:opacity-80 transition-opacity"
      >
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < stars
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      </button>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          ${displayPrice}
        </span>
        <span className="text-sm text-muted-foreground">
          Including all taxes
        </span>
      </div>

      {/* Description */}
      <p className="text-foreground/80 leading-relaxed text-balance">
        {description}
      </p>
    </div>
  );
}
