"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

export const navItems = [
  { labelKey: "nav.dashboard", href: "/farmer", icon: Home },
  { labelKey: "nav.history", href: "/farmer/history", icon: History },
  { labelKey: "nav.profile", href: "/farmer/profile", icon: User },
];

export function FarmerTopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-center gap-2 md:gap-4 flex-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative group overflow-hidden ${
              isActive 
                ? "text-emerald-700 bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
            }`}
          >
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 bg-emerald-500 rounded-t-full" />
            )}
            <item.icon className={`w-4 h-4 md:w-5 md:h-5 shrink-0 transition-colors ${isActive ? "text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span className="relative z-10 hidden sm:inline">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
