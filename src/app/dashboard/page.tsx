"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Globe, Clock, Activity, HardDrive, Search, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProjectWizard } from "@/components/dashboard/create-project-wizard";
import { AnimatePresence } from "framer-motion";

const PROJECTS = [
  { 
    id: "1", 
    name: "My Awesome App", 
    env: "Production", 
    status: "Active",
    services: 3, 
    region: "HKG-1",
    lastDeploy: "2 小時前"
  },
  { 
    id: "2", 
    name: "E-Commerce Backend", 
    env: "Staging", 
    status: "Active",
    services: 5, 
    region: "SNG-1",
    lastDeploy: "12 小時前"
  },
  { 
    id: "3", 
    name: "Test Project", 
    env: "Development", 
    status: "Paused",
    services: 1, 
    region: "USA-1",
    lastDeploy: "3 天前"
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const filteredProjects = PROJECTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.env.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {isWizardOpen && (
          <CreateProjectWizard 
            isOpen={isWizardOpen} 
            onClose={() => setIsWizardOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">項目管理</h1>
          <p className="text-muted-foreground mt-1">管理您的所有專案與服務環境。</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜尋項目..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/50 border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
           </div>
           <button 
             onClick={() => setIsWizardOpen(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
           >
             <Plus className="w-5 h-5" />
             新建項目
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, i) => (
          <Link
            key={project.id}
            href={`/dashboard/${project.id}`}
            className="block h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group h-full p-6 rounded-2xl border bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                     {project.name[0]}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                     <div className="flex items-center gap-2 mt-1">
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                         project.env === "Production" ? "bg-green-500/10 text-green-500" : 
                         project.env === "Staging" ? "bg-yellow-500/10 text-yellow-500" : 
                         "bg-blue-500/10 text-blue-500"
                       )}>
                         {project.env}
                       </span>
                       <span className="text-xs text-muted-foreground flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {project.lastDeploy}
                       </span>
                     </div>
                   </div>
                </div>
                <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t pb-4">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span>{project.services} 個服務</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>{project.region}</span>
                 </div>
              </div>

              <div className="mt-auto h-1 w-full bg-muted rounded-full overflow-hidden">
                 <div 
                   className={cn(
                     "h-full rounded-full transition-all duration-1000",
                     project.status === "Active" ? "w-full bg-green-500" : "w-1/3 bg-gray-400"
                   )} 
                 />
              </div>
            </motion.div>
          </Link>
        ))}

        {/* Create new project button card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsWizardOpen(true)}
          className="p-6 rounded-2xl border border-dashed hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[220px]"
        >
           <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <Plus className="w-6 h-6" />
           </div>
           <h3 className="font-bold">新建頂目</h3>
           <p className="text-sm text-muted-foreground mt-1 leading-relaxed">從 GitHub 導入或從市場<br/>快速部署服務</p>
        </motion.div>
      </div>
    </div>
  );
}
