"use client";

import React, { useState, useCallback } from "react";
import { Review, ReviewSummary } from "@/lib/types/review";
import ReviewsSummary from "./ReviewsSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { getProductReviews, getUserProductReview } from "@/lib/actions/review.actions";

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  summary: ReviewSummary;
  reviewsPerPage?: number;
  userReview?: Review | null;
}

export default function ReviewsSection({
  productId,
  reviews: initialReviews,
  summary: initialSummary,
  reviewsPerPage = 10,
  userReview: initialUserReview,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [userReview, setUserReview] = useState(initialUserReview);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialReviews.length >= reviewsPerPage
  );

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const response = await getProductReviews(
        productId,
        currentPage + 1,
        reviewsPerPage
      );

      if (response.success) {
        setReviews((prev) => [...prev, ...response.reviews]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.pagination.page < response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load more reviews:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [productId, currentPage, reviewsPerPage]);

  const handleReviewSuccess = useCallback(async () => {
    // Refresh user's review and summary after submit/update
    try {
      const userReviewResponse = await getUserProductReview(productId);
      if (userReviewResponse.success) {
        setUserReview(userReviewResponse.review);
      }

      // Optionally refresh reviews list from server
      const reviewsResponse = await getProductReviews(productId, 1, reviewsPerPage);
      if (reviewsResponse.success) {
        setReviews(reviewsResponse.reviews);
        setCurrentPage(1);
        setHasMore(
          reviewsResponse.pagination.page < reviewsResponse.pagination.totalPages
        );
      }
    } catch (error) {
      console.error("Failed to refresh reviews:", error);
    }
  }, [productId, reviewsPerPage]);

  const displayedReviews = userReview
    ? [userReview, ...reviews.filter((r) => r.id !== userReview.id)]
    : reviews;

  return (
    <div className="space-y-8 w-full">
      {/* Reviews Summary */}
      <ReviewsSummary summary={summary} />

      {/* Review Form */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {userReview ? "Edit Your Review" : "Share Your Review"}
        </h3>
        <ReviewForm
          productId={productId}
          existingReview={userReview || null}
          onSubmitSuccess={handleReviewSuccess}
        />
      </div>

      <Separator />

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Customer Reviews ({summary.totalReviews})
        </h3>

        {displayedReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                  isUserReview={review.id === userReview?.id}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2"
                >
                  {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
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
