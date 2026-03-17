"use client";

import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, Database, Globe, Cpu, Layout, Package } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", name: "全部", icon: Package },
  { id: "databases", name: "數據庫", icon: Database },
  { id: "web", name: "Web 服務", icon: Globe },
  { id: "tools", name: "工具", icon: Cpu },
  { id: "cms", name: "內容管理", icon: Layout },
];

const SERVICES = [
  { name: "PostgreSQL", category: "databases", desc: "強大的開源對象關係數據庫系統。", icon: "https://zeabur.com/images/marketplace/postgresql.svg" },
  { name: "Redis", category: "databases", desc: "開源的高性能鍵值對數據庫。", icon: "https://zeabur.com/images/marketplace/redis.svg" },
  { name: "MongoDB", category: "databases", desc: "領先的 NoSQL 數據庫。", icon: "https://zeabur.com/images/marketplace/mongodb.svg" },
  { name: "WordPress", category: "cms", desc: "全球最受歡迎的開源內容管理系統。", icon: "https://zeabur.com/images/marketplace/wordpress.svg" },
  { name: "MySQL", category: "databases", desc: "最流行的開源關係型數據庫。", icon: "https://zeabur.com/images/marketplace/mysql.svg" },
  { name: "Ghost", category: "cms", desc: "專業的開源出版平台。", icon: "https://zeabur.com/images/marketplace/ghost.svg" },
  { name: "Nginx", category: "web", desc: "高性能的 HTTP 和反向代理服務器。", icon: "https://zeabur.com/images/marketplace/nginx.svg" },
  { name: "MinIO", category: "tools", desc: "開源的高性能對象存儲。", icon: "https://zeabur.com/images/marketplace/minio.svg" },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all" 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            服務市場
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            一鍵部署您最喜愛的數據庫、工具與開源軟體。
          </motion.p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-2">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 px-4">分類</h2>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  activeCategory === cat.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "hover:bg-muted"
                )}
              >
                <cat.icon className="w-5 h-5" />
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </aside>

          {/* Service Grid */}
          <div className="flex-1">
            <div className="mb-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="搜尋服務..." 
                className="w-full bg-muted/50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, i) => (
                <motion.div
                  layout
                  key={service.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => alert(`${service.name} 部署已啟動！正在跳轉至控制台...`)}
                  className="p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                       <div className="text-2xl font-bold text-primary">{service.name[0]}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${service.name} 部署已啟動！正在跳轉至控制台...`);
                        window.location.href = "/dashboard";
                      }}
                      className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:shadow-lg transition-colors"
                    >
                      部署
                    </button>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
