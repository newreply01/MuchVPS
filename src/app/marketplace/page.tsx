"use client";

import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Database, Globe, Cpu, Layout, Package, Sparkles, Zap, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", name: "全部服務", icon: Package },
  { id: "databases", name: "數據庫", icon: Database },
  { id: "web", name: "Web 服務", icon: Globe },
  { id: "tools", name: "開發工具", icon: Cpu },
  { id: "cms", name: "內容管理", icon: Layout },
];

const SERVICES = [
  { 
    name: "MuchERP (Full Stack)", 
    category: "all", 
    desc: "工業級全棧 ERP 系統 (NestJS + React + PostgreSQL)，採用 Monorepo 架構。支援一鍵部署完整的拓撲結構與資料庫集群。", 
    icon: "https://muchvps.app/logo-erp.svg", 
    premium: true,
    price: "Enterprise",
    tags: ["Monorepo", "Full-Stack", "High-Availability"]
  },
  { name: "PostgreSQL", category: "databases", desc: "強大的開源對象關係數據庫系統，預配置 MuchVPS 網絡優化。", icon: "https://zeabur.com/images/marketplace/postgresql.svg" },
  { name: "Redis", category: "databases", desc: "極速緩存服務，支持 MuchVPS 一鍵 Cluster 模式。", icon: "https://zeabur.com/images/marketplace/redis.svg" },
  { name: "WordPress", category: "cms", desc: "全球最受歡迎的內容管理系統，搭配 MuchVPS Edge CDN。", icon: "https://zeabur.com/images/marketplace/wordpress.svg" },
  { name: "Nginx", category: "web", desc: "高性能 HTTP 與反向代理，內建 MuchVPS 負載均衡。", icon: "https://zeabur.com/images/marketplace/nginx.svg" },
  { name: "MinIO", category: "tools", desc: "開源 S3 兼容對象存儲，適合大數據處理。", icon: "https://zeabur.com/images/marketplace/minio.svg" },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredServices = (activeCategory === "all" 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory)).filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary selection:text-white">
      <Header />
      
      <div className="container mx-auto px-6 pt-40 pb-20">
        <header className="max-w-4xl mx-auto text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[80px] -z-10" 
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-xl shadow-primary/5"
          >
            <Sparkles className="w-3 h-3" />
            Discover MuchVPS Ecosystem
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold mb-8 italic font-serif tracking-tight"
          >
            Explore <span className="text-primary not-italic">Blueprints</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-2xl mx-auto font-medium"
          >
            從單體應用到雲端原生集群，我們為您準備了領先業界的預配置模板。
            一鍵部署，即刻上線。
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-3">
             <div className="bg-zinc-900/40 p-2 rounded-3xl border border-zinc-800/50 backdrop-blur-md">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group",
                      activeCategory === cat.id 
                        ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]" 
                        : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                       <cat.icon className={cn("w-5 h-5", activeCategory === cat.id ? "text-white" : "text-zinc-600 group-hover:text-primary transition-colors")} />
                       <span className="font-bold text-sm">{cat.name}</span>
                    </div>
                    {activeCategory === cat.id && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
                  </button>
                ))}
             </div>
          </aside>

          {/* Service Grid */}
          <div className="flex-1 space-y-8">
            <div className="relative group max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋 數據庫、框架或藍圖名稱..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-6 pl-16 pr-6 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-zinc-200 font-medium outline-none placeholder:text-zinc-600 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredServices.map((service, i) => (
                    <motion.div
                      layout
                      key={service.name}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      onClick={() => {
                        if (service.premium) window.location.href = "/dashboard?blueprint=much-erp";
                        else window.location.href = "/dashboard";
                      }}
                      className={cn(
                        "p-8 rounded-[2rem] border bg-zinc-900/30 backdrop-blur-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-500 group cursor-pointer relative flex flex-col justify-between overflow-hidden",
                        service.premium ? "border-primary/30 ring-1 ring-primary/10" : "border-zinc-800 hover:border-zinc-600"
                      )}
                    >
                      {/* Premium Glow */}
                      {service.premium && (
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all" />
                      )}

                      <div>
                         <div className="flex items-start justify-between mb-8">
                            <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-lg",
                              service.premium 
                                ? "bg-zinc-950 border-primary/20 group-hover:scale-110 group-hover:rotate-3 shadow-primary/10" 
                                : "bg-zinc-900 border-zinc-800 group-hover:bg-zinc-800"
                            )}>
                               <div className={cn("text-3xl font-bold italic font-serif", service.premium ? "text-primary" : "text-zinc-500")}>
                                 {service.name[0]}
                               </div>
                            </div>
                            
                            {service.premium && (
                              <div className="flex flex-col items-end gap-2">
                                 <div className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">
                                   Premium Blueprint
                                 </div>
                                 <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                 </div>
                              </div>
                            )}
                         </div>

                         <h3 className="text-2xl font-bold mb-3 italic font-serif tracking-tight group-hover:text-primary transition-colors">
                            {service.name}
                         </h3>
                         <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            {service.desc}
                         </p>

                         {service.tags && (
                           <div className="flex flex-wrap gap-2 mb-8">
                              {service.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                                   {tag}
                                </span>
                              ))}
                           </div>
                         )}
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-800/50 pt-6">
                         <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                            By MuchVPS Cloud
                         </div>
                         <button className={cn(
                           "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-xl",
                           service.premium 
                             ? "bg-primary text-white hover:bg-blue-600 shadow-primary/20" 
                             : "bg-white text-black hover:bg-zinc-200"
                         )}>
                            {service.premium ? "使用藍圖部署" : "立即部署"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
