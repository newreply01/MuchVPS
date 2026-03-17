"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] gradient-bg pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            您的 <span className="text-primary italic">AI</span> DevOps 工程師
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            只要部署，不再煩惱。MuchVPS 讓服務部署變得簡單、快速。
          </p>
        </motion.div>

        {/* Mock AI Query Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-background border rounded-2xl shadow-xl p-4 flex items-center gap-4 group focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
              <span className="font-bold">AI</span>
            </div>
            <input
              type="text"
              placeholder="我想部署一個 React 專案並連結 PostgreSQL..."
              className="flex-1 bg-transparent border-none outline-none text-lg"
            />
            <button className="px-6 py-2 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity">
              部署
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>試試看：</span>
            <button className="px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors">部署 Redis</button>
            <button className="px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors">串接 GitHub 倉庫</button>
            <button className="px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors">管理服務網格</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
