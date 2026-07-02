"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateReviewSchema, Review } from "@/lib/types/review";
import { createOrUpdateReview, updateReview } from "@/lib/actions/review.actions";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  existingReview?: Review | null;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({
  productId,
  existingReview,
  onSubmitSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!existingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = CreateReviewSchema.safeParse({ rating, comment });
    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errorMap[String(err.path[0])] = err.message;
        }
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);
    try {
      let response;

      if (isEditing && existingReview) {
        // Update existing review
        response = await updateReview(existingReview.id, result.data);
      } else {
        // Create or update review (handles duplicates)
        response = await createOrUpdateReview(productId, result.data);
      }

      if (response.success) {
        toast.success(response.message);
        if (!isEditing) {
          setRating(0);
          setComment("");
        }
        onSubmitSuccess?.();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 space-y-4"
    >
      <h3 className="font-semibold text-foreground">
        {isEditing ? "Edit Your Review" : "Share Your Review"}
      </h3>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={isSubmitting}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-destructive mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="text-sm font-medium text-foreground mb-2 block">
          Your Review ({comment.length}/500) *
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          disabled={isSubmitting}
          className="min-h-24 resize-none"
        />
        {errors.comment && (
          <p className="text-xs text-destructive mt-1">{errors.comment}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Submitting..."}
          </>
        ) : isEditing ? (
          "Update Review"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
