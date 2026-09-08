"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayoutDashboard, CalendarClock, ScanLine } from "lucide-react";

export function ManagerNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { name: "Slot Management", href: "/manager/slots", icon: CalendarClock },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 border-b border-indigo-500/10 pb-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
