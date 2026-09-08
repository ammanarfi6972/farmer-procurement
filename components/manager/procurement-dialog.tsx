"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Scale, XCircle, CheckCircle } from "lucide-react";
import { processProcurement } from "@/lib/manager/actions";
import { toast } from "sonner";

export function ProcurementDialog({ 
  booking, 
  children 
}: { 
  booking: any;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(booking.expected_quantity.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleProcess(isAccepted: boolean) {
    if (!quantity || isNaN(parseFloat(quantity))) {
      setError("Please enter a valid weighed quantity.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("bookingId", booking.id);
    formData.append("commodityId", booking.commodities.id);
    formData.append("quantity", quantity);
    formData.append("isAccepted", isAccepted ? "true" : "false");

    const result = await processProcurement(formData);
    
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      if (isAccepted) {
        toast.success("SMS Sent to Farmer", {
          description: `Receipt generated for ${quantity} Qtl. Value will be credited shortly.`,
          duration: 8000,
          className: "!bg-slate-900 !border !border-emerald-500/30 !text-white shadow-xl shadow-emerald-900/20",
          descriptionClassName: "!text-emerald-400 font-medium mt-1",
        });
      } else {
        toast.error("SMS Sent to Farmer", {
          description: `Your produce was rejected due to quality check failure.`,
          duration: 8000,
          className: "!bg-slate-900 !border !border-rose-500/30 !text-white shadow-xl shadow-rose-900/20",
          descriptionClassName: "!text-rose-400 font-medium mt-1",
        });
      }
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl text-slate-50 border-indigo-500/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-orange-500">Process Procurement</DialogTitle>
          <DialogDescription className="text-slate-400">
            Record actual weight and log quality assay results for booking <span className="font-mono text-indigo-300 bg-indigo-900/30 px-1 rounded">{booking.booking_number}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950/50 p-4 rounded-xl border border-indigo-500/10">
            <div>
              <span className="text-slate-500 block mb-1">Farmer</span>
              <span className="font-semibold text-white">{booking.profiles.full_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Produce</span>
              <span className="font-semibold text-white">{booking.commodities.name}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="weighedQty" className="text-slate-300 flex items-center gap-2 font-semibold">
              <Scale className="w-5 h-5 text-amber-500" />
              Actual Weighed Quantity (Quintals)
            </Label>
            <Input
              id="weighedQty"
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-slate-950/50 border-slate-700 h-12 text-lg font-mono focus-visible:ring-amber-500 rounded-xl"
            />
            <p className="text-xs text-slate-400 font-medium">Expected: {booking.expected_quantity} Qtl</p>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between border-t border-slate-800/80 pt-4 mt-2">
          <Button 
            variant="ghost" 
            className="w-full sm:w-auto text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg"
            disabled={isSubmitting}
            onClick={() => handleProcess(false)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject (QC Fail)
          </Button>
          <Button 
            variant="default" 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg shadow-lg shadow-emerald-900/30 font-bold border-0"
            disabled={isSubmitting}
            onClick={() => handleProcess(true)}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Accept Produce
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
