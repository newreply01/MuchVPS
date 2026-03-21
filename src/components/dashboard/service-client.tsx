"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Shield, ChevronLeft, Cpu, HardDrive, Zap, Activity, TrendingUp, AlertCircle, Sparkles, Loader2, Layout, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { TopologyView } from "@/components/dashboard/topology-view";
import { LogsView } from "@/components/dashboard/logs-view";
import { RegionMap } from "@/components/dashboard/region-map";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { EnvEditor } from "@/components/dashboard/env-editor";
import { NetworkConfig } from "@/components/dashboard/network-config";
import { startService, stopService, restartService, rebuildService, deleteService, updateServiceResources, updateServiceMetrics, executeCommand, createSnapshot, getSnapshots, restoreSnapshot } from "@/app/actions/service";

interface ServiceClientProps {
  projectId: string;
  service: any;
  initialMetrics: any[];
  initialLogs: any[];
}

export function ServiceClient({ projectId, service, initialMetrics, initialLogs }: ServiceClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (service.status !== "live") return;
    
    const interval = setInterval(async () => {
      try {
        const newMetric = await updateServiceMetrics(service.id);
        setMetrics(prev => [...prev.slice(-19), newMetric]);
      } catch (e) {
        console.error("Metric update failed", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [service.id, service.status]);
  
  const [cpu, setCpu] = useState(service.specCpu);
  const [ram, setRam] = useState(service.specRam);
  const [disk, setDisk] = useState(service.specDisk || 10);
  const [isSavingResources, setIsSavingResources] = useState(false);

  const handleAction = async (actionName: string, actionFn: (id: string) => Promise<any>) => {
    setIsActionLoading(actionName);
    try {
      const res = await actionFn(service.id);
      if (res.redirect) {
        router.push(res.redirect);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsActionLoading(null);
    }
  };

  
 
  const handleSaveResources = async () => {
    setIsSavingResources(true);
    try {
      await updateServiceResources(service.id, { specCpu: cpu, specRam: ram, specDisk: disk });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingResources(false);
    }
  };

  const currentStats = metrics.length > 0 ? metrics[metrics.length - 1] : { cpu: 0, ram: 0, requests: 0, latency: 0 };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/dashboard/${projectId}`)}
            className="p-2 hover:bg-muted rounded-xl transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight italic font-serif">{service.name}</h1>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest border",
                service.status === "live" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                service.status === "building" ? "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse" :
                "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
              )}>
                {service.status === "live" ? "Live" : service.status === "building" ? "Building" : "Stopped"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">ID: {service.id} • {service.type} 生產環境</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-xl border">
              {service.status === "stopped" ? (
                <button 
                  onClick={() => handleAction("start", startService)}
                  disabled={!!isActionLoading}
                  className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-all disabled:opacity-50"
                  title="Start Service"
                >
                  {isActionLoading === "start" ? <Loader2 className="w-4 h-4 animate-spin text-green-500" /> : <Zap className="w-4 h-4 fill-current" />}
                </button>
              ) : (
                <button 
                  onClick={() => handleAction("stop", stopService)}
                  disabled={!!isActionLoading}
                  className="p-2 hover:bg-zinc-500/10 text-zinc-500 rounded-lg transition-all disabled:opacity-50"
                  title="Stop Service"
                >
                  {isActionLoading === "stop" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                </button>
              )}
              <button 
                onClick={() => handleAction("restart", restartService)}
                disabled={!!isActionLoading || service.status === "stopped"}
                className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-all disabled:opacity-50"
                title="Restart Service"
              >
                {isActionLoading === "restart" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4 rotate-180" />}
              </button>
              <button 
                onClick={() => handleAction("rebuild", rebuildService)}
                disabled={!!isActionLoading}
                className="p-2 hover:bg-purple-500/10 text-purple-500 rounded-lg transition-all disabled:opacity-50"
                title="Rebuild Service"
              >
                {isActionLoading === "rebuild" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
           </div>

           <button 
             className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all text-blue-400"
           >
              <Globe className="w-4 h-4" />
              {service.subdomain ? `${service.subdomain}.muchcloud.me` : `${service.name.toLowerCase().replace(/\s+/g, "-")}.muchvps.app`}
           </button>
           
           <button 
             className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
           >
              部署更改
           </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[
           { label: "總請求數", value: `${currentStats.requests?.toLocaleString()}`, icon: Activity, trend: "+12%" },
           { label: "響應延遲", value: `${currentStats.latency?.toFixed(1)} ms`, icon: Terminal, trend: "-2ms" },
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-muted/30 border rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-background rounded-xl text-primary group-hover:scale-110 transition-transform">
                 <stat.icon className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-bold mt-1">{stat.value}</p>
               </div>
             </div>
             <span className={cn("text-xs font-bold", stat.trend.startsWith('+') ? "text-green-500" : "text-blue-500")}>
               {stat.trend}
             </span>
           </div>
         ))}

      </div>

      {/* Tabs Nav */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border w-fit">
        {["overview", "topology", "logs", "terminal", "snapshots", "metrics", "regions", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
              activeTab === tab ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {tab === "overview" ? "控制台" : 
             tab === "topology" ? "流量拓撲" : 
             tab === "logs" ? "日誌記錄" : 
             tab === "terminal" ? "終端機控制" :
             tab === "snapshots" ? "快照與備份" :
             tab === "metrics" ? "性能指標" :
             tab === "regions" ? "全球部署" : "服務設置"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "snapshots" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <SnapshotsView serviceId={service.id} />
            </motion.div>
          )}

          {activeTab === "terminal" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <TerminalView serviceId={service.id} />
            </motion.div>
          )}

          {activeTab === "overview" && (
            <>
               <AnimatePresence mode="wait">
                 <motion.div 
                   key="overview-grid"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Cpu className="w-5 h-5" />
                             </div>
                             <h4 className="font-bold text-zinc-100">CPU 使用率</h4>
                          </div>
                          <span className="text-xl font-bold font-mono text-blue-500">{currentStats.cpu?.toFixed(1)}%</span>
                       </div>
                       <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${currentStats.cpu}%` }}
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          />
                       </div>
                       <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <span>分配: {service.specCpu} vCPU</span>
                          <span>預留: 0.1 vCPU</span>
                       </div>
                    </div>

                    <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <HardDrive className="w-5 h-5" />
                             </div>
                             <h4 className="font-bold text-zinc-100">RAM 使用量</h4>
                          </div>
                          <span className="text-xl font-bold font-mono text-purple-500">{currentStats.ram?.toFixed(1)}%</span>
                       </div>
                       <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${currentStats.ram}%` }}
                            className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                          />
                       </div>
                       <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <span>分配: {service.specRam} GB</span>
                          <span>預留: 512 MB</span>
                       </div>
                    </div>
                 </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-8"
                  >
                     <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold italic font-serif flex items-center gap-2">
                           <Zap className="w-5 h-5 text-primary" />
                           資源配額動態調整
                        </h3>
                        { (cpu !== service.specCpu || ram !== service.specRam || disk !== (service.specDisk || 10)) && (
                           <button 
                             onClick={handleSaveResources}
                             disabled={isSavingResources}
                             className="px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2"
                           >
                             {isSavingResources ? <Loader2 className="w-3 h-3 animate-spin" /> : "儲存新規格"}
                           </button>
                        )}
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-4">
                           <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                             <span>CPU 核心數 (vCPU)</span>
                             <span className="text-primary">{cpu} Cores</span>
                           </div>
                           <input 
                             type="range" min="0.1" max="8" step="0.1" 
                             value={cpu} 
                             onChange={(e) => setCpu(parseFloat(e.target.value))}
                             className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                             <span>記憶體容量 (RAM)</span>
                             <span className="text-primary">{ram} GB</span>
                           </div>
                           <input 
                             type="range" min="0.5" max="32" step="0.5" 
                             value={ram} 
                             onChange={(e) => setRam(parseFloat(e.target.value))}
                             className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                             <span>硬碟空間 (NVMe SSD)</span>
                             <span className="text-primary">{disk} GB</span>
                           </div>
                           <input 
                             type="range" min="10" max="500" step="10" 
                             value={disk} 
                             onChange={(e) => setDisk(parseFloat(e.target.value))}
                             className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                           />
                        </div>
                     </div>
                  </motion.div>
                </AnimatePresence>

               <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="font-bold text-xl italic font-serif">實時流量拓撲</h3>
                     <button onClick={() => setActiveTab("topology")} className="text-xs font-bold text-primary hover:underline">查看詳情</button>
                  </div>
                  <div className="h-[400px] border rounded-[2rem] overflow-hidden">
                     <TopologyView />
                  </div>
               </div>
            </>
          )}

          {activeTab === "topology" && (
            <div className="h-[600px] border rounded-[2rem] overflow-hidden">
               <TopologyView />
            </div>
          )}

          {activeTab === "logs" && (
            <div className="min-h-[600px] border rounded-[2rem] overflow-hidden bg-black shadow-2xl">
               <LogsView initialLogs={initialLogs} serviceId={service.id} />
            </div>
          )}

          {activeTab === "regions" && (
            <RegionMap />
          )}

          {activeTab === "metrics" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold italic font-serif">性能趨勢指標</h3>
                  <div className="flex gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Sync</span>
                  </div>
               </div>
               <PerformanceChart data={metrics} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-6">
                  <h3 className="text-xl font-bold italic font-serif flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    環境變量管理
                  </h3>
                  <EnvEditor serviceId={service.id} initialVars={service.envVars} />
               </div>

               <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-6">
                  <h3 className="text-xl font-bold italic font-serif flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    網絡配置細覽
                  </h3>
                  <NetworkConfig />
               </div>

               <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold italic font-serif text-red-500 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      危險區域 (Danger Zone)
                    </h3>
                    <p className="text-zinc-500 text-xs font-medium">刪除此服務將永久移除所有相關日誌、指標和環境變量。此操作不可撤銷。</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-500 uppercase tracking-widest">刪除此服務</p>
                      <p className="text-[11px] text-zinc-500 font-medium">一旦刪除，您的服務將立即停止且無法恢復。</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm("您確定要刪除此服務嗎？此操作無法恢復。")) {
                          handleAction("delete", deleteService);
                        }
                      }}
                      disabled={!!isActionLoading}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {isActionLoading === "delete" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "永久刪除服務"}
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-muted/20 border rounded-[2.5rem] space-y-8">
            <h3 className="font-bold text-lg px-2">服務概覽</h3>
            <div className="space-y-6">
              {[
                { label: "運行區域", value: service.region?.name || "Unknown", icon: Globe },
                { label: "自動擴展", value: "已開啟", icon: Zap, status: true },
                { label: "SSL 認證", value: "有效", icon: Shield, status: true },
                { label: "部署源", value: "GitHub: main", icon: Layout },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className={cn("text-xs font-bold", item.status === true || item.value === "有效" || item.value === "已開啟" ? "text-green-500" : "text-foreground")}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalView({ serviceId }: { serviceId: string }) {
  const [history, setHistory] = useState<{ cmd: string; out: string }[]>([]);
  const [input, setInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting) return;

    const cmd = input.trim();
    setInput("");
    setIsExecuting(true);
    
    try {
      const out = await executeCommand(serviceId, cmd);
      setHistory(prev => [...prev.slice(-19), { cmd, out: out || "[No Output]" }]);
    } catch (err: any) {
      setHistory(prev => [...prev.slice(-19), { cmd, out: `Error: ${err.message}` }]);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="bg-black border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col h-[500px] shadow-2xl">
      <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Interactive Shell (/bin/sh)</span>
        </div>
        <div className="flex gap-1.5 text-zinc-700">
           <div className="w-2.5 h-2.5 rounded-full bg-current" />
           <div className="w-2.5 h-2.5 rounded-full bg-current" />
           <div className="w-2.5 h-2.5 rounded-full bg-current" />
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-4 custom-scrollbar bg-black/40">
        <div className="text-zinc-500 italic font-mono lowercase tracking-tight">Welcome to MuchVPS Terminal. Type 'ls', 'pwd', or 'env' to start.</div>
        {history.map((item, i) => (
          <div key={i} className="space-y-1.5 animate-in fade-in slide-in-from-left-2 transition-all">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">muchvps@container:~$</span>
              <span className="text-zinc-100">{item.cmd}</span>
            </div>
            <pre className="text-zinc-400 whitespace-pre-wrap pl-4 border-l border-zinc-900 pb-2 font-mono">{item.out}</pre>
          </div>
        ))}
        {isExecuting && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
             <Loader2 className="w-3 h-3 animate-spin" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Executing...</span>
          </div>
        )}
      </div>

      <form onSubmit={onExecute} className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center gap-3">
        <span className="text-primary font-bold text-xs shrink-0 select-none">muchvps@container:~$</span>
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入指令..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs placeholder:text-zinc-700" 
        />
        <button type="submit" disabled={isExecuting} className="sr-only">Run</button>
      </form>
    </div>
  );
}

function SnapshotsView({ serviceId }: { serviceId: string }) {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState("");
  const router = useRouter();

  const loadSnapshots = async () => {
    try {
      const data = await getSnapshots(serviceId);
      setSnapshots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, [serviceId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      await createSnapshot(serviceId, newSnapshotName);
      setNewSnapshotName("");
      await loadSnapshots();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (snapId: string) => {
    if (!confirm("確定要將服務還原至此快照嗎？這將重啟您的容器。")) return;
    try {
      await restoreSnapshot(serviceId, snapId);
      router.refresh();
      alert("還原成功！服務正在重啟。");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
               <Shield className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-zinc-100">建立即時快照</h4>
               <p className="text-xs text-zinc-500 font-medium italic mt-0.5">保存當前磁碟狀態與配置為不可變映像檔</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            value={newSnapshotName}
            onChange={(e) => setNewSnapshotName(e.target.value)}
            placeholder="快照名稱 (例如: Deployment-V1.2)"
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isCreating || !newSnapshotName.trim()}
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            建立快照
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
             <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
          </div>
        ) : snapshots.length === 0 ? (
          <div className="p-12 text-center bg-zinc-950/30 border border-dashed border-zinc-900 rounded-[2rem]">
             <p className="text-zinc-500 italic font-medium">尚無快照記錄。建立第一個快照以保障您的數據安全。</p>
          </div>
        ) : (
          snapshots.map((snap) => (
            <div key={snap.id} className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-primary transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-zinc-100">{snap.name}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{snap.imageName.substring(0, 15)}...</span>
                    <span className="text-[10px] text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-500 font-bold italic">{new Date(snap.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleRestore(snap.id)}
                className="px-5 py-2 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl hover:bg-primary hover:text-white transition-all border border-zinc-800"
              >
                還原至此版本
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
