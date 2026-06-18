import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter block mb-6"
            >
              SHOP<span className="text-primary">CART</span>
            </Link>
            <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
              Providing premium hardware and software tools since 2024. Designed
              for performance.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">
              Company
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">
              Support
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">
              Legal
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-10">
          <div className="text-xs text-muted-foreground opacity-60 tracking-wider">
            © 2026 SHOPCART INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground opacity-60 hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
