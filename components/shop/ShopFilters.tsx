"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BriefcaseBusiness,
  Footprints,
  Glasses,
  Hand,
  Shirt,
  ShoppingBasket,
  SlidersHorizontal,
  Venus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  { name: "All Products", slug: "all", Icon: ShoppingBasket },
  { name: "T-shirts", slug: "t-shirts", Icon: Shirt },
  { name: "Shoes", slug: "shoes", Icon: Footprints },
  { name: "Accessories", slug: "accessories", Icon: Glasses },
  { name: "Bags", slug: "bags", Icon: BriefcaseBusiness },
  { name: "Dresses", slug: "dresses", Icon: Venus },
  { name: "Jackets", slug: "jackets", Icon: Shirt },
  { name: "Gloves", slug: "gloves", Icon: Hand },
];

const sortOptions = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "oldest", label: "Oldest" },
];

interface ShopFiltersProps {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sort: string;
  priceFloor: number;
  priceCeiling: number;
  resultCount: number;
  children: ReactNode;
}

export function ShopFilters({
  category,
  minPrice,
  maxPrice,
  search,
  sort,
  priceFloor,
  priceCeiling,
  resultCount,
  children,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(search);
  const rangeCeiling = Math.max(priceCeiling, priceFloor + 1);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ?? priceFloor,
    maxPrice ?? priceCeiling,
  ]);
  const [isPending, startTransition] = useTransition();
  const paramsString = searchParams.toString();
  const formatPrice = (price: number) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);

  useEffect(() => {
    setSearchText(search);
    setPriceRange([minPrice ?? priceFloor, maxPrice ?? priceCeiling]);
  }, [search, minPrice, maxPrice, priceFloor, priceCeiling, rangeCeiling]);

  const activeFilterCount = useMemo(
    () => Number(category !== "all") + Number(Boolean(search)) + Number(minPrice !== undefined) + Number(maxPrice !== undefined) + Number(sort !== "newest"),
    [category, search, minPrice, maxPrice, sort],
  );

  const updateParams = (updates: Record<string, string | undefined>, resetPage = true) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    if (resetPage) params.delete("page");
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchText.trim() !== search) updateParams({ search: searchText.trim() || undefined });
    }, 350);
    return () => window.clearTimeout(timer);
    // paramsString is the URL source and intentionally refreshes this debounce on browser navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, search, paramsString]);

  useEffect(() => {
    const [minimum, maximum] = priceRange;
    if (minimum === (minPrice ?? priceFloor) && maximum === (maxPrice ?? priceCeiling)) return;

    const timer = window.setTimeout(() => {
      updateParams({
        minPrice: minimum > priceFloor ? String(minimum) : undefined,
        maxPrice: maximum < priceCeiling ? String(maximum) : undefined,
      });
    }, 350);
    return () => window.clearTimeout(timer);
    // Keep price URL updates debounced while dragging; paramsString refreshes on navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, minPrice, maxPrice, priceFloor, priceCeiling, paramsString]);

  const clearFilters = () => {
    setSearchText("");
    setPriceRange([priceFloor, priceCeiling]);
    updateParams({ search: undefined, minPrice: undefined, maxPrice: undefined, category: "all", sort: undefined });
  };

  const categoryList = (
    <nav aria-label="Shop categories" className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map(({ name, slug, Icon }) => {
        const selected = category === slug;
        return (
          <button
            key={slug}
            type="button"
            aria-pressed={selected}
            onClick={() => updateParams({ category: slug === "all" ? undefined : slug })}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {name}
          </button>
        );
      })}
    </nav>
  );

  const filterContent = (
    <div className="flex flex-col gap-7">
      <section aria-labelledby="price-filter-title" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 id="price-filter-title" className="text-sm font-semibold">Price range</h3>
          <span className="text-xs text-muted-foreground">{formatPrice(priceFloor)} – {formatPrice(priceCeiling)}</span>
        </div>
        <div className="flex flex-col gap-4">
          <p className="flex items-center justify-between text-sm tabular-nums" aria-live="polite">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </p>
          <Slider
            aria-label="Price range"
            thumbLabels={["Minimum price", "Maximum price"]}
            aria-describedby="price-range-description"
            value={priceRange}
            min={priceFloor}
            max={rangeCeiling}
            minStepsBetweenThumbs={1}
            disabled={priceFloor === priceCeiling}
            onValueChange={(values) => {
              const [nextMinimum, nextMaximum] = values;
              if (nextMinimum !== undefined && nextMaximum !== undefined) {
                setPriceRange([nextMinimum, nextMaximum]);
              }
            }}
            className="min-h-8 w-full"
          />
          <p id="price-range-description" className="sr-only">
            Adjust the minimum and maximum prices using the slider handles.
          </p>
        </div>
      </section>

      <section aria-labelledby="sort-filter-title" className="flex flex-col gap-3">
        <h3 id="sort-filter-title" className="text-sm font-semibold">Sort by</h3>
        <div className="flex flex-col gap-1">
          {sortOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={sort === option.value}
              onClick={() => updateParams({ sort: option.value === "newest" ? undefined : option.value })}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                sort === option.value
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const selectedCategory = categories.find((item) => item.slug === category)?.name ?? "All Products";
  const chips = [
    ...(search ? [{ label: `Search: “${search}”`, remove: () => updateParams({ search: undefined }) }] : []),
    ...(minPrice !== undefined ? [{ label: `From ${formatPrice(minPrice)}`, remove: () => updateParams({ minPrice: undefined }) }] : []),
    ...(maxPrice !== undefined ? [{ label: `Up to ${formatPrice(maxPrice)}`, remove: () => updateParams({ maxPrice: undefined }) }] : []),
    ...(category !== "all" ? [{ label: selectedCategory, remove: () => updateParams({ category: undefined }) }] : []),
    ...(sort !== "newest" ? [{ label: `Sort: ${sortOptions.find((option) => option.value === sort)?.label ?? sort}`, remove: () => updateParams({ sort: undefined }) }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      {categoryList}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-sm">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-full border border-border bg-card px-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="sr-only">Sort products</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value === "newest" ? undefined : event.target.value })}
              className="h-10 rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <p className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm" aria-live="polite">{resultCount} {resultCount === 1 ? "item" : "items"}</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="lg:hidden">
                <SlidersHorizontal data-icon="inline-start" />
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="shop-filter-sheet overflow-y-auto">
              <SheetHeader className="px-0">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine the collection to find your next favorite.</SheetDescription>
              </SheetHeader>
              <div className="px-1">{filterContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-8">
          <aside aria-label="Product filters" className="rounded-2xl border border-border bg-card p-5">
            {filterContent}
            <Button type="button" variant="ghost" className="mt-5 w-full" onClick={clearFilters}>Clear all filters</Button>
          </aside>
          <div className="min-w-0">
            {chips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
                {chips.map((chip) => (
                  <button type="button" key={chip.label} onClick={chip.remove} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-muted/70">
                    {chip.label}<X aria-hidden="true" className="size-3.5" />
                  </button>
                ))}
                <button type="button" onClick={clearFilters} className="px-2 py-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Clear all</button>
              </div>
            )}
            <div aria-busy={isPending} className="relative min-w-0">
              {isPending && <p role="status" className="absolute -top-6 right-0 text-xs text-muted-foreground">Updating products…</p>}
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex flex-col gap-6">
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((chip) => (
              <button type="button" key={chip.label} onClick={chip.remove} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-muted/70">
                {chip.label}<X aria-hidden="true" className="size-3.5" />
              </button>
            ))}
            <button type="button" onClick={clearFilters} className="px-2 py-1 text-xs text-muted-foreground underline underline-offset-4">Clear all</button>
          </div>
        )}
        <div aria-busy={isPending} className="relative min-w-0">
          {isPending && <p role="status" className="absolute -top-6 right-0 text-xs text-muted-foreground">Updating products…</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
