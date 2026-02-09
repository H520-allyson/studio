
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PackageSearch, ArrowRight } from "lucide-react";

export default function TrackingSearch() {
  const [orderRef, setOrderRef] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRef.trim()) {
      router.push(`/status/${orderRef.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 px-4">
      <Navbar />
      <div className="max-w-md mx-auto">
        <Card className="bg-card border-white/5 p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <PackageSearch className="h-8 w-8 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Order</CardTitle>
            <CardDescription>Enter your unique 7-character order reference number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                placeholder="Ex: A1B2C3D"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                className="text-center font-mono text-xl h-14 bg-muted/50 border-white/10"
                maxLength={7}
              />
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Find Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
