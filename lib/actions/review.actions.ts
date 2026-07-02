"use server";

import { db } from "@/app/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import {
  CreateReviewInput,
  CreateReviewSchema,
  ReviewSummary,
  UpdateReviewInput,
  UpdateReviewSchema,
} from "../types/review";
import { parseStringify } from "../utils";

/**
 * Create or update a review for a product
 * Enforces one-review-per-user-per-product constraint
 */
export const createOrUpdateReview = async (
  productId: string,
  data: CreateReviewInput
) => {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in to leave a review");
    }

    // Validate input
    const validatedData = CreateReviewSchema.parse(data);

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if user has already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const updatedReview = await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating: validatedData.rating,
          comment: validatedData.comment,
        },
      });

      return parseStringify({
        success: true,
        message: "Review updated successfully",
        review: updatedReview,
      });
    }

    // Create new review
    const newReview = await db.review.create({
      data: {
        productId,
        userId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });

    return parseStringify({
      success: true,
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error: any) {
    console.error("Error creating/updating review:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "You have already reviewed this product",
      };
    }
    return {
      success: false,
      error: error.message || "Failed to create review",
    };
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (
  reviewId: string,
  data: UpdateReviewInput
) => {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // Validate input
    const validatedData = UpdateReviewSchema.parse(data);

    // Check if review exists and user owns it
    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error("Unauthorized: You can only edit your own reviews");
    }

    // Update review
    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });

    return parseStringify({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return {
      success: false,
      error: error.message || "Failed to update review",
    };
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string) => {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // Check if review exists and user owns it
    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own reviews");
    }

    // Delete review
    await db.review.delete({
      where: { id: reviewId },
    });

    return parseStringify({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: error.message || "Failed to delete review",
    };
  }
};

/**
 * Get paginated reviews for a product
 */
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    // Validate product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Calculate skip
    const skip = (page - 1) * pageSize;

    // Get reviews (newest first) with aggregated counts
    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.review.count({
        where: { productId },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return parseStringify({
      success: true,
      reviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch reviews",
    };
  }
};

/**
 * Get product rating summary
 * Calculates average rating and distribution
 */
export const getProductRatingSummary = async (
  productId: string
): Promise<ReviewSummary> => {
  try {
    // Validate product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Get all reviews for aggregation
    const reviews = await db.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    // Calculate average
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalRating / reviews.length).toFixed(1));

    // Calculate distribution
    const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      ratingDistribution[rating]++;
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  } catch (error: any) {
    console.error("Error calculating rating summary:", error);
    throw error;
  }
};

/**
 * Get user's review for a product (if exists)
 */
export const getUserProductReview = async (productId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: true, review: null };
    }

    const review = await db.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    return parseStringify({
      success: true,
      review: review || null,
    });
  } catch (error: any) {
    console.error("Error fetching user review:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch user review",
    };
  }
};
