"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getBillingData } from "@/app/actions/billing";

const mockInvoices = [
  { id: "INV-2024-003", date: "2024-03-01", amount: "$42.50", status: "Paid" },
  { id: "INV-2024-002", date: "2024-02-01", amount: "$38.00", status: "Paid" },
  { id: "INV-2024-001", date: "2024-01-01", amount: "$15.20", status: "Paid" },
];

export default function BillingPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getBillingData().then(setData).catch(console.error);
  }, []);

  if (!data) return (
    <div className="flex h-96 items-center justify-center">
      <Zap className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold italic font-serif tracking-tight">帳戶與帳單</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium italic">管理您的訂閱計畫、查看資源用量與下載歷史發票。</p>
      </div>
 
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "當前餘額", value: `$${data.balance.toFixed(2)}`, sub: "預計本月底結算", icon: CreditCard, color: "text-primary" },
          { label: "本月用量 (已累計)", value: `$${data.accumulatedCost.toFixed(4)}`, sub: "即時計算中", icon: TrendingUp, color: "text-green-500" },
          { label: "預計月支出", value: `$${data.estimatedMonthCost.toFixed(2)}`, sub: "基於當前負載", icon: Clock, color: "text-blue-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
             <h3 className="text-3xl font-bold italic font-serif">{stat.value}</h3>
             <p className="text-[10px] text-zinc-600 font-bold mt-2 uppercase tracking-widest">{stat.sub}</p>
          </motion.div>
        ))}
      </div>
 
      {/* Usage Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-bold text-xl italic font-serif">資源用量分析</h3>
              </div>
              
              <div className="space-y-8">
                 {[
                   { label: "運算資源 (vCPU Hours)", used: data.usage.cpuHours, total: 10, icon: Zap },
                   { label: "記憶體實例 (GB Hours)", used: data.usage.ramGbHours, total: 20, icon: Database },
                   { label: "全球流量 (Bandwidth GB)", used: data.usage.bandwidth, total: 5, icon: Globe },
                 ].map((item) => (
                   <div key={item.label} className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-primary" />
                            <span>{item.label}</span>
                         </div>
                         <span className="text-zinc-500">{item.used} / {item.total}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min((item.used / item.total) * 100, 100)}%` }}
                           transition={{ duration: 1.5, ease: "circOut" }}
                           className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
 
           <div className="p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5">
              <h3 className="font-bold text-xl italic font-serif mb-6">付費方式</h3>
              <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
                       <CreditCard className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                       <p className="font-bold text-sm">•••• •••• •••• 4242</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">VISA - Expires 12/26</p>
                    </div>
                 </div>
                 <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">編輯</button>
              </div>
           </div>
        </div>
 
        <div className="space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 h-full">
              <h3 className="font-bold text-xl italic font-serif mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                帳單歷史
              </h3>
              <div className="space-y-4">
                 {mockInvoices.map((inv) => (
                   <div key={inv.id} className="p-4 bg-zinc-900/50 rounded-2xl border border-transparent hover:border-white/10 transition-all flex items-center justify-between group">
                      <div>
                         <p className="font-bold text-xs">{inv.id}</p>
                         <p className="text-[10px] text-zinc-500 font-bold">{inv.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-sm text-primary">{inv.amount}</p>
                         <button className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 mt-1 font-serif italic">
                           PDF <ExternalLink className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">
                查看所有發票
              </button>
           </div>
        </div>
      </div>
 
      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold">企業級安全保障</h4>
               <p className="text-xs text-primary/70 font-medium">您的所有支付數據均通過 PCI 級別安全認證， MuchCloud 不會儲存您的銀行卡號。</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all whitespace-nowrap">
            升級計費計畫
         </button>
      </div>
    </div>
  );
}
