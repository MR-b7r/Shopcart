"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReviewFormSchema, ReviewFormInput } from "@/lib/types/review";
import { toast } from "react-toastify";

interface ReviewFormProps {
  productId: string;
  userId?: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({
  productId,
  userId,
  onSubmitSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = ReviewFormSchema.safeParse({ rating, comment });
    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errorMap[err.path[0]] = err.message;
        }
      });
      setErrors(errorMap);
      return;
    }

    if (!userId) {
      toast.error("Please sign in to leave a review");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Call server action to submit review
      // await submitReview(productId, userId, rating, comment);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onSubmitSuccess?.();
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Sign in to share your review and help other customers
        </p>
        <Button variant="outline">Sign In</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 space-y-4"
    >
      <h3 className="font-semibold text-foreground">Share Your Review</h3>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-primary text-primary"
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
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="min-h-24 resize-none"
        />
        {errors.comment && (
          <p className="text-xs text-destructive mt-1">{errors.comment}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
