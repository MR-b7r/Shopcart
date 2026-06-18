import Link from "next/link";
import {
  ShoppingBasket,
  Shirt,
  Footprints,
  Glasses,
  Briefcase,
  Venus,
  Hand,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const category = (await searchParams).category;

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 text-xs font-semibold text-primary uppercase tracking-widest">
            Introducing Summer &apos;24
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Shop Smarter,
            <br />
            Faster, Better.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the next generation of digital commerce with a
            high-performance interface designed for speed and clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Shop Now</Button>
            <Button size="lg" variant="outline">
              Browse Categories
            </Button>
          </div>
        </div>
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" /> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] hero-glow pointer-events-none" />
      </section>

      {/* Featured Categories*/}
      <Categories />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              Products
            </div>
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
          </div>
          <Link
            href={category ? `/products/?category=${category}` : "/products"}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all products
          </Link>
        </div>

        <ProductList category={""} params="homepage" />
      </section>

      {/* Deals Banner */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-primary text-primary-foreground p-12 md:p-16 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
              Limited Time Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Summer Speed Sale
            </h2>
            <p className="text-lg font-medium opacity-90 max-w-lg">
              Get up to 40% off on all selected audio gear. Fast delivery
              guaranteed.
            </p>
          </div>
          <Button className="relative z-10 bg-background text-foreground hover:bg-background/90 px-10 py-6 text-base">
            Get the Deal
          </Button>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-r from-transparent to-white/10 skew-x-12 translate-x-20" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Logistics
            </div>
            <h4 className="text-lg font-semibold mb-2">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">
              Free shipping on all orders over $150.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Safety
            </div>
            <h4 className="text-lg font-semibold mb-2">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">
              100% encrypted checkout process.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Policy
            </div>
            <h4 className="text-lg font-semibold mb-2">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">
              30-day no-questions return policy.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Contact
            </div>
            <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">
              Round-the-clock expert assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
          Updates
        </div>
        <h2 className="text-3xl font-bold mb-6">Stay in the Loop</h2>
        <p className="text-muted-foreground mb-10">
          Subscribe to receive first access to product drops and exclusive
          member-only deals.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-2xl items-center justify-center">
          <Input
            type="email"
            placeholder="email@example.com"
            className="flex-1 py-4 px-6"
          />
          <Button type="submit" className="py-4 px-6">
            Subscribe
          </Button>
        </form>
      </section>
    </main>
  );
}
