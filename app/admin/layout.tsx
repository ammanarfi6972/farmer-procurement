import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { ShieldCheck, LogOut, BarChart3, Users, Settings, Globe } from "lucide-react";
import Link from "next/link";

import { SidebarNav } from "./sidebar-nav";
import { DataControls } from "./data-controls";



export const metadata = {
  title: "District Admin | FasalTrack",
  description: "High-level overview of district procurement operations.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check role using admin client
  const { getAdminClient } = await import("@/lib/supabase/server");
  const supabaseAdmin = getAdminClient();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isManager = profile?.role === 'centre_manager';

  return (
    <div className="dark h-screen w-full bg-slate-950 bg-mesh text-slate-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated ambient glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse duration-10000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse duration-10000 delay-1000" />
        <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 h-full glass border-r border-slate-800/50 bg-slate-900/50 flex flex-col hidden md:flex shrink-0 relative z-10 shadow-xl">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 shrink-0">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">{isManager ? "Manager Portal" : "Admin Portal"}</h1>
            <p className="text-xs font-medium text-indigo-300">{isManager ? "Centre View" : "District HQ"}</p>
          </div>
        </div>
        
        <SidebarNav isManager={isManager} />
        
        {!isManager && <DataControls />}
        
        <div className="p-4 pb-12 border-t border-slate-800 shrink-0">
          <div className="mb-4 truncate text-sm text-slate-400 px-2">{user.email}</div>
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden glass border-b border-slate-800/50 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span className="font-bold">Admin</span>
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm" className="hover:bg-slate-800 rounded-full">Sign Out</Button>
          </form>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
