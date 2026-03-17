"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Search, X, ChevronRight, Loader2, CheckCircle2, GitBranch, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Repo {
  name: string;
  description: string;
  language: string;
  isPrivate: boolean;
  updatedAt: string;
}

const MOCK_REPOS: Repo[] = [
  { name: "muchvps-clone-frontend", description: "Replicating MuchVPS UI with Next.js", language: "TypeScript", isPrivate: true, updatedAt: "2 mins ago" },
  { name: "awesome-nextjs-tempalte", description: "A high-performance Next.js starter kit", language: "JavaScript", isPrivate: false, updatedAt: "1 hour ago" },
  { name: "rust-api-backend", description: "Blazing fast Rust back-end with Axum", language: "Rust", isPrivate: true, updatedAt: "Yesterday" },
  { name: "python-data-processor", description: "Batch data processing scripts", language: "Python", isPrivate: false, updatedAt: "3 days ago" },
];

export function CreateProjectWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"repos" | "importing" | "success">("repos");
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const filteredRepos = MOCK_REPOS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleImport = (repo: Repo) => {
    setSelectedRepo(repo);
    setStep("importing");
    setTimeout(() => setStep("success"), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card border rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-black text-white rounded-lg">
                 <Github className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg">匯入 GitHub 倉庫</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col">
           <AnimatePresence mode="wait">
              {step === "repos" && (
                <motion.div 
                  key="repos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text"
                        placeholder="搜尋您的倉庫..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                   </div>

                   <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {filteredRepos.map((repo, i) => (
                        <button 
                          key={i}
                          onClick={() => handleImport(repo)}
                          className="w-full p-4 rounded-2xl border bg-card hover:border-primary/50 hover:bg-primary/[0.02] flex items-center justify-between group transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                 <Github className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">{repo.name}</span>
                                    {repo.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                                 </div>
                                 <p className="text-xs text-muted-foreground line-clamp-1">{repo.description}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                   </div>
                </motion.div>
              )}

              {step === "importing" && (
                <motion.div 
                  key="importing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-6"
                >
                   <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <Github className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                   </div>
                   <div className="text-center">
                      <h3 className="font-bold text-xl">正在匯入 {selectedRepo?.name}</h3>
                      <p className="text-muted-foreground mt-2">我們正在克隆源碼並偵測運行環境...</p>
                   </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-6"
                >
                   <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <div className="text-center">
                      <h3 className="font-bold text-xl">匯入成功！</h3>
                      <p className="text-muted-foreground mt-2">您的服務已準備就緒，正在啟動初次部署。</p>
                   </div>
                   <button 
                     onClick={onClose}
                     className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-lg transition-all"
                   >
                      前往控制台
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
