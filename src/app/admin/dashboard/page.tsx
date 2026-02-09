
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trash2, FileText, LayoutDashboard, LogOut, Loader2, Sparkles } from "lucide-react";
import { summarizePrintingInstructions } from "@/ai/flows/summarize-printing-instructions";
import { useToast } from "@/hooks/use-toast";

type Order = {
  id: string;
  orderReferenceNumber: string;
  clientName: string;
  clientEmail: string;
  orderStatus: string;
  notes: string;
  fileUrl: string;
  fileName: string;
  orderDate: any;
  aiSummary?: string;
};

const STATUS_COLORS: Record<string, string> = {
  "Received": "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  "In Review": "bg-blue-500/20 text-blue-500 border-blue-500/50",
  "Printing": "bg-orange-500/20 text-orange-500 border-orange-500/50",
  "Ready for Pickup!": "bg-green-500/20 text-green-500 border-green-500/50",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
    });

    const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
    const unsubOrders = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubOrders();
    };
  }, [router]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { orderStatus: newStatus });
      toast({ title: "Status Updated", description: `Order status changed to ${newStatus}` });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", id));
        toast({ title: "Order Deleted", description: "The order has been removed." });
      } catch (err: any) {
        toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
      }
    }
  };

  const handleSummarize = async (id: string, notes: string) => {
    if (!notes) return;
    try {
      const { summary } = await summarizePrintingInstructions({ notes });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, aiSummary: summary } : o));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 px-8 h-16 flex items-center justify-between">
         <div className="flex items-center gap-2">
           <LayoutDashboard className="h-5 w-5 text-primary" />
           <span className="font-bold text-lg">Admin Dashboard</span>
         </div>
         <Button variant="ghost" size="sm" onClick={() => signOut(auth)} className="text-muted-foreground hover:text-destructive">
           <LogOut className="h-4 w-4 mr-2" /> Logout
         </Button>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">Manage and track all customer printing orders.</p>
          </div>
          <div className="flex gap-4">
             <Card className="bg-card/50 border-white/5 px-4 py-2 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Active Orders:</span>
                <span className="text-xl font-bold text-primary">{orders.filter(o => o.orderStatus !== "Ready for Pickup!").length}</span>
             </Card>
          </div>
        </div>

        <Card className="border-white/5 bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/10">
                <TableHead>Ref Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="font-mono text-primary font-bold">{order.orderReferenceNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.clientName}</span>
                      <span className="text-xs text-muted-foreground">{order.clientEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.orderDate?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={order.orderStatus} onValueChange={(val) => handleUpdateStatus(order.id, val)}>
                      <SelectTrigger className={`w-[140px] h-8 text-xs font-bold border-none ${STATUS_COLORS[order.orderStatus] || ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Printing">Printing</SelectItem>
                        <SelectItem value="Ready for Pickup!">Ready for Pickup!</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="space-y-2">
                      <p className="text-xs truncate">{order.notes || "No notes"}</p>
                      {order.aiSummary ? (
                        <div className="p-2 bg-primary/10 rounded border border-primary/20 text-[10px] italic">
                          <Sparkles className="h-3 w-3 inline mr-1 text-primary" />
                          {order.aiSummary}
                        </div>
                      ) : (
                        order.notes && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] p-0 text-primary hover:bg-transparent"
                            onClick={() => handleSummarize(order.id, order.notes)}
                          >
                            Summarize with AI
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon" className="h-8 w-8 border-white/10 hover:bg-primary/20">
                        <a href={order.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(order.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    No orders found in the database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
