import { LoginForm } from "@/components/auth/login-form";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "FasalTrack | Login",
  description: "Secure login for officials",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* Left Pane - Branding & Hero (Hidden on Mobile) */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-mesh relative overflow-hidden border-r border-slate-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-emerald-800">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-3xl tracking-tight">FasalTrack</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Empowering Farmers. <br/>
            <span className="text-emerald-700">Streamlining Procurement.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            The intelligent queue management system for fair, fast, and transparent agricultural procurement at APMC mandis.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500 font-medium">
          © 2026 SIH FasalTrack Initiative. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="md:hidden flex items-center justify-center gap-2 mb-10 text-emerald-800">
            <Leaf className="w-8 h-8" />
            <span className="font-bold text-3xl">FasalTrack</span>
          </div>
          
          <LoginForm />
        </div>
      </div>
      
    </div>
  );
}
