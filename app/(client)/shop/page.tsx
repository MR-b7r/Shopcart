import type { Metadata } from "next";
import { ShopPage, type ShopSearchParams } from "@/components/shop/ShopPage";

export const metadata: Metadata = {
  title: "Shop the Collection | B7R Store",
  description: "Browse clothing, shoes, bags, and accessories at B7R Store.",
};

export default function ShopRoute({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  return <ShopPage searchParams={searchParams} />;
}
