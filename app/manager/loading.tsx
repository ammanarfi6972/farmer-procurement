import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
      <p className="text-slate-500 animate-pulse">Loading operational data...</p>
    </div>
  );
}
