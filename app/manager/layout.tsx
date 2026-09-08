import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { Building2, LogOut } from "lucide-react";

import { ManagerNav } from "./manager-nav";

export const metadata = {
  title: "Manager Console | FasalTrack",
  description: "Manage procurement queues and operations.",
};

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // We should verify role is staff in a real app. For MVP, we assume any email login to /staff is official.
  
  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/30 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      {/* Dark themed Manager Header */}
      <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-indigo-500/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl border border-indigo-500/30">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-500">FasalTrack Manager Console</h1>
            <p className="text-xs font-medium text-slate-400">Procurement & Queue Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-indigo-300 bg-indigo-900/20 px-3 py-1 rounded-full border border-indigo-500/20 hidden sm:block">
            {user.email}
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <main className="p-6 relative z-10 max-w-7xl mx-auto">
        <ManagerNav />
        {children}
      </main>
    </div>
  );
}
