
"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PrintAssistant } from "@/components/chat/PrintAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Image as ImageIcon, Layout, Printer, Mail, Phone, MapPin, Zap, Loader2 } from "lucide-react";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const { firestore } = useFirebase();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-printing');
  const bizCardsImg = PlaceHolderImages.find(img => img.id === 'service-business-cards');
  const bannersImg = PlaceHolderImages.find(img => img.id === 'service-banners');
  const customPrintsImg = PlaceHolderImages.find(img => img.id === 'service-custom-prints');

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "shop_configuration", "main");
  }, [firestore]);

  const { data: config, isLoading } = useDoc(configRef);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                <Zap className="h-4 w-4" /> AI-Enhanced Printing Shop
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                {config?.heroTitle || "Print Your Vision with Precision"}
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                {config?.heroSubtitle || "High-resolution printing, professional finishes, and AI-powered quality checks. From business cards to massive banners, we bring your ideas to life."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-8 neon-glow">
                  <Link href="/order">Start Your Order</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 border-white/20 hover:bg-white/5 font-bold">
                  <Link href="/calculator">Estimate Cost</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-muted/20">
              {heroImg?.imageUrl ? (
                <Image 
                  src={heroImg.imageUrl} 
                  alt={heroImg.description || "Hero Image"}
                  width={1200}
                  height={600}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint={heroImg.imageHint}
                />
              ) : (
                <div className="aspect-[2/1] flex items-center justify-center">
                  <Printer className="h-12 w-12 text-muted-foreground opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Our Professional Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a wide range of printing solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Business Cards", 
                desc: "Premium cardstock and high-quality finishes to leave a lasting impression.",
                icon: CreditCard,
                img: bizCardsImg
              },
              { 
                title: "Large Format Banners", 
                desc: "Vibrant colors and durable materials for indoor and outdoor advertising.",
                icon: Layout,
                img: bannersImg
              },
              { 
                title: "Custom Prints", 
                desc: "Custom wall art, posters, and specialty materials for unique projects.",
                icon: ImageIcon,
                img: customPrintsImg
              }
            ].map((service, idx) => (
              <Card key={idx} className="bg-card border-white/5 hover:border-primary/50 transition-all group overflow-hidden">
                <div className="h-48 relative bg-muted/10">
                  {service.img?.imageUrl ? (
                    <Image 
                      src={service.img.imageUrl} 
                      alt={service.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      data-ai-hint={service.img.imageHint}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <service.icon className="h-8 w-8 text-muted-foreground opacity-20" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
            <Printer className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Precision at Every Pixel</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {config?.aboutUsText || "At Print Genie, we combine decades of printing expertise with cutting-edge AI technology."}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a custom request or a question? Our team is here to help.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Email Us</p>
                  <p className="text-muted-foreground">hello@printgenie.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Call Us</p>
                  <p className="text-muted-foreground">+1 (555) 000-PRINT</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Visit Shop</p>
                  <p className="text-muted-foreground">{config?.contactInformation || "123 Design Lane, ST 90210"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-background border-white/5 p-8 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input className="w-full bg-muted/50 border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input className="w-full bg-muted/50 border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Doe" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input className="w-full bg-muted/50 border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="jane@example.com" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full bg-muted/50 border-white/10 rounded-md p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us about your project..." />
             </div>
             <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12">
               Send Message
             </Button>
          </Card>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} {config?.shopName || "Print Genie"}. All rights reserved.</p>
      </footer>

      <PrintAssistant />
    </div>
  );
}
