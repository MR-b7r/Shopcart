"use client";

import { Star } from "lucide-react";
import React from "react";
import { ReviewSummary } from "@/lib/types/review";

interface ReviewsSummaryProps {
  summary: ReviewSummary;
}

export default function ReviewsSummary({ summary }: ReviewsSummaryProps) {
  const { averageRating, totalReviews, ratingDistribution } = summary;

  const getRatingPercentage = (rating: 1 | 2 | 3 | 4 | 5) => {
    if (totalReviews === 0) return 0;
    return Math.round((ratingDistribution[rating] / totalReviews) * 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Reviews</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Overall Rating */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Right: Rating Distribution */}
        <div className="flex flex-col gap-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 fill-primary text-primary" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${getRatingPercentage(rating as 1 | 2 | 3 | 4 | 5)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {getRatingPercentage(rating as 1 | 2 | 3 | 4 | 5)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
