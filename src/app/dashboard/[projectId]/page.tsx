"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Globe, Clock, Activity, HardDrive, Terminal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SERVICES = [
  { 
    id: "redis", 
    name: "Redis Cache", 
    type: "Database", 
    status: "Running",
    cpu: "0.2%", 
    memory: "128MB",
    domain: "redis.zeabur.app"
  },
  { 
    id: "api", 
    name: "Express API", 
    type: "Web Service", 
    status: "Running",
    cpu: "1.5%", 
    memory: "256MB",
    domain: "api.zeabur.app"
  },
  { 
    id: "postgres", 
    name: "Primary DB", 
    type: "Database", 
    status: "Running",
    cpu: "0.8%", 
    memory: "512MB",
    domain: "db.zeabur.app"
  },
];

export default function ProjectPage() {
  const { projectId } = useParams();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold uppercase">
             {projectId?.toString()[0]}
           </div>
           <div>
             <h1 className="text-3xl font-bold">專案: {projectId}</h1>
             <p className="text-muted-foreground mt-1">
               此項目中共有 {SERVICES.length} 個正在運行的服務。
             </p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-xl hover:bg-muted transition-colors font-medium">配置域名</button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" /> 新增服務
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SERVICES.map((service, i) => (
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
