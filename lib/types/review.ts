import z from "zod";

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export const ReviewFormSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must not exceed 500 characters"),
});

export type ReviewFormInput = z.infer<typeof ReviewFormSchema>;
