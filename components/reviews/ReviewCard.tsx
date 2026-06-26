"use client";

import { Star } from "lucide-react";
import React from "react";
import { Review } from "@/lib/types/review";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: Review;
  index?: number;
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

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 pb-4 border-b border-border last:border-b-0"
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="text-xs">
          {review.userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-2">
          <p className="font-medium text-foreground">{review.userName}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? "fill-primary text-primary"
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
