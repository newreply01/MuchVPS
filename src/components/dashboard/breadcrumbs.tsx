"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Example path: /dashboard/proj-id/services/svc-id
  const segments = pathname.split("/").filter(Boolean);
  
  return (
    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
      <Link 
        href="/dashboard" 
        className="hover:text-primary transition-colors flex items-center gap-1.5 group"
      >
        <div className="p-1 bg-muted rounded-md group-hover:bg-primary/10 transition-colors">
           <Home className="w-3.5 h-3.5" />
        </div>
        <span>主面板</span>
      </Link>
      
      {segments.length > 1 && segments[1] && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
          <Link 
            href={`/dashboard/${segments[1]}`}
            className={cn(
               "hover:text-primary transition-colors",
               segments.length === 2 && "text-zinc-100"
            )}
          >
            專案: {segments[1]?.toUpperCase() || "..."}
          </Link>
        </>
      )}

      {segments.length > 3 && segments[3] && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
          <span className="text-zinc-100">
             服務: {segments[3]?.toUpperCase() || "..."}
          </span>
        </>
      )}
    </nav>
  );
}
