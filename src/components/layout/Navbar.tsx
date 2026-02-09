
"use client";

import Link from "next/link";
import { Printer, Calculator, PackageSearch, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Printer className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold tracking-tight neon-text">Print Genie</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <Calculator className="h-4 w-4" /> Calculator
          </Link>
          <Link href="/order" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <PackageSearch className="h-4 w-4" /> Start Order
          </Link>
          <Link href="/status" className="text-sm font-medium hover:text-primary transition-colors">
            Track Order
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/admin/login">Admin</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow">
            <Link href="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
