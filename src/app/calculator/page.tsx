
"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Calculator, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PRODUCT_PRICES: Record<string, number> = {
  "business-cards": 0.25,
  "flyers": 0.40,
  "posters": 5.00,
  "banners": 15.00,
  "custom": 2.00,
};

const FINISH_MULTIPLIER: Record<string, number> = {
  "matte": 1,
  "glossy": 1.1,
  "laminated": 1.3,
  "uv-coated": 1.5,
};

export default function CalculatorPage() {
  const [product, setProduct] = useState("business-cards");
  const [size, setSize] = useState("a4");
  const [quantity, setQuantity] = useState(100);
  const [finish, setFinish] = useState("matte");

  const totalEstimate = useMemo(() => {
    const base = PRODUCT_PRICES[product] || 1;
    const finishMod = FINISH_MULTIPLIER[finish] || 1;
    let sizeMod = 1;

    if (size === "a3") sizeMod = 1.8;
    if (size === "custom") sizeMod = 2.5;

    return (base * quantity * finishMod * sizeMod).toFixed(2);
  }, [product, size, quantity, finish]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Calculator className="text-primary h-8 w-8" />
            Cost Estimator
          </h1>
          <p className="text-muted-foreground">
            Get an instant quote for your printing project. Prices are estimates and subject to final review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 border-white/5 bg-card">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Select your project details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business-cards">Business Cards</SelectItem>
                    <SelectItem value="flyers">Flyers</SelectItem>
                    <SelectItem value="posters">Posters</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                    <SelectItem value="custom">Custom Print</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">Standard A4</SelectItem>
                    <SelectItem value="a3">Large A3</SelectItem>
                    <SelectItem value="custom">Custom Dimensions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Quantity</Label>
                  <span className="font-bold text-primary">{quantity} units</span>
                </div>
                <Slider
                  min={1}
                  max={1000}
                  step={1}
                  value={[quantity]}
                  onValueChange={(val) => setQuantity(val[0])}
                  className="py-4"
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-muted/30 w-32"
                />
              </div>

              <div className="space-y-2">
                <Label>Finish</Label>
                <Select value={finish} onValueChange={setFinish}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a finish" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matte">Matte</SelectItem>
                    <SelectItem value="glossy">Glossy</SelectItem>
                    <SelectItem value="laminated">Laminated</SelectItem>
                    <SelectItem value="uv-coated">UV Coated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 h-fit sticky top-24 neon-glow">
            <CardHeader>
              <CardTitle className="text-lg">Estimated Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center py-8">
              <div className="flex items-center justify-center gap-1 text-5xl font-bold text-primary">
                <DollarSign className="h-8 w-8" />
                <span>{totalEstimate}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Base Price + {finish.charAt(0).toUpperCase() + finish.slice(1)} finish
              </p>
              <div className="pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Link href="/order" className="flex items-center gap-2">
                    Start Order <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
