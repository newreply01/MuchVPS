"use client";
 
import { motion } from "framer-motion";
import { Terminal, Activity, Zap, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface ActivityLog {
  id: string;
  content: string;
  level: string;
  createdAt: Date;
  service: {
    name: string;
  };
}
 
interface ActivityFeedProps {
  logs: ActivityLog[];
}
 
export function ActivityFeed({ logs }: ActivityFeedProps) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
         <h3 className="font-bold text-lg italic font-serif flex items-center gap-2">
           <Activity className="w-5 h-5 text-primary" />
           即時活動摘要
         </h3>
         <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Sync</span>
         </div>
      </div>
 
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-50">
             <Terminal className="w-10 h-10 text-zinc-700" />
             <p className="text-sm font-medium">尚無活動記錄</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-1 p-1.5 rounded-lg",
                  log.level === "ERROR" ? "bg-red-500/10 text-red-500" : 
                  log.level === "WARN" ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-blue-500/10 text-blue-500"
                )}>
                  {log.level === "ERROR" ? <AlertCircle className="w-3.5 h-3.5" /> : 
                   log.level === "WARN" ? <AlertCircle className="w-3.5 h-3.5" /> : 
                   <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest truncate">{log.service.name}</span>
                    <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed break-words">{log.content}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
 
      <button className="p-4 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-primary transition-colors border-t border-white/5">
        查看完整審計日誌
      </button>
    </div>
  );
}
