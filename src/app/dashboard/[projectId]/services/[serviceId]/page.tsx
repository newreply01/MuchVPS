"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Settings, Shield, ChevronLeft, Layout, Cpu, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogsView } from "@/components/dashboard/logs-view";
import { EnvEditor } from "@/components/dashboard/env-editor";
import { NetworkConfig } from "@/components/dashboard/network-config";
import { DeployStatus, DeploymentProgressBar } from "@/components/dashboard/deploy-status";

const TABS = [
  { id: "logs", name: "日誌", icon: Terminal },
  { id: "networking", name: "網絡", icon: Globe },
  { id: "env", name: "環境變量", icon: Shield },
  { id: "settings", name: "設置", icon: Settings },
];

export default function ServiceDetailPage() {
  const { projectId, serviceId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        返回專案
      </button>

      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
               {serviceId === "redis" ? <HardDrive className="w-8 h-8" /> : <Globe className="w-8 h-8" />}
            </div>
            <div>
               <h1 className="text-3xl font-bold uppercase">{serviceId}</h1>
               <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium text-muted-foreground">ID: {serviceId}-svc-9901</span>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <DeployStatus status="success" />
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 font-bold transition-all flex items-center gap-2">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Settings className="w-4 h-4" />
               </motion.div>
               重新部署
            </button>
            <button className="px-4 py-2 border rounded-xl hover:bg-muted font-medium transition-colors">重新啟動</button>
            <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 font-medium transition-colors">停止代放</button>
         </div>
      </div>

      <div className="space-y-2">
         <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>上次部署狀態: 成功</span>
            <span>2 分鐘前</span>
         </div>
         <DeploymentProgressBar />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "CPU 使用率", value: "1.2%", icon: Cpu },
           { label: "內存使用", value: "245 MB", icon: Layout },
           { label: "總請求數", value: "12,401", icon: Activity },
           { label: "響應延遲", value: "24 ms", icon: Terminal }
         ].map((stat, i) => (
           <div key={i} className="p-4 rounded-2xl border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase mb-2">
                 <stat.icon className="w-3 h-3" />
                 {stat.label}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
           </div>
         ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
         {TABS.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={cn(
               "px-8 py-3 font-bold text-sm transition-all border-b-2 relative",
               activeTab === tab.id 
                 ? "border-primary text-primary" 
                 : "border-transparent text-muted-foreground hover:text-foreground"
             )}
           >
             <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.name}
             </div>
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
         <AnimatePresence mode="wait">
           {activeTab === "logs" && (
             <motion.div
               key="logs"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-4"
             >
                <div className="flex items-center justify-between text-sm">
                   <div className="text-muted-foreground font-medium">實時日誌流</div>
                   <button className="text-primary font-bold hover:underline">下載日誌</button>
                </div>
                <LogsView />
             </motion.div>
           )}
           
           {activeTab === "networking" && (
             <motion.div
               key="networking"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
                <NetworkConfig />
             </motion.div>
           )}

           {activeTab === "env" && (
             <motion.div
               key="env"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
                <EnvEditor />
             </motion.div>
           )}
           
           {activeTab === "settings" && (
             <motion.div
               key="settings"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center p-20 text-muted-foreground border border-dashed rounded-3xl"
             >
                <div className="p-4 bg-muted rounded-full mb-4">
                   <Settings className="w-8 h-8" />
                </div>
                <p className="font-bold">設置頁面還在開發中...</p>
                <p className="text-sm mt-1">我們正在為您準備更多高級配置選項。</p>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}

// Dummy Activity Icon for the stats
function Activity({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
