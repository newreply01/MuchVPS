"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Globe, Server, Check, ArrowRight, Zap, Loader2, Search, Cpu, HardDrive, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProject, createService } from "@/app/actions/project";

const STEPS = ["選擇來源", "框架偵測", "建立項目", "部署構建"];

export function CreateProjectWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>("much-erp");
  const [logs, setLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  // Mock Repos
  const repos = [
    { name: "much-erp", description: "Industrial Grade ERP Boilerplate", stars: 128 },
    { name: "nextjs-portfolio", description: "Personal portfolio with Tailwind", stars: 45 },
    { name: "nestjs-api-starter", description: "Production ready API", stars: 89 },
  ].filter(r => r.name.includes(repoSearch));

  const runBuildProcess = async () => {
    setIsBuilding(true);
    setLogs(["[SYSTEM] Initializing build environment...", "[GIT] Verifying repository access..."]);
    
    try {
      // 1. Create Project
      setLogs(prev => [...prev, "[DB] Creating project record..."]);
      const project = await createProject(selectedRepo || "New Project");
      setCreatedProjectId(project.id);
      setLogs(prev => [...prev, `[DB] Project created: ${project.id}`]);

      // 2. Create Service (Mocking properties for now)
      setLogs(prev => [...prev, "[DB] Configuring service resources..."]);
      const service = await createService(project.id, {
        name: `${selectedRepo}-api`,
        type: "Next.js",
        regionId: "hkg-1", // Assume this exists from seed
        specCpu: 0.5,
        specRam: 1.0
      });
      setLogs(prev => [...prev, `[DB] Service created: ${service.id}`]);

      // 3. Fake Build Logs
      const buildSteps = [
        { step: "BUILD", detail: "Installing dependencies..." },
        { step: "BUILD", detail: "Compiling source code..." },
        { step: "BUILD", detail: "Optimizing assets..." },
        { step: "DEPLOY", detail: "Pushing to edge nodes..." }
      ];

      for (const entry of buildSteps) {
        setLogs(prev => [...prev, `[${entry.step}] ${entry.detail}`]);
        await new Promise(r => setTimeout(r, 600));
      }

      setLogs(prev => [...prev, "✨ Deployment Complete! Service is now LIVE."]);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "❌ Build Failed: Could not connect to builder node."]);
    }
    setIsBuilding(false);
  };

  useEffect(() => {
    if (step === 3 && selectedRepo) {
      runBuildProcess();
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex h-[650px]"
      >
        {/* Sidebar */}
        <div className="w-64 bg-zinc-950 p-8 border-r border-zinc-800 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-12">
               <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                 <Zap className="w-5 h-5 text-white fill-current" />
               </div>
               <span className="font-bold text-xl tracking-tight text-white italic font-serif">MuchVPS</span>
            </div>
            <div className="space-y-6">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-4 group">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                    step === i ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : step > i ? "bg-green-500/20 text-green-400" : "bg-zinc-800 text-zinc-600"
                  )}>
                    {step > i ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    step === i ? "text-zinc-100" : "text-zinc-600"
                  )}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Builder Status</span>
             </div>
             <p className="text-[10px] text-zinc-400 font-medium">Nodes: HKG-1, NRT-2 Active</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col justify-between overflow-y-auto">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold mb-2 text-white italic font-serif">導入 GitHub 項目</h2>
                  <p className="text-zinc-500 mb-8">選擇您想要部署到 MuchVPS 的儲存庫。</p>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="text" 
                      placeholder="搜尋您的 GitHub 項目..."
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                    />
                  </div>

                  <div className="space-y-3">
                    {repos.map(repo => (
                      <button
                        key={repo.name}
                        onClick={() => setSelectedRepo(repo.name)}
                        className={cn(
                          "w-full p-5 rounded-2xl border flex items-center justify-between transition-all group",
                          selectedRepo === repo.name ? "bg-primary/10 border-primary shadow-xl" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                         <div className="flex items-center gap-4 text-left">
                            <Github className={cn("w-6 h-6", selectedRepo === repo.name ? "text-primary" : "text-zinc-600")} />
                            <div>
                               <h4 className="font-bold text-zinc-100">{repo.name}</h4>
                               <p className="text-xs text-zinc-500">{repo.description}</p>
                            </div>
                         </div>
                         {selectedRepo === repo.name && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold mb-8 text-white">智慧框架偵測</h2>
                  <div className="p-10 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
                     <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary relative">
                        <motion.div 
                          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-3xl" 
                        />
                        <Search className="w-10 h-10" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-white mb-2 italic">這看起來是一個 NestJS 項目</h4>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                           MuchAI 偵測到 `package.json` 中的 NestJS 依賴。我們已為您預配置了生產環境的構建與運行指令。
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-4 w-full pt-4">
                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-left">
                           <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Build Command</span>
                           <p className="text-xs font-mono text-zinc-300 mt-1">npm run build</p>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-left">
                           <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Start Command</span>
                           <p className="text-xs font-mono text-zinc-300 mt-1">npm run start:prod</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold mb-2 text-white">項目基本配置</h2>
                  <p className="text-zinc-500 mb-8">為您的新服務命名並選擇運行節點。</p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-1">Service Name</label>
                      <input 
                        defaultValue={selectedRepo || ""}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-zinc-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-zinc-950 border border-primary/30 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Globe className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold text-white">Hong Kong (HKG-1)</span>
                          </div>
                          <Check className="w-4 h-4 text-primary" />
                       </div>
                       <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between opacity-50 grayscale">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                                <Globe className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold text-zinc-500">Tokyo (NRT-1)</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-3xl font-bold text-white italic font-serif">構建與部署日誌</h2>
                     {isBuilding && (
                       <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Streaming...
                       </div>
                     )}
                  </div>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 h-[350px] overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar shadow-inner">
                    {logs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className={cn(
                          log.startsWith("❌") ? "text-red-400" : 
                          log.startsWith("✨") ? "text-green-400 font-bold" : 
                          log.startsWith("[") ? "text-primary font-bold" : "text-zinc-400"
                        )}
                      >
                        {log}
                      </motion.div>
                    ))}
                    {!isBuilding && logs.length > 5 && (
                      <div className="mt-8 flex justify-center">
                         <button 
                           onClick={() => window.location.href = `/dashboard/${createdProjectId}`}
                           className="px-8 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/20"
                         >
                           進入服務儀表板
                         </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-zinc-800 shrink-0">
            <button 
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-400 font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              Cancel Setup
            </button>
            <div className="flex gap-4">
              {step > 0 && step < 3 && (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                >
                  上一步
                </button>
              )}
              {step < 3 && (
                <button 
                  disabled={step === 0 && !selectedRepo}
                  onClick={() => setStep(s => s + 1)}
                  className="px-10 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {step === 2 ? "啟動自動部署" : "下一步"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
