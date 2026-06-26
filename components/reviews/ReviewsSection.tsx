"use client";

import React, { useState } from "react";
import { Review, ReviewSummary } from "@/lib/types/review";
import ReviewsSummary from "./ReviewsSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ReviewsSectionProps {
  productId: string;
  userId?: string;
  reviews: Review[];
  summary: ReviewSummary;
  reviewsPerPage?: number;
}

export default function ReviewsSection({
  productId,
  userId,
  reviews,
  summary,
  reviewsPerPage = 5,
}: ReviewsSectionProps) {
  const [displayCount, setDisplayCount] = useState(reviewsPerPage);

  const displayedReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <ReviewsSummary summary={summary} />

      {/* Review Form */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Write a Review
        </h3>
        <ReviewForm productId={productId} userId={userId} />
      </div>

      <Separator />

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Customer Reviews
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setDisplayCount((prev) => prev + reviewsPerPage)}
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
