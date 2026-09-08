import { Tractor, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflineFallback() {
  return (
    <div className="min-h-screen bg-slate-50 bg-mesh relative flex flex-col items-center justify-center p-4">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-slate-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">You are offline</h1>
          <p className="text-slate-600">
            Please check your internet connection. 
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-4">
            If you already booked a slot, you can still view your token at the centre.
          </p>
          <Link href="/farmer">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 relative z-10">
        <Tractor className="w-5 h-5" />
        <span className="font-semibold tracking-tight">FasalTrack</span>
      </div>
    </div>
  );
}
