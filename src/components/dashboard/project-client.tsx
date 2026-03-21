"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Globe, Clock, Activity, HardDrive, Terminal, Settings, Trash2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { TopologyView } from "@/components/dashboard/topology-view";
import { MultiLogStream } from "@/components/dashboard/multi-log-stream";
import { updateProject, deleteProject } from "@/app/actions/project";

interface Service {
  id: string;
  name: string;
  type: string;
  status: string;
  cpu: string;
  memory: string;
  domain: string;
}

interface ProjectClientProps {
  projectId: string;
  projectName: string;
  services: Service[];
  regionName: string;
}

export function ProjectClient({ projectId, projectName, services, regionName }: ProjectClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center text-primary text-2xl font-bold uppercase shadow-lg shadow-primary/10">
             {projectName?.[0] || projectId?.[0]}
           </div>
           <div>
             <h1 className="text-3xl font-bold italic font-serif tracking-tight">專案: {projectName || projectId.toUpperCase()}</h1>
             <p className="text-muted-foreground mt-1 text-sm font-medium">
               包含 {services.length} 個服務 • 運行於 {regionName}
             </p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-zinc-800 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 transition-all font-bold text-xs uppercase tracking-widest">配置域名</button>
          <button className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform active:scale-95">
            <Plus className="w-5 h-5" /> 新增服務
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "總 CPU 佔用", value: "2.5%", icon: Activity, color: "text-blue-500" },
           { label: "總計 RAM", value: "900 MB", icon: HardDrive, color: "text-purple-500" },
           { label: "累計網路流量", value: "125 GB", icon: Globe, color: "text-green-500" },
           { label: "平均回覆廷遲", value: "28ms", icon: Clock, color: "text-orange-500" },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-primary/20 transition-all"
           >
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                 <stat.icon className={cn("w-4 h-4 opacity-50", stat.color)} />
              </div>
              <p className="text-xl font-bold font-mono text-zinc-100">{stat.value}</p>
           </motion.div>
         ))}
      </div>

      <TopologyView />

      <MultiLogStream />

      <div className="grid grid-cols-1 gap-4">
        {services.map((service, i) => (
          <Link 
            key={service.id} 
            href={`/dashboard/${projectId}/services/${service.id}`}
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                 <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary">
                    {service.type === "Database" ? <HardDrive className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                 </div>
                 <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{service.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                       <span>{service.type}</span>
                       <span className="text-primary">{service.domain}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-12">
                 <div className="hidden lg:flex items-center gap-8">
                    <div className="text-center">
                       <div className="text-xs text-muted-foreground mb-0.5">CPU</div>
                       <div className="font-bold">{service.cpu}</div>
                    </div>
                    <div className="text-center">
                       <div className="text-xs text-muted-foreground mb-0.5">Memory</div>
                       <div className="font-bold">{service.memory}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-500">{service.status}</span>
                 </div>
                 <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                    <Terminal className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
