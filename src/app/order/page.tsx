
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageSearch, Upload, CheckCircle2, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageResolutionPrecheck } from "@/ai/flows/image-resolution-precheck";
import Link from "next/link";

export default function OrderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [checkingImage, setCheckingImage] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setAiWarning(null);

    // AI Resolution Pre-check
    if (selectedFile.type.startsWith("image/")) {
      setCheckingImage(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUri = reader.result as string;
          // Simulation of print size (e.g., user wants 24x36 inches)
          const result = await imageResolutionPrecheck({
            photoDataUri: dataUri,
            printWidthInches: 24,
            printHeightInches: 36,
          });

          if (!result.isSufficientResolution) {
            setAiWarning(result.warningMessage || "Low resolution detected.");
          }
        };
        reader.readAsDataURL(selectedFile);
      } catch (err) {
        console.error("AI Check failed", err);
      } finally {
        setCheckingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email) return;

    setUploading(true);
    const orderRefId = Math.random().toString(36).substring(2, 9).toUpperCase();
    
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `orders/${orderRefId}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error("Upload failed", error);
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 2. Save to Firestore
          const docRef = await addDoc(collection(db, "orders"), {
            orderReferenceNumber: orderRefId,
            clientName: name,
            clientEmail: email,
            notes: notes,
            fileUrl: downloadUrl,
            fileName: file.name,
            orderStatus: "Received",
            orderDate: serverTimestamp(),
          });

          setOrderId(orderRefId);
          setIsDone(true);
          setUploading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-primary/20 bg-primary/5 text-center p-8 space-y-6 neon-glow">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your business. We've received your files.</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-white/5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Reference Number</p>
            <p className="text-2xl font-mono text-primary font-bold">{orderId}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-primary text-primary-foreground font-bold">
              <Link href={`/status/${orderId}`}>Track Order Status</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
            <PackageSearch className="text-primary h-8 w-8" />
            Place Your Order
          </h1>
          <p className="text-muted-foreground">
            Complete the form below to start your professional printing project.
          </p>
        </div>

        <Card className="border-white/5 bg-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle>Project Submission</CardTitle>
            <CardDescription>Tell us what you need and upload your files.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="Jane Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="bg-muted/30 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="jane@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted/30 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Instructions</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Detailed requirements (materials, dimensions, specific finishes...)" 
                  className="bg-muted/30 border-white/10 min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Print File</Label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative group bg-muted/10">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{file ? file.name : "Select JPEG, PNG, or PDF"}</p>
                      <p className="text-xs text-muted-foreground">Max file size: 50MB</p>
                    </div>
                  </div>
                </div>

                {checkingImage && (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI is analyzing image quality...
                  </div>
                )}

                {aiWarning && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Image Quality Warning</AlertTitle>
                    <AlertDescription>{aiWarning}</AlertDescription>
                  </Alert>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Uploading files...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/5" />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={uploading || checkingImage || !file} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg neon-glow"
              >
                {uploading ? "Processing..." : "Submit Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
