'use client';

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-6 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image Skeleton */}
            <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-secondary rounded-lg border border-border" />

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
