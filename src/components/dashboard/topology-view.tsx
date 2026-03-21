"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Database, Globe, ArrowRight, X, Activity, Cpu, HardDrive, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeData {
  id: string;
  type: "frontend" | "backend" | "database";
  name: string;
  status: "live" | "deploying" | "error";
  metrics?: {
    cpu: string;
    ram: string;
    uptime: string;
  };
}

const NODES: NodeData[] = [
  { 
    id: "1", 
    type: "frontend", 
    name: "MuchERP Web", 
    status: "live",
    metrics: { cpu: "12%", ram: "256MB", uptime: "14d 2h" }
  },
  { 
    id: "2", 
    type: "backend", 
    name: "ERP Backend", 
    status: "live",
    metrics: { cpu: "45%", ram: "1.2GB", uptime: "14d 2h" }
  },
  { 
    id: "3", 
    type: "database", 
    name: "MuchERP DB", 
    status: "live",
    metrics: { cpu: "5%", ram: "512MB", uptime: "45d 8h" }
  }
];

const TrafficParticles = ({ delay = 0 }: { delay?: number }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <motion.div
         initial={{ x: -40, opacity: 0 }}
         animate={{ 
           x: [ -40, 40 ],
           opacity: [ 0, 1, 0 ],
           scale: [ 1, 1.5, 1 ]
         }}
         transition={{ 
           duration: 2, 
           repeat: Infinity, 
           delay,
           ease: "linear"
         }}
         className="w-1.5 h-1.5 bg-blue-400 rounded-full blur-[2px] shadow-[0_0_8px_rgba(96,165,250,0.8)]"
       />
    </div>
  );
};

const Node = ({ node, isActive, onClick }: { node: NodeData; isActive: boolean; onClick: () => void }) => {
  const icons = {
    frontend: <Globe className="w-5 h-5" />,
    backend: <Server className="w-5 h-5" />,
    database: <Database className="w-5 h-5" />,
  };

  const statusColors = {
    live: "bg-green-500",
    deploying: "bg-blue-500 animate-pulse",
    error: "bg-red-500",
  };

  return (
    <motion.div
      layoutId={node.id}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: isActive ? "rgba(59, 130, 246, 0.5)" : "rgba(39, 39, 42, 1)"
      }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(39, 39, 42, 0.8)" }}
      className={cn(
        "relative flex flex-col items-center p-4 bg-zinc-900/50 border rounded-xl w-44 cursor-pointer transition-all duration-300",
        isActive && "bg-blue-500/5 ring-1 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
      )}
    >
      {/* Pulse Effect for Live Nodes */}
      {node.status === "live" && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none"
        />
      )}

      <div className={cn(
        "p-3 rounded-lg bg-zinc-800 mb-2 transition-colors relative z-10",
        isActive ? "text-blue-400 bg-blue-500/10" : "text-zinc-400"
      )}>
        {icons[node.type]}
      </div>
      <span className="text-sm font-bold text-zinc-100 relative z-10">{node.name}</span>
      <div className="mt-2 flex items-center gap-1.5 relative z-10">
        <div className={`w-2 h-2 rounded-full ${statusColors[node.status]} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          {node.status}
        </span>
      </div>
    </motion.div>
  );
};

export function TopologyView() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const activeNode = NODES.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-6">
      <div className="p-10 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden min-h-[450px] shadow-2xl">
        {/* Advanced Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-16 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 px-4 py-1.5 bg-zinc-900/80 rounded-full border border-zinc-800 backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              Real-time Traffic Mesh
            </h3>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            <Node 
              node={NODES[0]} 
              isActive={selectedNodeId === "1"} 
              onClick={() => setSelectedNodeId(selectedNodeId === "1" ? null : "1")} 
            />

            <div className="hidden md:flex flex-col items-center relative w-20">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              <TrafficParticles delay={0} />
              <TrafficParticles delay={0.7} />
              <TrafficParticles delay={1.4} />
              <span className="text-[9px] font-bold text-zinc-600 mt-2 uppercase tracking-tighter">HTTPS</span>
            </div>

            <Node 
              node={NODES[1]} 
              isActive={selectedNodeId === "2"} 
              onClick={() => setSelectedNodeId(selectedNodeId === "2" ? null : "2")} 
            />

            <div className="hidden md:flex flex-col items-center relative w-20">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              <TrafficParticles delay={0.3} />
              <TrafficParticles delay={1.0} />
              <TrafficParticles delay={1.7} />
              <span className="text-[9px] font-bold text-zinc-600 mt-2 uppercase tracking-tighter">Prisma / SQL</span>
            </div>

            <Node 
              node={NODES[2]} 
              isActive={selectedNodeId === "3"} 
              onClick={() => setSelectedNodeId(selectedNodeId === "3" ? null : "3")} 
            />
          </div>
        </div>

        {/* Improved Detail Panel */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 p-8 z-20 shadow-[ -20px_0_50px_rgba(0,0,0,0.5) ]"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {activeNode.type === "frontend" && <Globe className="w-6 h-6" />}
                    {activeNode.type === "backend" && <Server className="w-6 h-6" />}
                    {activeNode.type === "database" && <Database className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-zinc-100 leading-none">{activeNode.name}</h4>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{activeNode.status}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h5 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Live Performance</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 group hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">CPU Load</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-100">{activeNode.metrics?.cpu}</span>
                    </div>
                    <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 group hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">RAM Usage</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-100">{activeNode.metrics?.ram}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Network Info</h5>
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-500">Uptime</span>
                      <span className="text-zinc-200 font-mono tracking-tight">{activeNode.metrics?.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-500">Location</span>
                      <span className="text-zinc-200">Tokyo (hnd-01)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-500">Instance IP</span>
                      <span className="text-zinc-200 font-mono text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded leading-none">10.0.42.{100 + parseInt(activeNode.id)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-3 active:scale-95">
                    <HardDrive className="w-4 h-4" />
                    查看實時日誌串流
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-zinc-600 font-medium text-center uppercase tracking-widest">
        * 點擊任何節點即可進入深度偵測模式
      </p>
    </div>
  );
}
