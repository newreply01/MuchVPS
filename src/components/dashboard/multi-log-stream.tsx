"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Activity, Save } from "lucide-react";

const SERVICES = [
  { id: "backend", name: "ERP Backend", color: "text-blue-400" },
  { id: "frontend", name: "ERP Frontend", color: "text-purple-400" },
  { id: "database", name: "PostgreSQL", color: "text-green-400" },
];

export function MultiLogStream() {
  const [logs, setLogs] = useState<{ id: number; service: string; message: string; timestamp: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
      const messages = [
        "Incoming GET /api/v1/projects",
        "Connection established to database",
        "Prisma client initialized",
        "Vite dev server running at :80",
        "User authenticated: muchadmin",
        "Query executed: SELECT * FROM \"User\"",
        "Hot reload: App.tsx updated",
        "CPU load spike: 12%",
        "Buffer flushed to disk",
      ];
      
      const newLog = {
        id: Date.now(),
        service: service.name,
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date().toLocaleTimeString(),
      };

      setLogs(prev => [...prev.slice(-49), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-bold text-zinc-300">系統聚合日誌</span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase">LIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Connected
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto font-mono text-[13px] leading-relaxed"
      >
        {logs.length === 0 && (
          <div className="text-zinc-700 flex flex-col items-center justify-center h-full gap-2">
            <Activity className="w-8 h-8 opacity-20" />
            <span>正在建立日誌串流...</span>
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 mb-2 group">
            <span className="text-zinc-600 shrink-0 w-20">{log.timestamp}</span>
            <span className={cn(
              "shrink-0 w-24 font-bold uppercase text-[10px]",
              SERVICES.find(s => s.name === log.service)?.color || "text-zinc-400"
            )}>
              [{log.service}]
            </span>
            <span className="text-zinc-300 group-hover:text-white transition-colors">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
