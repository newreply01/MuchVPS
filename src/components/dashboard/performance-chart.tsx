"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Metric {
  timestamp: string;
  cpu: number;
  ram: number;
  requests: number;
  latency: number;
}

export function PerformanceChart({ data }: { data: Metric[] }) {
  const points = useMemo(() => {
    if (!data.length) return "";
    const width = 800;
    const height = 200;
    const maxCpu = 100;
    
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.cpu / maxCpu) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  const fillPath = useMemo(() => {
    if (!data.length) return "";
    return `M 0,200 L ${points} L 800,200 Z`;
  }, [points, data]);

  const linePath = useMemo(() => {
    if (!data.length) return "";
    return `M ${points}`;
  }, [points, data]);

  return (
    <div className="w-full h-[300px] bg-zinc-950/20 rounded-3xl border border-zinc-900 overflow-hidden p-8 relative group">
      <div className="flex items-center justify-between mb-8 z-10 relative">
        <div>
          <h4 className="font-bold text-zinc-100 flex items-center gap-2">
            CPU 指標趨勢
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </h4>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time Node Telemetry</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Usage %</span>
           </div>
        </div>
      </div>

      <div className="relative h-[180px] w-full">
         {/* Y-Axis Labels */}
         <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] font-bold text-zinc-600 pointer-events-none pr-4 border-r border-zinc-900">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
         </div>

         {/* Chart Area */}
         <div className="absolute inset-0 ml-10">
            <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d overflow-visible">
               <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
               </defs>
               
               {/* Grid Lines */}
               {[0, 25, 50, 75, 100].map(v => (
                 <line 
                   key={v} 
                   x1="0" y1={200 - v * 2} x2="800" y2={200 - v * 2} 
                   stroke="rgba(255,255,255,0.03)" strokeWidth="1" 
                 />
               ))}

               {/* Area */}
               <motion.path 
                 initial={{ d: "M 0,200 L 0,200 L 800,200 Z", opacity: 0 }}
                 animate={{ d: fillPath, opacity: 1 }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 fill="url(#cpuGradient)"
               />

               {/* Line */}
               <motion.path 
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d={linePath}
                 fill="none"
                 stroke="#3b82f6"
                 strokeWidth="3"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
               />

               {/* Data Points on Hover */}
               {data.map((d, i) => {
                 const x = (i / (data.length - 1)) * 800;
                 const y = 200 - (d.cpu / 100) * 200;
                 return (
                   <circle 
                     key={i} 
                     cx={x} cy={y} r="4" 
                     className="fill-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     style={{ transitionDelay: `${i * 20}ms` }}
                   />
                 );
               })}
            </svg>
         </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-900 pt-4 px-2">
         <div className="flex gap-8">
            <div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Avg Latency</p>
               <p className="text-sm font-bold text-zinc-200">12.4ms</p>
            </div>
            <div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Request Peak</p>
               <p className="text-sm font-bold text-zinc-200">2.8k /s</p>
            </div>
         </div>
         <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-mono">Sampling: 10m intervals</span>
      </div>
    </div>
  );
}
