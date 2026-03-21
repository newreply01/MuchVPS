"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, AlertCircle, CheckCircle2, Info, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  content: string;
  level: string;
  createdAt: string | Date;
}

interface LogsViewProps {
  initialLogs: LogEntry[];
}

export function LogsView({ initialLogs }: LogsViewProps) {
  const [logs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(l => 
    filter === "all" || l.level.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="flex flex-col h-[550px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
         <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">系統實時日誌 (Snapshot)</span>
         </div>
         <div className="flex items-center gap-2">
            {["all", "info", "warn", "error"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all",
                  filter === f ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {f}
              </button>
            ))}
         </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex gap-4 group">
             <span className="text-zinc-600 text-[10px] whitespace-nowrap pt-1 w-24">
               {new Date(log.createdAt).toLocaleTimeString()}
             </span>
             <div className={cn(
               "flex-1 break-all",
               log.level === "ERROR" ? "text-red-400" : 
               log.level === "WARN" ? "text-yellow-400" : 
               "text-zinc-300"
             )}>
               <span className="opacity-50 mr-2">[{log.level}]</span>
               {log.content}
             </div>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
             <Terminal className="w-12 h-12 opacity-20" />
             <p className="text-sm">暫無日誌數據</p>
          </div>
        ) }
      </div>
    </div>
  );
}
