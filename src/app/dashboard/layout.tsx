"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import { Bell, Search, Plus, User } from "lucide-react";
import { DeploymentChat } from "@/components/ai/deployment-chat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "pl-20" : "pl-64"} relative`}>
        {/* Dashboard Topbar */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="搜尋專案或服務..." 
                  className="w-full bg-muted/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
              <Bell className="w-5 h-5" />
            </button>
            <ThemeToggler />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
        <DeploymentChat />
      </div>
    </div>
  );
}
