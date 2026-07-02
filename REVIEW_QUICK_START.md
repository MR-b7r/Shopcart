# Review System - Quick Start Guide

## 5-Minute Setup

### Step 1: Verify Migration Applied ✅
The migration was already applied. The Review table exists in your database.

```bash
# Verify the table exists
npx prisma studio
# Navigate to "Review" model
```

### Step 2: Use on Product Details Page

```typescript
// app/product/[id]/page.tsx
import ReviewsSection from "@/components/reviews/ReviewsSection";
import {
  getProductRatingSummary,
  getProductReviews,
  getUserProductReview,
} from "@/lib/actions/review.actions";

export default async function ProductPage({ params }) {
  const [summary, reviewsData, userReview] = await Promise.all([
    getProductRatingSummary(params.id),
    getProductReviews(params.id, 1, 10),
    getUserProductReview(params.id),
  ]);

  return (
    <div>
      {/* Your existing product content */}
      
      {/* Add reviews section */}
      <ReviewsSection
        productId={params.id}
        reviews={reviewsData.reviews}
        summary={summary}
        userReview={userReview.review}
      />
    </div>
  );
}
```

### Step 3: Display Rating on Product Header

```typescript
<div className="flex items-center gap-2">
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.round(summary.averageRating)
            ? "fill-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ))}
  </div>
  <span className="font-medium">{summary.averageRating}/5</span>
  <span className="text-muted-foreground">({summary.totalReviews})</span>
</div>
```

### Step 4: Test It Out

1. Go to a product page
2. Scroll to reviews section
3. Click "Share Your Review"
4. Submit a review with rating and comment
5. Your review appears at the top
6. Try to submit another review - it updates instead
7. Click edit (pencil icon) to modify
8. Click delete (trash icon) to remove

## Core Features

### Create Review
```typescript
await createOrUpdateReview(productId, {
  rating: 5,
  comment: "Amazing product! Highly recommend..."
});
```

### Edit Review
```typescript
await updateReview(reviewId, {
  rating: 4,
  comment: "Updated review..."
});
```

### Delete Review
```typescript
await deleteReview(reviewId);
```

### Get All Reviews
```typescript
const response = await getProductReviews(productId, page, pageSize);
// Returns paginated reviews with pagination info
```

### Get Rating Stats
```typescript
const summary = await getProductRatingSummary(productId);
// Returns: { averageRating, totalReviews, ratingDistribution }
```

## File Structure

```
lib/
├── actions/
│   └── review.actions.ts      ← Server actions (6 functions)
└── types/
    └── review.ts              ← Types & Zod schemas

components/reviews/
├── ReviewForm.tsx             ← Create/edit form
├── ReviewCard.tsx             ← Single review display
├── ReviewsSummary.tsx         ← Rating stats
└── ReviewsSection.tsx         ← Main container
```

## Database Schema

One simple table with the following:

```
Review
├── id (primary key)
├── productId (foreign key to Product)
├── userId (Clerk user ID)
├── rating (1-5)
├── comment (text)
├── createdAt
├── updatedAt
└── Unique constraint on (productId, userId)
```

## Security Built-In

✅ Users must be authenticated to submit reviews  
✅ Users can only edit their own reviews  
✅ Users can only delete their own reviews  
✅ Duplicate reviews are prevented at database level  
✅ All inputs validated with Zod schemas  

## Customization

### Change Styling

The components use shadcn/ui. Customize via:

```typescript
// ReviewCard.tsx - Change star color
? "fill-yellow-400 text-yellow-400"    // Change this color
: "fill-muted text-muted-foreground"   // And this

// ReviewForm.tsx - Change button appearance
<Button variant="outline">               // Use different variant
```

### Change Pagination Size

```typescript
<ReviewsSection reviewsPerPage={20} />  // Default is 10
```

### Change Rating Display

```typescript
// Show as percentage
<div>{(summary.averageRating / 5 * 100).toFixed(0)}%</div>

// Show as text
<div>{['Poor', 'Fair', 'Good', 'Great', 'Excellent'][Math.round(summary.averageRating - 1)]}</div>
```

## Common Issues & Fixes

### Reviews Not Showing

**Problem**: Created a review but it's not displaying

**Solution**:
1. Verify user is authenticated (check Clerk dashboard)
2. Check browser console for errors
3. Verify productId is correct
4. Check database: `npx prisma studio` → Review model

### Rating Math Wrong

**Problem**: Average rating shows 3 but there's one 5-star review

**Solution**: 
- Delete all reviews
- Create fresh review
- Rating is calculated correctly, might be old data

### Can't Edit Review

**Problem**: Edit button doesn't work

**Solution**:
1. Make sure you own the review
2. Check that review is passed to ReviewForm: `existingReview={userReview}`
3. Verify `isUserReview={true}` is set on ReviewCard

### Unauthenticated Error

**Problem**: "Unauthorized" error when trying to submit

**Solution**:
1. Ensure Clerk is set up in your Next.js app
2. Check `auth()` returns userId
3. Verify form is wrapped in client component

## Best Practices

### 1. Load Reviews on Product Page
```typescript
// ✅ Good - Parallel loading
const [summary, reviews] = await Promise.all([
  getProductRatingSummary(id),
  getProductReviews(id)
]);

// ❌ Avoid - Sequential loading
const summary = await getProductRatingSummary(id);
const reviews = await getProductReviews(id); // Slower
```

### 2. Handle Errors
```typescript
// ✅ Good
const summary = await getProductRatingSummary(id)
  .catch(err => ({ averageRating: 0, totalReviews: 0, ratingDistribution: {...} }));

// ❌ Avoid - Silent failures
const summary = await getProductRatingSummary(id); // Might crash
```

### 3. Show Loading State
```typescript
// ✅ Good - Skeleton while loading
{isLoading ? <ReviewsSkeleton /> : <ReviewsSection {...} />}

// ❌ Avoid - Blank page
{reviews.length > 0 && <ReviewsSection {...} />}
```

## Deployment Checklist

- [ ] Database migration applied in production
- [ ] Environment variables set (DATABASE_URL, CLERK_SECRET_KEY)
- [ ] Clerk authentication configured
- [ ] ReviewsSection added to product page
- [ ] Tested creating/editing/deleting reviews
- [ ] Verified pagination works
- [ ] Checked responsive design on mobile

## Performance Tips

1. **Cache ratings** for popular products
   ```typescript
   const summary = await unstable_cache(
     () => getProductRatingSummary(id),
     [id],
     { revalidate: 3600 }
   )();
   ```

2. **Lazy load reviews** on scroll
   ```typescript
   // Initial load: 10 reviews
   // Load More button: +10 reviews
   ```

3. **Use ISR** for product pages
   ```typescript
   export const revalidate = 3600; // Revalidate hourly
   ```

## API Reference Quick

| Function | Input | Output |
|----------|-------|--------|
| `createOrUpdateReview` | productId, { rating, comment } | { success, message, review } |
| `updateReview` | reviewId, { rating, comment } | { success, message, review } |
| `deleteReview` | reviewId | { success, message } |
| `getProductReviews` | productId, page, pageSize | { success, reviews[], pagination } |
| `getProductRatingSummary` | productId | { averageRating, totalReviews, distribution } |
| `getUserProductReview` | productId | { success, review \| null } |

## Example: Full Product Page

```typescript
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { getProductRatingSummary, getProductReviews, getUserProductReview } from '@/lib/actions/review.actions';

export default async function ProductPage({ params }) {
  const [product, summary, reviewsData, userReview] = await Promise.all([
    getProduct(params.id),
    getProductRatingSummary(params.id),
    getProductReviews(params.id, 1, 10),
    getUserProductReview(params.id),
  ]);

  if (!product) return notFound();

  return (
    <main className="container py-12">
      {/* Product Hero */}
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImage product={product} />
        <div>
          <h1>{product.name}</h1>
          
          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <Stars rating={summary.averageRating} />
            <span>{summary.averageRating}/5 ({summary.totalReviews})</span>
          </div>
          
          {/* Rest of product details */}
          <ProductDetails product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t pt-8">
        <ReviewsSection
          productId={product.id}
          reviews={reviewsData.reviews}
          summary={summary}
          userReview={userReview.review}
        />
      </section>
    </main>
  );
}
```

## Next Steps

1. ✅ Verify migration applied
2. ✅ Add ReviewsSection to product page
3. ✅ Display rating summary on product header
4. ✅ Test create/edit/delete reviews
5. ✅ Deploy to production
6. Optional: Add review moderation, analytics, rich text editor

---

**Need help?** Check:
- REVIEW_SYSTEM_GUIDE.md - Complete documentation
- REVIEW_INTEGRATION_EXAMPLE.md - More code examples
- REVIEW_SYSTEM_SUMMARY.md - Architecture overview
