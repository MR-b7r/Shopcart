"use client";

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl p-5 
          bg-card border border-border animate-pulse"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image Skeleton */}
            <div
              className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border 
          "
            />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-secondary rounded w-1/4" />
              <div className="h-6 bg-secondary rounded w-1/2" />
              <div className="h-4 bg-secondary rounded w-1/3" />

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="h-10 bg-secondary rounded w-24" />
                <div className="h-6 bg-secondary rounded w-20" />
                <div className="h-10 bg-secondary rounded-lg w-10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
