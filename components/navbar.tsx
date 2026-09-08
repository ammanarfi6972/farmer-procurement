"use client";

import { Leaf, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/lib/auth/actions";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">
            KisanMitra
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
