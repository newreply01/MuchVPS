"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, X, Cpu, TrendingUp, Zap, Server, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
  isAction?: boolean;
}

export function DeploymentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "你好！我是您的 MuchVPS AI 助手。請問今天想部署或优化什麼項目？" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [scalingService, setScalingService] = useState<string | null>(null);

  useEffect(() => {
    const handleTriggerScaling = (e: any) => {
      const { service } = e.detail;
      setScalingService(service);
      setIsOpen(true);
      const userMsg: Message = { role: "user", content: `請分析 ${service} 服務的流量並建議擴容方案。` };
      setMessages(prev => [...prev.slice(-10), userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        const botMsg: Message = { 
          role: "bot", 
          content: `正在分析 ${service} 的歷史指標... 檢測到負載波動。我建議將該服務擴容至 **Pro Tier** (2 vCPU / 4GB RAM)，以應對預計在 2 小時後出現的流量高峰。`,
          isAction: true
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 2000);
    };

    const handleBlueprintStart = (e: any) => {
      const { blueprint } = e.detail;
      setIsOpen(true);
      setIsTyping(true);
      setTimeout(() => {
        const botMsg: Message = { 
          role: "bot", 
          content: `我偵測到您正在啟動 **MuchERP** 藍圖部署。這是一個複雜的全棧環境，我建議在「資源配置」步驟中為資料庫選擇 **Pro Tier** 以上規格，以確保 ERP 系統的處理效能與穩定性。`,
        };
        setMessages(prev => [...prev.slice(-10), botMsg]);
        setIsTyping(false);
      }, 1500);
    };

    window.addEventListener("trigger-ai-scaling", handleTriggerScaling);
    window.addEventListener("blueprint-session-start", handleBlueprintStart);
    
    return () => {
      window.removeEventListener("trigger-ai-scaling", handleTriggerScaling);
      window.removeEventListener("blueprint-session-start", handleBlueprintStart);
    };
  }, []);

  const handleApplyScaling = async () => {
    if (!scalingService) return;
    
    setIsTyping(true);
    try {
      const res = await fetch(`/api/services/${scalingService}/scale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSpec: "Pro Tier", reason: "AI Recommendation" })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: `✅ 擴容指令已下達：${data.message}。環境將在 30 秒內自動無感切換。` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "抱歉，調用 Scaling API 時發生錯誤。" }]);
    }
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "這聽起來很棒！我可以幫您準備部署範例。正在分析您的需求...";
      if (input.toLowerCase().includes("erp")) {
        response = "**MuchERP** 是我們的旗艦模板。它包含 NestJS 後端並預配置了 Redis 加速。我可以幫您自動生成數據庫連線字符串。";
      } else if (input.includes("擴容")) {
        response = "擴容請求已受理。我建議使用領先於行業的『智能彈性伸縮』功能，這比 Zeabur 提供的基礎定時自動擴容更為靈活。";
      }
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(99,102,241,0.6)] transition-all",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            className="fixed bottom-8 right-8 z-50 w-[440px] h-[680px] bg-[#09090b]/90 border border-white/10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 text-white flex items-center justify-between shadow-2xl shrink-0">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
                    <Sparkles className="w-6 h-6 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl italic font-serif tracking-tight">MuchDevOps AI</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                       <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest italic">Intelligence V4.0 Active</div>
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-white/[0.01] custom-scrollbar">
               {messages.map((msg, i) => (
                 <div key={i} className={cn(
                   "flex items-start gap-4 transition-all duration-500",
                   msg.role === "user" ? "flex-row-reverse" : "animate-in fade-in slide-in-from-left-4"
                 )}>
                    <div className={cn(
                      "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border transition-all",
                      msg.role === "user" ? "bg-zinc-800 border-zinc-700" : "bg-primary/20 border-primary/20 text-primary"
                    )}>
                       {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={cn("flex flex-col gap-2 max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                       <div className={cn(
                         "p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-lg backdrop-blur-sm",
                         msg.role === "user" 
                           ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                           : "bg-white/5 border border-white/10 text-zinc-100 rounded-tl-none"
                       )}>
                          {msg.content}
                       </div>
                       {msg.isAction && (
                         <div className="w-full p-4 bg-primary/10 border border-primary/20 rounded-[1.5rem] flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-2">
                               <TrendingUp className="w-4 h-4 text-primary" />
                               <span className="text-[10px] font-bold text-primary uppercase tracking-widest italic">Recommended Optimization</span>
                            </div>
                            <div className="text-xs text-zinc-400 font-medium font-serif leading-tight">切換至高性能分部署集群以支撐流量峰值。<br/>(Pro Tier: 2 vCPU / 4GB RAM)</div>
                            <button 
                              onClick={handleApplyScaling}
                              className="w-full py-4 bg-primary text-white text-[11px] font-bold rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 transform active:scale-95 flex items-center justify-center gap-2"
                            >
                               立即應用智能擴容
                               <Zap className="w-3.5 h-3.5 fill-current" />
                            </button>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex items-center gap-2 p-4 bg-white/5 w-20 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
               )}
            </div>

            {/* Input */}
            <div className="p-8 border-t border-white/10 bg-zinc-950/50 shrink-0">
               <div className="relative flex items-center group">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="問問如何優化部署 MuchERP..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-[2rem] py-5 pl-8 pr-16 text-sm text-zinc-200 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner outline-none placeholder:text-zinc-700"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-3 p-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-[1.5rem] transition-all transform active:scale-90"
                  >
                    <Send className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
