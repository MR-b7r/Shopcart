"use client";
import {
  Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  Venus,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const categories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
  },
  {
    name: "T-shirts",
    icon: <Shirt className="w-4 h-4" />,
    slug: "t-shirts",
  },
  {
    name: "Shoes",
    icon: <Footprints className="w-4 h-4" />,
    slug: "shoes",
  },
  {
    name: "Accessories",
    icon: <Glasses className="w-4 h-4" />,
    slug: "accessories",
  },
  {
    name: "Bags",
    icon: <Briefcase className="w-4 h-4" />,
    slug: "bags",
  },
  {
    name: "Dresses",
    icon: <Venus className="w-4 h-4" />,
    slug: "dresses",
  },
  {
    name: "Jackets",
    icon: <Shirt className="w-4 h-4" />,
    slug: "jackets",
  },
  {
    name: "Gloves",
    icon: <Hand className="w-4 h-4" />,
    slug: "gloves",
  },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get("category");

  function handleChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category || "all");
    router.push(`products?${params.toString()}`, { scroll: false });
  }
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Collections
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View All Categories
        </Link>
      </div>

      <div className="overflow-hidden marquee-container">
        <div
          className="flex gap-4 w-max 
          marquee-track"
        >
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => handleChange(cat.slug)}
              className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-full whitespace-nowrap hover:bg-secondary hover:scale-105 transition-all flex-shrink-0"
            >
              {cat.icon}
              <span>{cat.name}</span>
            </div>
          ))}
          {categories.map((cat) => (
            <div
              key={`${cat.slug}-dup`}
              onClick={() => handleChange(cat.slug)}
              className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-full whitespace-nowrap hover:bg-secondary hover:scale-105 transition-all flex-shrink-0"
            >
              {cat.icon}
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
