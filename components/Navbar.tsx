import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ShoppingCartIcon from "./ShoppingCartIcon ";
import { Bell, Home } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ProfileButton from "./ProfileButton ";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            SHOP<span className="text-primary">CART</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Discounts
            </Link>
          </div>
        </div>

        <SearchBar />
        <div className="flex items-center gap-6">
          <ShoppingCartIcon />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
