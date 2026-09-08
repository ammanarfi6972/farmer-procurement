"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-bold text-slate-100">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md">
        We encountered an error loading this page. This could be a network issue or a temporary outage.
      </p>
      <Button 
        onClick={() => reset()}
        className="mt-4 bg-slate-800 hover:bg-slate-700 text-white"
      >
        Try again
      </Button>
    </div>
  );
}
