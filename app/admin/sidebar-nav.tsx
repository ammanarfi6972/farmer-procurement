"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayoutDashboard, Settings, Users, Landmark } from "lucide-react";

export function SidebarNav({ isManager }: { isManager: boolean }) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Master Data",
      href: "/admin/master-data",
      icon: Settings,
      show: !isManager,
    },
    {
      name: "Managers",
      href: "/admin/managers",
      icon: Users,
      show: !isManager,
    }
  ];

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navItems.filter(item => item.show).map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 font-medium group ${
              isActive 
                ? "bg-gradient-to-r from-indigo-500/20 to-transparent border-l-2 border-indigo-500 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" 
                : "border-l-2 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'group-hover:text-slate-300'}`} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
