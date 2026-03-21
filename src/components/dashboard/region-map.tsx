"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Globe, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Region {
  id: string;
  name: string;
  country: string;
  icon: string;
  latency: number;
  status?: string;
  load?: string;
}

export function RegionMap() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/regions")
      .then(res => res.json())
      .then(data => {
        // Enrich data for display
        const enriched = data.map((r: any) => ({
          ...r,
          status: r.id === "hkg" ? "active" : "standby",
          load: r.id === "hkg" ? "12%" : "0%",
        }));
        setRegions(enriched);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden relative min-h-[400px] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 italic font-serif">Global Distribution</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Edge Network v3.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-bold uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Multi-Region Active
        </div>
      </div>

      {/* Map Content (Simplified SVG Map) */}
      <div className="flex-1 relative bg-[#09090b] overflow-hidden p-8 flex items-center justify-center">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px] pointer-events-none" />
        
        {/* World Map Mockup */}
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 grayscale filter brightness-50">
          <path fill="currentColor" d="M150,150 Q200,100 250,150 T350,150 M450,150 Q500,100 550,150 T650,150 M100,250 Q150,200 200,250 T300,250 M400,250 Q450,200 500,250 T600,250" stroke="white" strokeWidth="0.5" fillOpacity="0"/>
          <rect x="120" y="80" width="100" height="80" rx="40" fill="gray" opacity="0.5" />
          <rect x="450" y="60" width="150" height="100" rx="50" fill="gray" opacity="0.5" />
          <rect x="180" y="200" width="120" height="90" rx="45" fill="gray" opacity="0.5" />
        </svg>

        {/* Region Pins (Driven by API) */}
        {!loading && (
          <div className="absolute inset-0">
             {regions.map((region, i) => {
               // Dynamic positioning based on ID for demo
               let pos = { left: "50%", top: "50%" };
               if (region.id === "hkg") pos = { left: "75%", top: "35%" };
               else if (region.id === "nrt") pos = { left: "80%", top: "30%" };
               else if (region.id === "sfo") pos = { left: "20%", top: "40%" };
               else if (region.id === "fra") pos = { left: "50%", top: "32%" };
               else if (region.id === "sin") pos = { left: "70%", top: "55%" };

               return (
                 <motion.div 
                   key={region.id}
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }} 
                   transition={{ delay: i * 0.1 }}
                   style={pos}
                   className="absolute"
                 >
                    <div className="relative group cursor-pointer">
                       {region.status === "active" && (
                         <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping scale-150" />
                       )}
                       <div className={cn(
                         "relative p-2 rounded-full shadow-2xl transition-all",
                         region.status === "active" ? "bg-primary text-white shadow-primary/50" : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                       )}>
                          <MapPin className="w-3 h-3" />
                       </div>
                       
                       {/* Tooltip */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
                             <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-xs">{region.name} ({region.id.toUpperCase()})</span>
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-tighter",
                                  region.status === "active" ? "text-green-400" : "text-zinc-500"
                                )}>{region.status}</span>
                             </div>
                             <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px]">
                                   <span className="text-zinc-500 uppercase font-bold tracking-widest">Latency</span>
                                   <span className="text-primary font-bold">{region.latency}ms</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                   <span className="text-zinc-500 uppercase font-bold tracking-widest">Load</span>
                                   <span className="font-bold">{region.load}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               );
             })}
          </div>
        )}
      </div>

      {/* Regions List Footer */}
      <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-5 gap-4">
         {regions.map((region) => (
           <div key={region.id} className="flex flex-col gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{region.name}</span>
                 <div className={cn(
                   "w-1.5 h-1.5 rounded-full",
                   region.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-zinc-700"
                 )} />
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-zinc-100 font-bold font-mono text-xs">{region.latency}ms</span>
                 <span className="text-zinc-600 text-[10px] font-bold">L: {region.load}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
