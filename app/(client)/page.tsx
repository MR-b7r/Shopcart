'use client';

import Link from 'next/link';
import {
  ShoppingBasket,
  Shirt,
  Footprints,
  Glasses,
  Briefcase,
  Venus,
  Hand,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { name: 'All', icon: <ShoppingBasket className="w-5 h-5" />, slug: 'all' },
  { name: 'T-shirts', icon: <Shirt className="w-5 h-5" />, slug: 't-shirts' },
  { name: 'Shoes', icon: <Footprints className="w-5 h-5" />, slug: 'shoes' },
  { name: 'Accessories', icon: <Glasses className="w-5 h-5" />, slug: 'accessories' },
  { name: 'Bags', icon: <Briefcase className="w-5 h-5" />, slug: 'bags' },
  { name: 'Dresses', icon: <Venus className="w-5 h-5" />, slug: 'dresses' },
  { name: 'Jackets', icon: <Shirt className="w-5 h-5" />, slug: 'jackets' },
  { name: 'Gloves', icon: <Hand className="w-5 h-5" />, slug: 'gloves' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              SHOP<span className="text-primary">CART</span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">New Arrivals</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Categories</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden lg:block">
            <Input
              type="text"
              placeholder="Search products, brands, and more..."
              className="rounded-full bg-secondary border-border"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:text-muted-foreground transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <Button variant="ghost" className="text-sm">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 text-xs font-semibold text-primary uppercase tracking-widest">Introducing Summer &apos;24</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Shop Smarter,<br />Faster, Better.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the next generation of digital commerce with a high-performance interface designed for speed and clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Shop Now</Button>
            <Button size="lg" variant="outline">
              Browse Categories
            </Button>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      </section>

      {/* Featured Categories Marquee */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              Collections
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Categories</h2>
          </div>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View All
          </Link>
        </div>

        <div className="overflow-hidden mask-image-gradient">
          <div className="flex gap-4 w-max animate-marquee">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-full whitespace-nowrap hover:bg-secondary hover:scale-105 transition-all flex-shrink-0"
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
            {categories.map((cat) => (
              <Link
                key={`${cat.slug}-dup`}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-full whitespace-nowrap hover:bg-secondary hover:scale-105 transition-all flex-shrink-0"
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-10">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Handpicked
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Essential Gear</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="aspect-[4/3] bg-background relative flex items-center justify-center p-12 border-b border-border">
              <div className="w-full h-full bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground italic">
                Product Image
              </div>
              <div className="absolute top-4 right-4 text-xs font-semibold text-primary bg-background/50 backdrop-blur px-3 py-1 rounded-full">
                New
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Quantum Headphones</h3>
                  <p className="text-sm text-muted-foreground">Noise-cancelling, 40h battery</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Price</div>
                  <div className="text-2xl font-semibold tracking-tight">$299</div>
                </div>
              </div>
              <div className="space-y-6 mt-auto">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Size</div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-border rounded-full bg-foreground text-background hover:opacity-80">
                        STD
                      </button>
                      <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-secondary">
                        PRO
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Color</div>
                    <div className="flex gap-2">
                      <button className="w-6 h-6 rounded-full bg-black border-2 border-white hover:scale-110" />
                      <button className="w-6 h-6 rounded-full bg-[#333] hover:scale-110" />
                      <button className="w-6 h-6 rounded-full bg-[#1c1c1c] hover:scale-110" />
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="aspect-[4/3] bg-background relative flex items-center justify-center p-12 border-b border-border">
              <div className="w-full h-full bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground italic">
                Product Image
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Nexus Smartwatch</h3>
                  <p className="text-sm text-muted-foreground">Titanium case, Always-on</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Price</div>
                  <div className="text-2xl font-semibold tracking-tight">$449</div>
                </div>
              </div>
              <div className="space-y-6 mt-auto">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Wrist Size</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-secondary">
                      S
                    </button>
                    <button className="px-3 py-1 text-sm border border-border rounded-full bg-foreground text-background hover:opacity-80">
                      M
                    </button>
                    <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-secondary">
                      L
                    </button>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="aspect-[4/3] bg-background relative flex items-center justify-center p-12 border-b border-border">
              <div className="w-full h-full bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground italic">
                Product Image
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Core Tablet Air</h3>
                  <p className="text-sm text-muted-foreground">M3 Chip, 13&quot; Retina display</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Price</div>
                  <div className="text-2xl font-semibold tracking-tight">$899</div>
                </div>
              </div>
              <div className="space-y-6 mt-auto">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Storage</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-border rounded-full bg-foreground text-background hover:opacity-80">
                      256GB
                    </button>
                    <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-secondary">
                      512GB
                    </button>
                    <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-secondary">
                      1TB
                    </button>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-primary text-primary-foreground p-12 md:p-16 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Limited Time Offer</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Summer Speed Sale</h2>
            <p className="text-lg font-medium opacity-90 max-w-lg">
              Get up to 40% off on all selected audio gear. Fast delivery guaranteed.
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
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Logistics</div>
            <h4 className="text-lg font-semibold mb-2">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">Free shipping on all orders over $150.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Safety</div>
            <h4 className="text-lg font-semibold mb-2">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">100% encrypted checkout process.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Policy</div>
            <h4 className="text-lg font-semibold mb-2">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">30-day no-questions return policy.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center sm:text-left">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Contact</div>
            <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Round-the-clock expert assistance.</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Updates</div>
        <h2 className="text-3xl font-bold mb-6">Stay in the Loop</h2>
        <p className="text-muted-foreground mb-10">
          Subscribe to receive first access to product drops and exclusive member-only deals.
        </p>
        <form className="flex flex-col sm:flex-row gap-3">
          <Input type="email" placeholder="email@example.com" className="flex-1" />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/" className="text-xl font-bold tracking-tighter block mb-6">
                SHOP<span className="text-primary">CART</span>
              </Link>
              <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
                Providing premium hardware and software tools since 2024. Designed for performance.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">Support</h5>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">Legal</h5>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-10">
            <div className="text-xs text-muted-foreground opacity-60 tracking-wider">
              © 2024 SHOPCART INC. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors">Instagram</Link>
              <Link href="#" className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
