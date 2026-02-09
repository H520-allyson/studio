
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Upload, Loader2, ArrowLeft, Store, DollarSign, Clock, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ShopSettingsPage() {
  const { auth, firestore, storage, user } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Shop configuration is stored in a single document named 'main'
  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "shop_configuration", "main");
  }, [firestore]);

  const { data: config, isLoading: configLoading } = useDoc(configRef);

  const [formData, setFormData] = useState({
    shopName: "Print Genie",
    logoUrl: "",
    currency: "PHP",
    businessHours: "Mon-Fri: 9am-6pm",
    aboutUsText: "We provide high-quality professional printing services powered by AI.",
    contactInformation: "123 Design Lane, Creative City",
    defaultPricingFormula: "base_price * quantity * finish_multiplier",
  });

  useEffect(() => {
    if (config) {
      setFormData({
        shopName: config.shopName || "Print Genie",
        logoUrl: config.logoUrl || "",
        currency: config.currency || "PHP",
        businessHours: config.businessHours || "Mon-Fri: 9am-6pm",
        aboutUsText: config.aboutUsText || "",
        contactInformation: config.contactInformation || "",
        defaultPricingFormula: config.defaultPricingFormula || "base_price * quantity * finish_multiplier",
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !configRef) return;

    setSaving(true);
    try {
      await setDoc(configRef, {
        ...formData,
        updatedAt: new Date(),
      }, { merge: true });
      toast({ title: "Settings Saved", description: "Shop configuration has been updated successfully." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(true);
      // Wait a beat to show the success state
      setTimeout(() => setSaving(false), 500);
    }
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
             <Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
           </Button>
           <div className="h-4 w-px bg-white/10 mx-2" />
           <div className="flex items-center gap-2">
             <Settings className="h-5 w-5 text-primary" />
             <span className="font-bold text-lg">Shop Settings</span>
           </div>
         </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-8">
          <Card className="border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Shop Identity
              </CardTitle>
              <CardDescription>Basic information about your business.</CardDescription>
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
                    placeholder="e.g. PHP"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Shop Logo</Label>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-lg border border-white/10 bg-muted/20 flex items-center justify-center overflow-hidden relative group">
                    {formData.logoUrl ? (
                      <Image src={formData.logoUrl} alt="Logo Preview" fill className="object-contain p-2" />
                    ) : (
                      <Store className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                      <Button asChild variant="outline" size="sm" className="border-white/10">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                          {formData.logoUrl ? "Change Logo" : "Upload Logo"}
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: PNG or SVG with transparent background.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Pricing & Operations
              </CardTitle>
              <CardDescription>Configure how your shop calculates costs and when it operates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="formula">Pricing Logic Formula</Label>
                <Input 
                  id="formula" 
                  value={formData.defaultPricingFormula} 
                  onChange={e => setFormData(p => ({ ...p, defaultPricingFormula: e.target.value }))}
                  className="bg-muted/30 border-white/10 font-mono"
                />
                <p className="text-[10px] text-muted-foreground">Available variables: base_price, quantity, finish_multiplier</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Business Hours
                </Label>
                <Input 
                  id="hours" 
                  value={formData.businessHours} 
                  onChange={e => setFormData(p => ({ ...p, businessHours: e.target.value }))}
                  className="bg-muted/30 border-white/10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About & Contact
              </CardTitle>
              <CardDescription>Information displayed on your landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about">About Us Description</Label>
                <Textarea 
                  id="about" 
                  value={formData.aboutUsText} 
                  onChange={e => setFormData(p => ({ ...p, aboutUsText: e.target.value }))}
                  className="bg-muted/30 border-white/10 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Textarea 
                  id="contact" 
                  value={formData.contactInformation} 
                  onChange={e => setFormData(p => ({ ...p, contactInformation: e.target.value }))}
                  className="bg-muted/30 border-white/10 min-h-[80px]"
                  placeholder="Address, Phone, Email..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground font-bold px-8 neon-glow">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
