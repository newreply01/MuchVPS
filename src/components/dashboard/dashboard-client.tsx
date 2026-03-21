"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Zap, Check, Clock, Activity, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CreateProjectWizard } from "@/components/dashboard/create-project-wizard";
import { BlueprintWizard } from "@/components/dashboard/blueprint-wizard";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

interface Project {
  id: string;
  name: string;
  env: string;
  status: string;
  servicesCount: number;
  region: string;
  lastDeploy: string;
}

interface DashboardClientProps {
  initialProjects: Project[];
  recentLogs: any[];
}

export function DashboardClient({ initialProjects, recentLogs }: DashboardClientProps) {
  const [search, setSearch] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Handle blueprint redirect from marketplace
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("blueprint") === "much-erp") {
      setIsBlueprintOpen(true);
    }
  }, []);

  const filteredProjects = initialProjects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.env.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProject = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-24">
      <AnimatePresence>
        {isWizardOpen && (
          <CreateProjectWizard 
            isOpen={isWizardOpen} 
            onClose={() => setIsWizardOpen(false)} 
          />
        )}
        {isBlueprintOpen && (
          <BlueprintWizard 
            isOpen={isBlueprintOpen} 
            onClose={() => setIsBlueprintOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic font-serif tracking-tight">項目管理中心</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium italic">管理分佈在全球 {filteredProjects.length} 個節點的生產環境旗艦服務。</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative w-64 group">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg group-hover:bg-primary/10 transition-all" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 z-10" />
              <input 
                type="text" 
                placeholder="搜尋項目或環境..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative w-full bg-zinc-950/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/10 transition-all shadow-inner outline-none placeholder:text-zinc-700 font-medium"
              />
           </div>
           <button 
             onClick={() => setIsBlueprintOpen(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-blue-400 font-bold rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800 shadow-xl group"
           >
             <Zap className="w-5 h-5 fill-blue-500 text-blue-500 group-hover:scale-110 transition-transform" />
             藍圖部署
           </button>
           <button 
             onClick={() => setIsWizardOpen(true)}
             className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all transform active:scale-95"
           >
             <Plus className="w-5 h-5" />
             新建項目
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, i) => (
              <Link
                key={project.id}
                href={`/dashboard/${project.id}`}
                className="block h-full relative"
              >
                <div 
                  onClick={(e) => toggleProject(project.id, e)}
                  className={cn(
                    "absolute top-4 right-4 z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer",
                    selectedProjects.includes(project.id) ? "bg-primary border-primary shadow-lg shadow-primary/40" : "bg-black/20 border-white/10 hover:border-white/30"
                  )}
                >
                   {selectedProjects.includes(project.id) && <Check className="w-4 h-4 text-white" />}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "group h-full p-8 rounded-[2.5rem] border bg-zinc-950/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col relative overflow-hidden backdrop-blur-sm",
                    selectedProjects.includes(project.id) && "ring-2 ring-primary border-primary"
                  )}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-indigo-500/10 border border-white/5 rounded-2xl flex items-center justify-center text-primary font-bold shadow-2xl">
                         {project.name[0]}
                       </div>
                       <div>
                         <h3 className="font-bold text-xl group-hover:text-primary transition-colors italic font-serif">{project.name}</h3>
                         <div className="flex items-center gap-3 mt-1.5">
                           <span className={cn(
                             "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                             project.env === "Production" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                             project.env === "Staging" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                             "bg-blue-500/10 text-blue-500 border-blue-500/20"
                           )}>
                             {project.env}
                           </span>
                           <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5">
                             <Clock className="w-3 h-3" /> {project.lastDeploy}
                           </span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-white/5 pb-4">
                     <div className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Activity className="w-4 h-4 text-primary" />
                        <span>{project.servicesCount} 個服務實例</span>
                     </div>
                     <div className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Globe className="w-4 h-4 text-zinc-600" />
                        <span>{project.region}</span>
                     </div>
                  </div>

                  <div className="mt-6 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: project.status === "success" ? "100%" : "30%" }}
                       className={cn(
                         "h-full rounded-full transition-all duration-1000",
                         project.status === "success" ? "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-zinc-700"
                       )} 
                     />
                  </div>
                </motion.div>
              </Link>
            ))}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWizardOpen(true)}
              className="p-6 rounded-[2.5rem] border border-dashed border-zinc-800 hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[220px]"
            >
               <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="w-6 h-6" />
               </div>
               <h3 className="font-bold">新建項目</h3>
               <p className="text-sm text-muted-foreground mt-1 leading-relaxed">從 GitHub 導入或從市場<br/>快速部署服務</p>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-1 h-[calc(100vh-250px)] sticky top-8">
           <ActivityFeed logs={recentLogs} />
        </div>
      </div>
    </div>
  );
}
