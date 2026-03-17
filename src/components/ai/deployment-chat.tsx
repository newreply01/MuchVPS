"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function DeploymentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "你好！我是您的 MuchVPS AI 助手。請問今天想部署什麼專案？" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "這聽起來很棒！我可以幫您準備部署範例。正在分析您的需求...";
      if (input.includes("Redis")) {
        response = "好的，我將為您準備一個 Redis 數據庫服務。這將自動分配一個內部網名 `redis:6379`。";
      } else if (input.includes("React")) {
        response = "檢測到 React 專案需求。我建議使用靜態託管模式，並可以為您自動配置 CI/CD。";
      }
      
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[400px] h-[600px] bg-background border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold">MuchVPS AI</h3>
                    <div className="text-[10px] uppercase font-bold text-white/70 tracking-tighter">AI DevOps Engineer</div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {messages.map((msg, i) => (
                 <div key={i} className={cn(
                   "flex items-start gap-2 max-w-[85%]",
                   msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                 )}>
                    <div className={cn(
                      "p-2 rounded-lg",
                      msg.role === "user" ? "bg-muted" : "bg-primary/10 text-primary"
                    )}>
                       {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user" ? "bg-primary text-white" : "bg-muted"
                    )}>
                       {msg.content}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex items-center gap-1.5 p-3 bg-muted w-12 rounded-full">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
               )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-muted/30">
               <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="問問 AI 如何部署..."
                    className="w-full bg-background border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
