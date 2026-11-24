import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getShopProducts } from "@/lib/actions/product.actions";
import { shopFiltersSchema, SHOP_PAGE_SIZE } from "@/lib/types/shop-filters";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopResults } from "@/components/shop/ShopResults";

export type ShopSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  const rawParams = await searchParams;
  const filters = shopFiltersSchema.parse({
    category: firstValue(rawParams.category),
    search: firstValue(rawParams.search),
    minPrice: firstValue(rawParams.minPrice),
    maxPrice: firstValue(rawParams.maxPrice),
    sort: firstValue(rawParams.sort),
    page: firstValue(rawParams.page),
  });
  const normalizedFilters = filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice
    ? { ...filters, minPrice: undefined, maxPrice: undefined, page: 1 }
    : filters;
  const result = await getShopProducts(normalizedFilters);
  const currentPage = result.totalPages > 0 ? Math.min(normalizedFilters.page, result.totalPages) : 1;
  const data = currentPage === normalizedFilters.page
    ? result
    : await getShopProducts({ ...normalizedFilters, page: currentPage });
  const categoryTitle = normalizedFilters.category === "all"
    ? "All Products"
    : normalizedFilters.category.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  const paramsForPagination = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, firstValue(value)]),
  );

  return (
    <main className="shop-page mx-auto flex w-full max-w-[1440px] flex-col gap-8 bg-background px-4 pb-12 text-foreground sm:px-6 lg:px-10 xl:px-12">
      <header className="flex flex-col gap-3 border-b border-border pb-7">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <Link href="/shop" className="transition-colors hover:text-foreground">Shop</Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span aria-current="page" className="text-foreground">{categoryTitle}</span>
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shop the edit</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explore Our Collection</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Thoughtful essentials and standout pieces, selected for the everyday.</p>
          </div>
          <p className="text-sm text-muted-foreground">Showing {data.totalCount === 0 ? 0 : (currentPage - 1) * SHOP_PAGE_SIZE + 1}–{Math.min(currentPage * SHOP_PAGE_SIZE, data.totalCount)} of {data.totalCount} products</p>
        </div>
      </header>

      <ShopFilters
        category={normalizedFilters.category}
        minPrice={normalizedFilters.minPrice}
        maxPrice={normalizedFilters.maxPrice}
        search={normalizedFilters.search}
        sort={normalizedFilters.sort}
        priceFloor={data.priceBounds.min}
        priceCeiling={data.priceBounds.max}
        resultCount={data.totalCount}
      >
        <ShopResults
          products={data.products}
          page={currentPage}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          searchParams={paramsForPagination}
        />
      </ShopFilters>
    </main>
  );
}
