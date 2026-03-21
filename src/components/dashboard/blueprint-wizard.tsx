"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Layers, Database, Globe, Check, ArrowRight, Zap, DollarSign, Info, Sparkles, Server, Network, ShieldCheck, X, ChevronRight, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProject, createService } from "@/app/actions/project";

const STEPS = ["選擇藍圖", "資源規格", "網絡配置", "啟動部署"];

const SERVICES_TO_CONFIG = [
  { id: "erp-backend", name: "Backend Cluster", icon: Cpu, desc: "NestJS Rest API + WebSocket" },
  { id: "erp-frontend", name: "Frontend Edge", icon: Globe, desc: "Vite React + SSR Optimized" },
  { id: "postgres", name: "Database Prime", icon: Database, desc: "PostgreSQL 15 Managed" },
];

const RESOURCE_TIERS = [
  { id: "starter", name: "Starter Tier", specs: "0.5 vCPU, 1GB RAM", price: 5, color: "text-zinc-400" },
  { id: "pro", name: "Pro Tier", specs: "2 vCPU, 4GB RAM", price: 15, color: "text-primary", premium: true },
  { id: "enterprise", name: "Scale Tier", specs: "8 vCPU, 16GB RAM", price: 50, color: "text-purple-400" },
];

export function BlueprintWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({
    "erp-backend": "pro",
    "erp-frontend": "starter",
    "postgres": "pro",
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const totalMonthlyCost = useMemo(() => {
    return Object.values(selections).reduce((acc, tierId) => {
      const tier = RESOURCE_TIERS.find(t => t.id === tierId);
      return acc + (tier?.price || 0);
    }, 0);
  }, [selections]);

  // Dispatch event for AI Chat when wizard opens
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent("blueprint-session-start", { 
        detail: { blueprint: "much-erp" } 
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-2xl" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative bg-[#09090b]/80 border border-white/10 rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Sidebar - Progress & Stats */}
          <div className="w-full lg:w-72 bg-white/5 p-10 border-r border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-16">
                 <div className="p-3 bg-primary rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                   <Zap className="w-6 h-6 text-white fill-current" />
                 </div>
                 <div>
                   <span className="font-bold text-xl italic font-serif text-white tracking-tighter">MuchBlueprint</span>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">V2.0 Engine</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-500",
                      step === i 
                        ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-110" 
                        : step > i 
                          ? "bg-green-500/20 text-green-400 border border-green-500/20" 
                          : "bg-white/5 text-zinc-600"
                    )}>
                      {step > i ? <Check className="w-5 h-5" /> : i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest transition-colors",
                        step === i ? "text-zinc-100" : "text-zinc-600"
                      )}>{s}</span>
                      {step === i && (
                        <motion.span layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_10px_primary]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3 text-zinc-500">
                <DollarSign className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Est. Monthly Cost</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-mono text-white tracking-tighter">${totalMonthlyCost}</span>
                <span className="text-sm text-zinc-500 font-medium">/ 20 nodes</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-12 flex flex-col justify-between bg-grid-white/[0.02]">
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider"
                       >
                         <Sparkles className="w-3 h-3" />
                         Certified Cloud-Native Blueprint
                       </motion.div>
                       <h2 className="text-5xl font-bold text-white italic font-serif tracking-tight">部署 MuchERP 集群</h2>
                       <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
                          此藍圖模組將自動部署 MuchERP 的核心微服務組件。
                          我們預先配置了私有網絡 (VPC)、自動資源擴縮以及智能負載均衡。
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] flex flex-col gap-6 group hover:border-primary/30 transition-all">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Layers className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-xl text-white">全棧 Monorepo 結構</h4>
                           <p className="text-sm text-zinc-500 mt-2">包含 Backend API, Web Desktop & Mobile Admin。</p>
                        </div>
                      </div>
                      <div className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] flex flex-col gap-6 group hover:border-green-500/30 transition-all">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                           <Database className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-xl text-white">高可用數據集群</h4>
                           <p className="text-sm text-zinc-500 mt-2">PostgreSQL 15 主從備份與 Redis 緩存加速。</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold text-white">資源規格配置</h2>
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                        <Zap className="w-3 h-3 fill-current" />
                        AI 最佳化建議已套用
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {SERVICES_TO_CONFIG.map(s => (
                        <div key={s.id} className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-primary group-hover:scale-110 transition-all">
                              <s.icon className="w-7 h-7" />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-zinc-100 text-lg">{s.name}</span>
                               <span className="text-xs text-zinc-500">{s.desc}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                             <select 
                               value={selections[s.id]}
                               onChange={(e) => setSelections({...selections, [s.id]: e.target.value})}
                               className="bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-zinc-200 font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[200px] cursor-pointer"
                             >
                               {RESOURCE_TIERS.map(tier => (
                                 <option key={tier.id} value={tier.id} className="py-2">
                                   {tier.name} - ${tier.price}/mo
                                 </option>
                               ))}
                             </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <h2 className="text-3xl font-bold text-white">網絡與安全性</h2>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] space-y-6">
                          <div className="flex items-center gap-3 text-primary">
                             <Network className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-widest">內部網絡模式</span>
                          </div>
                          <div className="space-y-4">
                             {[
                               { label: "VPC CIDR", value: "10.0.0.0/16" },
                               { label: "數據庫主機", value: "psql-erp-main:5432" },
                               { label: "緩存節點", value: "redis-cluster:6379" }
                             ].map(item => (
                               <div key={item.label} className="flex flex-col gap-1">
                                  <label className="text-[10px] text-zinc-600 font-bold uppercase">{item.label}</label>
                                  <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-mono text-zinc-400">
                                     {item.value}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] space-y-6">
                          <div className="flex items-center gap-3 text-green-500">
                             <ShieldCheck className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-widest">安全性與隔離</span>
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed">
                             我們已自動為您的 Back-office 端口與 Database 建立雙重身份驗證層。預設禁止所有公網流量，僅允許 Edge 節點內部通訊。
                          </p>
                          <div className="space-y-2">
                             <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-green-500 text-xs font-bold">
                                <Check className="w-4 h-4" /> SSL/TLS 自動終止已開啟
                             </div>
                             <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-green-500 text-xs font-bold">
                                <Check className="w-4 h-4" /> 密鑰靜態加密支援
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="relative mb-10">
                       <motion.div 
                         initial={{ rotate: 0 }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur-[60px] opacity-20 -z-10"
                       />
                       <div className="w-28 h-28 bg-primary/10 border border-primary/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                          <Check className="w-14 h-14 text-primary" />
                       </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-4 text-white italic font-serif">配置驗證完成</h2>
                    <p className="text-green-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-4">MuchVPS Certified Blueprint</p>
                    <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                       您的全棧集群架構已通過驗證。
                       準備好在全球高性能網絡上啟動 MuchERP 了嗎？
                    </p>
                  </motion.div>
                )}

                {isDeploying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#09090b]/95 backdrop-blur-xl"
                  >
                    <div className="relative mb-8">
                       <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                       <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight italic font-serif">正在協調 MuchERP 全球集群...</h3>
                    <p className="text-zinc-500 mt-3 font-mono text-xs">協同 12 個區域節點進行資源分配中</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
              <button 
                onClick={onClose}
                className="text-zinc-600 hover:text-zinc-400 font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel Session
              </button>
              
              <div className="flex gap-4">
                {step > 0 && !isDeploying && (
                  <button 
                    onClick={() => setStep(s => s - 1)}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5"
                  >
                    上一步
                  </button>
                )}
                <button 
                  onClick={async () => {
                    if (step >= 3) {
                      setIsDeploying(true);
                      try {
                        const project = await createProject("MuchERP Cluster");
                        
                        // Create individual services
                        for (const s of SERVICES_TO_CONFIG) {
                          const tierId = selections[s.id];
                          const tier = RESOURCE_TIERS.find(t => t.id === tierId);
                          
                          await createService(project.id, {
                            name: s.name,
                            type: "Service",
                            regionId: "hkg-1",
                            specCpu: tier?.name.includes("Pro") ? 2 : tier?.name.includes("Scale") ? 8 : 0.5,
                            specRam: tier?.name.includes("Pro") ? 4 : tier?.name.includes("Scale") ? 16 : 1.0
                          });
                        }

                        window.location.href = `/dashboard/${project.id}`;
                      } catch (error) {
                        console.error(error);
                        alert("部署失敗，請檢查權限。");
                        setIsDeploying(false);
                      }
                    } else {
                      setStep(s => s + 1);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-10 py-4 font-bold rounded-2xl transition-all shadow-2xl active:scale-95 group",
                    step >= 3 ? "bg-primary text-white shadow-primary/30" : "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                  )}
                >
                  {step >= 3 ? "立即全球部署" : "繼續下一步"} 
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[100px] opacity-30" />
      </div>
    </div>
  );
}
