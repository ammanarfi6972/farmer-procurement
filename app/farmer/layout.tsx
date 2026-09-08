import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { Sprout, LogOut } from "lucide-react";
import Link from "next/link";
import { FarmerTopNav } from "./top-nav";
import { SignOutButton } from "./signout-button";
import { LanguageProvider } from "@/components/providers/language-provider";
import { getAdminClient } from "@/lib/supabase/server";


export const metadata = {
  title: "Farmer Portal | KisanMitra",
  description: "Manage your agricultural produce procurement.",
};

export default async function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = getAdminClient();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("preferred_language")
    .eq("id", user.id)
    .single();

  const userLang = profile?.preferred_language || "en";

  return (
    <LanguageProvider initialLanguage={userLang}>
      <div className="min-h-screen flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-emerald-50/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0 z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/30 border border-green-500/20">
                <Sprout className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-extrabold text-slate-800 text-lg md:text-xl leading-tight tracking-tight">KisanMitra</h1>
                <p className="text-[10px] md:text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Portal</p>
              </div>
            </div>

            {/* Center Aligned Navigation */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 justify-center px-4">
              <FarmerTopNav />
            </div>
            
            {/* Mobile Navigation fallback (visible only on small screens when absolute positioning might overlap) */}
            <div className="md:hidden flex-1 flex justify-center px-2">
              <FarmerTopNav />
            </div>

            {/* User & Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0 z-10">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-600 font-bold text-xs">{user.email ? user.email.charAt(0).toUpperCase() : 'F'}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600 truncate max-w-[120px]">{user.email || 'Farmer'}</span>
              </div>
              
              <form action={logout}>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all font-medium h-9 px-3 md:px-4">
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <SignOutButton />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:px-8">
        {children}
      </main>
    </div>
    </LanguageProvider>
  );
}
