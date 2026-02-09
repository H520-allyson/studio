
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Upload, Loader2, ArrowLeft, Store, DollarSign, Clock, Info, Plus, Trash2, Layout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ShopSettingsPage() {
  const { firestore, storage } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "shop_configuration", "main");
  }, [firestore]);

  const { data: config, isLoading: configLoading } = useDoc(configRef);

  const [formData, setFormData] = useState({
    shopName: "Print Genie",
    logoUrl: "",
    currency: "PHP",
    heroTitle: "Print Your Vision with Precision",
    heroSubtitle: "High-resolution printing, professional finishes, and AI-powered quality checks.",
    businessHours: "Mon-Fri: 9am-6pm",
    aboutUsText: "We provide high-quality professional printing services powered by AI.",
    contactInformation: "123 Design Lane, Creative City",
    products: [
      { id: "business-cards", name: "Business Cards", basePrice: 0.25 },
      { id: "flyers", name: "Flyers", basePrice: 0.40 },
      { id: "posters", name: "Posters", basePrice: 5.00 },
    ],
    finishes: [
      { id: "matte", name: "Matte", multiplier: 1 },
      { id: "glossy", name: "Glossy", multiplier: 1.1 },
    ]
  });

  useEffect(() => {
    if (config) {
      setFormData({
        shopName: config.shopName || "Print Genie",
        logoUrl: config.logoUrl || "",
        currency: config.currency || "PHP",
        heroTitle: config.heroTitle || "Print Your Vision with Precision",
        heroSubtitle: config.heroSubtitle || "High-resolution printing, professional finishes, and AI-powered quality checks.",
        businessHours: config.businessHours || "Mon-Fri: 9am-6pm",
        aboutUsText: config.aboutUsText || "",
        contactInformation: config.contactInformation || "",
        products: config.products || [],
        finishes: config.finishes || [],
      });
    }
  }, [config]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `shop/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, logoUrl: url }));
      toast({ title: "Logo Uploaded", description: "Remember to save your changes." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!firestore || !configRef) return;

    setSaving(true);
    try {
      await setDoc(configRef, {
        ...formData,
        updatedAt: new Date(),
      }, { merge: true });
      toast({ title: "Settings Saved", description: "Shop configuration updated." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => {
    setFormData(p => ({
      ...p,
      products: [...p.products, { id: Math.random().toString(36).substr(2, 9), name: "New Product", basePrice: 1.00 }]
    }));
  };

  const removeProduct = (id: string) => {
    setFormData(p => ({ ...p, products: p.products.filter(item => item.id !== id) }));
  };

  const updateProduct = (id: string, field: string, value: string | number) => {
    setFormData(p => ({
      ...p,
      products: p.products.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  if (configLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 px-8 h-16 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <Button asChild variant="ghost" size="sm">
             <Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Dashboard</Link>
           </Button>
           <div className="h-4 w-px bg-white/10 mx-2" />
           <div className="flex items-center gap-2">
             <Settings className="h-5 w-5 text-primary" />
             <span className="font-bold text-lg">Shop Customizer</span>
           </div>
         </div>
         <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground font-bold px-8 neon-glow">
           {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
           Save All Changes
         </Button>
      </nav>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="identity" className="space-y-8">
          <TabsList className="bg-muted/50 border border-white/5 p-1">
            <TabsTrigger value="identity" className="gap-2"><Store className="h-4 w-4" /> Identity</TabsTrigger>
            <TabsTrigger value="layout" className="gap-2"><Layout className="h-4 w-4" /> UI & Layout</TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2"><DollarSign className="h-4 w-4" /> Pricing</TabsTrigger>
            <TabsTrigger value="about" className="gap-2"><Info className="h-4 w-4" /> About & Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <Card className="border-white/5 bg-card">
              <CardHeader>
                <CardTitle>Shop Identity</CardTitle>
                <CardDescription>Basic branding elements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input 
                      id="shopName" 
                      value={formData.shopName} 
                      onChange={e => setFormData(p => ({ ...p, shopName: e.target.value }))}
                      className="bg-muted/30 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Base Currency</Label>
                    <Input 
                      id="currency" 
                      value={formData.currency} 
                      onChange={e => setFormData(p => ({ ...p, currency: e.target.value }))}
                      className="bg-muted/30 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Shop Logo</Label>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-lg border border-white/10 bg-muted/20 flex items-center justify-center overflow-hidden relative">
                      {formData.logoUrl ? (
                        <Image src={formData.logoUrl} alt="Logo Preview" fill className="object-contain p-2" />
                      ) : (
                        <Store className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                      <Button asChild variant="outline" size="sm" className="border-white/10">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                          {formData.logoUrl ? "Change Logo" : "Upload Logo"}
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card className="border-white/5 bg-card">
              <CardHeader>
                <CardTitle>Home Page Layout</CardTitle>
                <CardDescription>Customize the text seen by visitors on the landing page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Hero Main Title</Label>
                  <Input 
                    value={formData.heroTitle} 
                    onChange={e => setFormData(p => ({ ...p, heroTitle: e.target.value }))}
                    className="bg-muted/30 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle Description</Label>
                  <Textarea 
                    value={formData.heroSubtitle} 
                    onChange={e => setFormData(p => ({ ...p, heroSubtitle: e.target.value }))}
                    className="bg-muted/30 border-white/10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="border-white/5 bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Catalog & Pricing</CardTitle>
                  <CardDescription>Manage the items available in the cost estimator.</CardDescription>
                </div>
                <Button onClick={addProduct} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                  <div className="col-span-7">Product Name</div>
                  <div className="col-span-4">Base Price ({formData.currency})</div>
                  <div className="col-span-1"></div>
                </div>
                {formData.products.map((product) => (
                  <div key={product.id} className="grid grid-cols-12 gap-4 items-center bg-muted/20 p-2 rounded-lg border border-white/5">
                    <div className="col-span-7">
                      <Input 
                        value={product.name} 
                        onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                        className="h-9 bg-transparent border-white/10"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input 
                        type="number"
                        step="0.01"
                        value={product.basePrice} 
                        onChange={(e) => updateProduct(product.id, "basePrice", parseFloat(e.target.value))}
                        className="h-9 bg-transparent border-white/10"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card className="border-white/5 bg-card">
              <CardHeader>
                <CardTitle>About & Operations</CardTitle>
                <CardDescription>Information shown in the footer and about section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>About Us Description</Label>
                  <Textarea 
                    value={formData.aboutUsText} 
                    onChange={e => setFormData(p => ({ ...p, aboutUsText: e.target.value }))}
                    className="bg-muted/30 border-white/10 min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Information</Label>
                  <Textarea 
                    value={formData.contactInformation} 
                    onChange={e => setFormData(p => ({ ...p, contactInformation: e.target.value }))}
                    className="bg-muted/30 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Business Hours</Label>
                  <Input 
                    value={formData.businessHours} 
                    onChange={e => setFormData(p => ({ ...p, businessHours: e.target.value }))}
                    className="bg-muted/30 border-white/10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
