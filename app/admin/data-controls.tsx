"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Database, Loader2 } from "lucide-react";
import { deleteAllData, populateDemoData } from "@/lib/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DataControls() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  const handleDelete = async () => {
    if (!confirm("WARNING: This will permanently delete ALL data, including bookings, profiles, and centres. Are you absolutely sure?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteAllData();
      if (res.error) throw new Error(res.error);
      toast.success("All data has been deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete data");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePopulate = async () => {
    setIsPopulating(true);
    try {
      const res = await populateDemoData();
      if (res.error) throw new Error(res.error);
      toast.success("Demo data has been successfully populated!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to populate data");
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 mt-auto border-t border-indigo-500/20">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 px-1">System Data</div>
      <Button 
        variant="destructive" 
        onClick={handleDelete} 
        disabled={isDeleting || isPopulating}
        className="w-full justify-start gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        {isDeleting ? "Deleting..." : "Delete Data"}
      </Button>
      
      <Button 
        onClick={handlePopulate} 
        disabled={isDeleting || isPopulating}
        className="w-full justify-start gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all"
      >
        {isPopulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
        {isPopulating ? "Populating..." : "Populate Data"}
      </Button>
    </div>
  );
}
