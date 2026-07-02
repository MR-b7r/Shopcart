"use client";

import { Star, Trash2, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Review } from "@/lib/types/review";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/lib/actions/review.actions";
import { toast } from "sonner";

interface ReviewCardProps {
  review: Review;
  index?: number;
  isUserReview?: boolean;
  onDelete?: () => void;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `over a year ago`;
}

export default function ReviewCard({
  review,
  index = 0,
  isUserReview = false,
  onDelete,
}: ReviewCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteReview(review.id);
      if (response.success) {
        toast.success(response.message);
        onDelete?.();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-4 pb-4 border-b border-border last:border-b-0 ${
        isUserReview ? "bg-accent/50 px-3 py-4 rounded-lg" : ""
      }`}
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="text-xs font-medium">
          {review.userId.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-foreground">
              {isUserReview && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full mr-2">Your Review</span>}
              You
            </p>
            {isUserReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-6 w-6 p-0"
                title="Delete review"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {getTimeAgo(new Date(review.createdAt))}
            </span>
          </div>
        </div>

        {/* Comment */}
        <p className="text-sm text-foreground/90 leading-relaxed text-balance">
          {review.comment}
        </p>
      </div>
    </motion.div>
  );
}
