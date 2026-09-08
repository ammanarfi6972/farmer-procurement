"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginOfficial, requestFarmerOTP, verifyFarmerOTP } from "@/lib/auth/actions";
import { Loader2, ShieldCheck, Tractor } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"farmer" | "official">("farmer");
  
  // Official State
  const [isOfficialPending, startOfficialTransition] = useTransition();
  const [officialError, setOfficialError] = useState<string | null>(null);

  // Farmer State
  const [isFarmerPending, startFarmerTransition] = useTransition();
  const [farmerError, setFarmerError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");

  function handleOfficialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOfficialError(null);

    const formData = new FormData(e.currentTarget);
    
    startOfficialTransition(async () => {
      const res = await loginOfficial(formData);
      if (res?.error) {
        setOfficialError(res.error);
      } else if (res?.success) {
        router.push(res.redirectTo || "/manager");
      }
    });
  }

  function handleFarmerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFarmerError(null);
    const formData = new FormData(e.currentTarget);

    startFarmerTransition(async () => {
      if (!otpSent) {
        const res = await requestFarmerOTP(formData);
        if (res?.error) {
          setFarmerError(res.error);
        } else {
          setOtpSent(true);
        }
      } else {
        const res = await verifyFarmerOTP(formData);
        if (res?.error) {
          setFarmerError(res.error);
        } else if (res?.success) {
          router.push("/farmer");
        }
      }
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
    >
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => { setActiveTab("farmer"); setFarmerError(null); }}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "farmer" ? "bg-green-50 text-green-700 border-b-2 border-green-600" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Tractor className="w-4 h-4" /> Farmer Login
        </button>
        <button
          onClick={() => { setActiveTab("official"); setOfficialError(null); }}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "official" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Official Login
        </button>
      </div>

      <div className="p-8">
        {activeTab === "farmer" ? (
          <form key="farmer-form" onSubmit={handleFarmerSubmit} className="space-y-5">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Farmer</h2>
              <p className="text-slate-500 mt-1">Sign in with your registered mobile number.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-slate-700">Mobile Number</Label>
              <Input 
                id="mobile" 
                name="mobile" 
                type="tel" 
                placeholder="10-digit number" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                readOnly={otpSent}
                className="h-11"
                required 
              />
            </div>

            {otpSent && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="otp" className="text-slate-700">Enter OTP</Label>
                <Input 
                  id="otp" 
                  name="otp" 
                  type="text" 
                  placeholder="123456" 
                  className="h-11"
                  required 
                />
                <p className="text-xs text-slate-500">For this demo, use 123456 as the OTP.</p>
              </div>
            )}

            {farmerError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {farmerError}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700" disabled={isFarmerPending}>
              {isFarmerPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (otpSent ? "Verify & Login" : "Send OTP")}
            </Button>
          </form>
        ) : (
          <form key="official-form" onSubmit={handleOfficialSubmit} className="space-y-5">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Official Portal</h2>
              <p className="text-slate-500 mt-1">For District Admins and Centre Managers.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Official Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="staff@FasalTrack.in" 
                className="h-11"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                className="h-11"
                required 
              />
            </div>

            {officialError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {officialError}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-indigo-900 hover:bg-indigo-800" disabled={isOfficialPending}>
              {isOfficialPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign in to Console"}
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
