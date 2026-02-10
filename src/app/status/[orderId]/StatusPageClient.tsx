"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Clock, FileCheck, Printer, CheckCircle, Loader2 } from "lucide-react";

type Order = {
  id: string;
  orderReferenceNumber: string;
  clientName: string;
  orderStatus: "Received" | "In Review" | "Printing" | "Ready for Pickup!";
  notes: string;
  fileName: string;
};

const STATUS_CONFIG = {
  "Received": { color: "bg-yellow-500", icon: Clock },
  "In Review": { color: "bg-blue-500", icon: FileCheck },
  "Printing": { color: "bg-orange-500", icon: Printer },
  "Ready for Pickup!": { color: "bg-green-500", icon: CheckCircle },
};

export default function StatusPageClient() {
  const { orderId } = useParams();
  const { firestore } = useFirebase();

  const orderRef = useMemoFirebase(() => {
    if (!firestore || !orderId) return null;
    return doc(firestore, "orders", orderId as string);
  }, [firestore, orderId]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 text-center">
        <Navbar />
        <h1 className="text-3xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground mt-2">Please double check your reference number.</p>
      </div>
    );
  }

  const StatusIcon = STATUS_CONFIG[order.orderStatus]?.icon || Clock;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono mb-4">
            REF: {order.orderReferenceNumber}
          </Badge>
          <h1 className="text-4xl font-bold">Order Tracking</h1>
        </div>

        <Card className="border-white/5 bg-card overflow-hidden">
          <CardHeader className="text-center pb-12 pt-12">
             <div className="flex justify-center mb-6">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center ${STATUS_CONFIG[order.orderStatus]?.color} shadow-lg ring-8 ring-white/5`}>
                  <StatusIcon className="h-12 w-12 text-white" />
                </div>
             </div>
             <CardTitle className="text-3xl">{order.orderStatus}</CardTitle>
             <CardDescription className="text-lg">Status Updated Recently</CardDescription>
          </CardHeader>
          <CardContent className="p-8 bg-muted/20 border-t border-white/5 space-y-8">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Client Name</p>
                  <p className="text-lg font-medium">{order.clientName}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">File Name</p>
                  <p className="text-lg font-medium truncate">{order.fileName}</p>
               </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Instructions</p>
              <div className="bg-background rounded-lg p-4 text-sm leading-relaxed border border-white/5">
                {order.notes || "No special instructions provided."}
              </div>
            </div>

            <div className="pt-8 flex justify-between items-center text-xs text-muted-foreground border-t border-white/5">
               <p>Print Genie Pro Services</p>
               <p>Powered by AI precision</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
