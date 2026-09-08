import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { Settings, LogOut, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Demo Control | FasalTrack",
};

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dark min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden flex flex-col">
      {/* Warning Mesh Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-900/30 blur-[120px]" />
      </div>

      {/* Warning Header */}
      <header className="sticky top-0 z-50 glass border-b border-red-900/50 bg-red-950/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-red-100">SIH Demo Control Panel</h1>
            <p className="text-xs text-red-400">Super Admin Override Environment</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <form action={logout}>
            <Button variant="ghost" size="sm" className="text-red-300 hover:text-white hover:bg-red-900/50 rounded-full transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Demo Mode
            </Button>
          </form>
        </div>
      </header>

      <main className="p-6 relative z-10 flex-1 w-full max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
