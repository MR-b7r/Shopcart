import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/lib/types";

interface ShopResultsProps {
  products: ProductType[];
  page: number;
  totalPages: number;
  totalCount: number;
  searchParams: Record<string, string | undefined>;
}

function pageHref(page: number, searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "?";
}

export function ShopResults({ products, page, totalPages, totalCount, searchParams }: ShopResultsProps) {
  if (products.length === 0) {
    return (
      <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <PackageSearch aria-hidden="true" className="size-6" />
        </span>
        <h2 className="text-lg font-semibold">No products found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">Try adjusting your filters or search for a different product.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/shop">Clear all filters</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {totalPages > 1 && (
        <nav aria-label="Product pages" className="flex items-center justify-between border-t border-border pt-5">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages} <span className="hidden sm:inline">· {totalCount} products</span></p>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" disabled={page <= 1}>
              <Link aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} href={page <= 1 ? "#" : pageHref(page - 1, searchParams)}><ChevronLeft data-icon="inline-start" />Previous</Link>
            </Button>
            <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
              <Link aria-disabled={page >= totalPages} tabIndex={page >= totalPages ? -1 : undefined} href={page >= totalPages ? "#" : pageHref(page + 1, searchParams)}>Next<ChevronRight data-icon="inline-end" /></Link>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
