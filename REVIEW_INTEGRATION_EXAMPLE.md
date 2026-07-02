# Review System Integration Example

## Product Details Page Implementation

### Full Page Example

```typescript
// app/product/[id]/page.tsx
"use server";

import { getProduct } from "@/lib/actions/product.actions";
import {
  getProductRatingSummary,
  getProductReviews,
  getUserProductReview,
} from "@/lib/actions/review.actions";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;

  // Fetch all data in parallel for performance
  const [product, ratingData, reviewsData, userReviewData] = await Promise.all(
    [
      getProduct(productId),
      getProductRatingSummary(productId),
      getProductReviews(productId, 1, 10),
      getUserProductReview(productId),
    ]
  );

  if (!product) {
    notFound();
  }

  // Handle errors gracefully
  const summary = ratingData.totalReviews
    ? ratingData
    : {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };

  const reviews = reviewsData.success ? reviewsData.reviews : [];
  const userReview = userReviewData.success ? userReviewData.review : null;

  return (
    <main className="container py-12">
      {/* Product Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          {/* Product images */}
          <img src={product.images[product.colors[0]]} alt={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              {product.shortDescription}
            </p>
          </div>

          {/* Rating Summary Display */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(summary.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">
                {summary.averageRating.toFixed(1)} out of 5
              </span>
              <span className="text-muted-foreground">
                ({summary.totalReviews} reviews)
              </span>
            </div>
          </div>

          {/* Product Details, Add to Cart, etc. */}
          <div className="space-y-4">
            {/* Price, options, buttons */}
            <div className="text-2xl font-bold">${product.price / 100}</div>
            {/* Color selector */}
            {/* Size selector */}
            {/* Add to cart button */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="border-t pt-8">
          <ReviewsSection
            productId={productId}
            reviews={reviews}
            summary={summary}
            userReview={userReview}
            reviewsPerPage={10}
          />
        </div>
      </div>
    </main>
  );
}

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const product = await getProduct(params.id);
  const summary = await getProductRatingSummary(params.id);

  return {
    title: `${product?.name} - ${summary.averageRating} Stars`,
    description: product?.shortDescription,
    openGraph: {
      images: [product?.images[product?.colors[0]]],
    },
  };
};
```

## Component Usage

### ReviewsSection Standalone

```typescript
// Load reviews data and render the full review experience
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { getProductReviews, getProductRatingSummary } from "@/lib/actions/review.actions";

export async function ReviewsContainer({ productId }: { productId: string }) {
  const [summary, reviewsData, userReview] = await Promise.all([
    getProductRatingSummary(productId),
    getProductReviews(productId, 1, 10),
    getUserProductReview(productId),
  ]);

  return (
    <ReviewsSection
      productId={productId}
      reviews={reviewsData.reviews}
      summary={summary}
      userReview={userReview.review}
    />
  );
}
```

### Just the Rating Summary

```typescript
// Display only the rating on a product list item
import ReviewsSummary from "@/components/reviews/ReviewsSummary";
import { getProductRatingSummary } from "@/lib/actions/review.actions";

export async function ProductListItem({ productId }: { productId: string }) {
  const summary = await getProductRatingSummary(productId);

  return (
    <div className="product-card">
      <h3>Product Name</h3>
      <p className="price">$99.99</p>
      <ReviewsSummary summary={summary} />
    </div>
  );
}
```

### Review Form Only

```typescript
// Allow users to submit reviews in a modal or dedicated page
import ReviewForm from "@/components/reviews/ReviewForm";

export function ReviewModal({ productId, onSuccess }: ReviewModalProps) {
  return (
    <dialog>
      <h2>Review This Product</h2>
      <ReviewForm productId={productId} onSubmitSuccess={onSuccess} />
    </dialog>
  );
}
```

## API Route Example

For client-side fetching or mobile app integration:

```typescript
// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getProductReviews,
  getProductRatingSummary,
} from "@/lib/actions/review.actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  try {
    const [reviews, summary] = await Promise.all([
      getProductReviews(productId, page, pageSize),
      getProductRatingSummary(productId),
    ]);

    return NextResponse.json({
      reviews: reviews.reviews,
      summary,
      pagination: reviews.pagination,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
```

## Client-Side Infinite Scroll Example

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";
import { getProductReviews } from "@/lib/actions/review.actions";
import ReviewCard from "@/components/reviews/ReviewCard";

export function InfiniteReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await getProductReviews(productId, page + 1, 10);
      if (response.success) {
        setReviews((prev) => [...prev, ...response.reviews]);
        setPage((prev) => prev + 1);
        setHasMore(response.pagination.page < response.pagination.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId, page, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <div ref={observerTarget} className="h-10" />
      {isLoading && <Loader2 className="animate-spin" />}
    </div>
  );
}
```

## Error Handling Example

```typescript
// Handle all review-related errors gracefully
async function SafeReviewsSection({ productId }: { productId: string }) {
  try {
    const [summary, reviewsData, userReview] = await Promise.all([
      getProductRatingSummary(productId),
      getProductReviews(productId, 1, 10),
      getUserProductReview(productId),
    ]);

    if (!summary || !reviewsData.success) {
      return <ReviewsErrorFallback productId={productId} />;
    }

    return (
      <ReviewsSection
        productId={productId}
        reviews={reviewsData.reviews}
        summary={summary}
        userReview={userReview.review}
      />
    );
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p>Unable to load reviews. Please try again later.</p>
      </div>
    );
  }
}

function ReviewsErrorFallback({ productId }: { productId: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-muted h-20 rounded-lg animate-pulse" />
      <p className="text-muted-foreground">Loading reviews...</p>
    </div>
  );
}
```

## Testing Integration

```typescript
// __tests__/reviews.integration.test.ts
import { getProductReviews, getProductRatingSummary } from "@/lib/actions/review.actions";
import { db } from "@/app/db";

describe("Review System Integration", () => {
  const testProductId = "test-product-123";
  const testUserId = "test-user-456";

  beforeEach(async () => {
    // Setup test data
    await db.review.deleteMany({ where: { productId: testProductId } });
  });

  it("should create and retrieve reviews", async () => {
    // Create review
    const response = await createOrUpdateReview(testProductId, {
      rating: 5,
      comment: "Great product!".repeat(2),
    });

    expect(response.success).toBe(true);

    // Retrieve reviews
    const reviews = await getProductReviews(testProductId);
    expect(reviews.reviews).toHaveLength(1);

    // Get rating summary
    const summary = await getProductRatingSummary(testProductId);
    expect(summary.averageRating).toBe(5);
    expect(summary.totalReviews).toBe(1);
  });

  it("should prevent duplicate reviews", async () => {
    // Create first review
    await createOrUpdateReview(testProductId, {
      rating: 5,
      comment: "Great product!".repeat(2),
    });

    // Attempt duplicate
    const response = await createOrUpdateReview(testProductId, {
      rating: 3,
      comment: "Actually not that great".repeat(2),
    });

    // Should update instead
    expect(response.success).toBe(true);

    const reviews = await getProductReviews(testProductId);
    expect(reviews.reviews).toHaveLength(1);
    expect(reviews.reviews[0].rating).toBe(3);
  });
});
```

## Performance Tips

1. **Cache Rating Summaries**: Cache `getProductRatingSummary` for 1 hour
   ```typescript
   export const getCachedRatingSummary = unstable_cache(
     (productId) => getProductRatingSummary(productId),
     ["rating-summary"],
     { revalidate: 3600 }
   );
   ```

2. **Lazy Load Reviews**: Load initial batch, then "Load More" on demand
   ```typescript
   <ReviewsSection reviewsPerPage={10} /> // Loads 10 by default
   ```

3. **Preload User Review**: Check if user has review before rendering form
   ```typescript
   const userReview = await getUserProductReview(productId);
   if (userReview) {
     // Show edit form instead of create form
   }
   ```

4. **Use Server Components**: Keep data fetching in server components for better performance

## Next Steps

- Customize star colors and styling to match your brand
- Add rich text editor for review comments (use libraries like TipTap)
- Implement review verification (verified purchase badge)
- Add review sorting (helpful, recent, highest/lowest rating)
- Integrate with email notification system
- Add admin dashboard for review management
