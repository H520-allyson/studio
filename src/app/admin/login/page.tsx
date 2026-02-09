"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    
    setLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create the admin role entry
        await setDoc(doc(firestore, "roles_admin", userCredential.user.uid), {
          email: email,
          role: "admin",
          createdAt: new Date(),
        });
        toast({ title: "Account Created", description: "You are now an admin." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast({
        title: isRegistering ? "Registration Failed" : "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-white/5 bg-card shadow-2xl overflow-hidden">
        <div className="h-2 bg-primary neon-glow" />
        <CardHeader className="text-center pt-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {isRegistering ? (
              <UserPlus className="h-8 w-8 text-primary" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {isRegistering ? "Create Admin Account" : "Admin Portal"}
          </CardTitle>
          <CardDescription>
            {isRegistering ? "Register as a new shop administrator" : "Restricted access for Print Genie staff"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-muted/50 border-white/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-muted/50 border-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12">
              {loading ? "Processing..." : isRegistering ? "Create Admin Account" : "Secure Login"}
            </Button>
            
            <div className="text-center">
              <Button 
                type="button" 
                variant="link" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-muted-foreground hover:text-primary"
              >
                {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}