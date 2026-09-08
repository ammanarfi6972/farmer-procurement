"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { triggerPaymentSettlements, resetDemoState } from "@/lib/demo/actions";
import { Zap, RotateCcw, AlertTriangle, CheckCircle2, Loader2, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function DemoClient({ initialData }: { initialData: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  async function handleTriggerPayments() {
    setIsProcessing(true);
    await triggerPaymentSettlements();
    toast("📩 SMS Sent to Farmer", {
      description: `Payment successfully credited to the farmer's bank account.`,
      duration: 8000,
    });
    setIsProcessing(false);
  }

  async function handleReset() {
    if (confirm("WARNING: This will delete ALL bookings, queue entries, procurements, and settlements. Are you sure you want to reset the demo environment?")) {
      setIsResetting(true);
      await resetDemoState();
      setIsResetting(false);
    }
  }

  const { bookingCount, queueCount, settlements } = initialData;
  const pendingSettlements = settlements.filter((s: any) => s.status === 'PENDING').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Actions Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-neutral-800 bg-neutral-900/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                External Systems
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Mock responses from 3rd party APIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTriggerPayments}
                disabled={isProcessing || pendingSettlements === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 relative overflow-hidden group"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Simulate Bank Webhook
                    {pendingSettlements > 0 && (
                      <Badge className="ml-auto bg-white/20 text-white">{pendingSettlements} Pending</Badge>
                    )}
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              </Button>
              <p className="text-xs text-neutral-500 text-center">
                Advances all PENDING settlements to COMPLETED.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-900/50 bg-red-950/20 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleReset}
                disabled={isResetting}
                variant="destructive"
                className="w-full bg-red-900/50 hover:bg-red-700 text-red-100 border border-red-800 h-12"
              >
                {isResetting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Transactional Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* State Viewer Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-neutral-800 bg-neutral-900/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Live Settlement Webhooks</CardTitle>
              <CardDescription className="text-neutral-400">
                Monitor the mocked payout transfers to farmers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settlements.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-neutral-800 rounded-lg text-neutral-500">
                  No settlements generated yet. Process a procurement first.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {settlements.map((s: any) => (
                    <motion.div 
                      key={s.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-neutral-200">
                          {s.procurements?.bookings?.profiles?.full_name || 'Unknown Farmer'}
                        </div>
                        <div className="text-sm text-neutral-500 font-mono mt-1">
                          Amount: ₹{s.amount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        {s.status === 'PENDING' ? (
                          <Badge variant="outline" className="text-amber-400 border-amber-400/20 bg-amber-400/10 gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Pending Webhook
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10 gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Settled
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
