
"use client";

import { useState, useMemo } from "react";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Calculator, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DEFAULT_FINISHES = [
  { id: "matte", name: "Matte", multiplier: 1 },
  { id: "glossy", name: "Glossy", multiplier: 1.1 },
  { id: "laminated", name: "Laminated", multiplier: 1.3 },
  { id: "uv-coated", name: "UV Coated", multiplier: 1.5 },
];

export default function CalculatorPage() {
  const { firestore } = useFirebase();
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("a4");
  const [quantity, setQuantity] = useState(100);
  const [finishId, setFinishId] = useState("matte");

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "shop_configuration", "main");
  }, [firestore]);

  const { data: config, isLoading } = useDoc(configRef);

  // Initialize selected product when config loads
  useMemo(() => {
    if (config?.products?.length && !productId) {
      setProductId(config.products[0].id);
    }
  }, [config, productId]);

  const totalEstimate = useMemo(() => {
    if (!config || !productId) return "0.00";
    
    const product = config.products?.find((p: any) => p.id === productId);
    const base = product?.basePrice || 0;
    
    const finishes = config.finishes || DEFAULT_FINISHES;
    const finish = finishes.find((f: any) => f.id === finishId);
    const finishMod = finish?.multiplier || 1;
    
    let sizeMod = 1;
    if (size === "a3") sizeMod = 1.8;
    if (size === "custom") sizeMod = 2.5;

    return (base * quantity * finishMod * sizeMod).toFixed(2);
  }, [config, productId, size, quantity, finishId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

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
            Get an instant quote based on current {config?.shopName || "Print Genie"} pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 border-white/5 bg-card">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Select project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {(config?.products || []).map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
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
                <Select value={finishId} onValueChange={setFinishId}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a finish" />
                  </SelectTrigger>
                  <SelectContent>
                    {(config?.finishes || DEFAULT_FINISHES).map((f: any) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
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
                <span className="text-2xl mr-1">{config?.currency || "PHP"}</span>
                <span>{totalEstimate}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pricing updated live from shop settings
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
