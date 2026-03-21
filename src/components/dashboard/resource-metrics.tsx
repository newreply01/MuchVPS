"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResourceMetrics() {
  const [cpuUsage, setCpuUsage] = useState<number[]>(Array(20).fill(10));
  const [ramUsage, setRamUsage] = useState<number[]>(Array(20).fill(40));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => [...prev.slice(1), Math.floor(Math.random() * 20) + 5]);
      setRamUsage(prev => [...prev.slice(1), Math.floor(Math.random() * 10) + 38]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard 
        title="CPU 負載" 
        icon={<Cpu className="w-4 h-4" />} 
        value={`${cpuUsage[cpuUsage.length - 1]}%`} 
        data={cpuUsage}
        color="text-blue-500"
        barColor="bg-blue-500"
      />
      <MetricCard 
        title="記憶體佔用" 
        icon={<Activity className="w-4 h-4" />} 
        value={`${ramUsage[ramUsage.length - 1]}%`} 
        data={ramUsage}
        color="text-green-500"
        barColor="bg-green-500"
      />
    </div>
  );
}

function MetricCard({ title, icon, value, data, color, barColor }: { 
  title: string; 
  icon: React.ReactNode; 
  value: string; 
  data: number[];
  color: string;
  barColor: string;
}) {
  return (
    <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg bg-zinc-950 border border-zinc-800", color)}>
            {icon}
          </div>
          <span className="text-sm font-medium text-zinc-400">{title}</span>
        </div>
        <span className="text-xl font-bold text-zinc-100 font-mono tracking-tight">{value}</span>
      </div>

      <div className="h-16 flex items-end gap-1 px-1">
        {data.map((val, i) => (
          <motion.div
            key={i}
            initial={{ height: "0%" }}
            animate={{ height: `${val}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn("flex-1 min-w-[2px] rounded-t-sm opacity-40 group-hover:opacity-100 transition-opacity", barColor)}
          />
        ))}
      </div>
    </div>
  );
}
