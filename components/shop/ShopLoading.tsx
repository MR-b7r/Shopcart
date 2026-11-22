import { Skeleton } from "@/components/ui/skeleton";

export function ShopLoading() {
  return (
    <main className="flex flex-col gap-8 pb-12" aria-label="Loading products">
      <header className="flex flex-col gap-3 border-b border-border pb-7">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </header>
      <Skeleton className="h-11 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </main>
  );
}
