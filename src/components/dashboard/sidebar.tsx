"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  Settings, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggler } from "../ui/theme-toggler";

const SIDEBAR_ITEMS = [
  { name: "項目", icon: LayoutDashboard, href: "/dashboard" },
  { name: "市場", icon: Package, href: "/marketplace" },
  { name: "計費", icon: CreditCard, href: "#" },
  { name: "設置", icon: Settings, href: "#" },
];

export function DashboardSidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 z-40 bg-card border-r transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">Z</div>
          {!collapsed && <span className="font-bold text-xl">MuchVPS</span>}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group",
                active 
                  ? "bg-primary text-white shadow-lg" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
              {collapsed && !active && (
                <div className="absolute left-20 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          {!collapsed && <span>縮小欄位</span>}
        </button>
      </div>
    </aside>
  );
}
