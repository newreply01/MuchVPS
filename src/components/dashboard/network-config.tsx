"use client";

import { useState } from "react";
import { Globe, Plus, Link2, ExternalLink, Settings, ShieldCheck, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkConfig() {
  const [copied, setCopied] = useState(false);
  const internalDomain = "redis-demo.zeabur.internal";

  const handleCopy = () => {
    navigator.clipboard.writeText(internalDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Internal Networking (Wonder Mesh) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            內部網絡 (Wonder Mesh)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">同一項目中的其他服務可以透過此名稱與該服務通訊。</p>
        </div>
        
        <div className="p-6 rounded-2xl border bg-card flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold font-mono text-sm underline decoration-primary/30 underline-offset-4">
                {internalDomain}
              </div>
              <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full">
                已連結
              </div>
           </div>
           <button 
             onClick={handleCopy}
             className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted transition-all font-medium text-sm"
           >
             {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
             {copied ? "已複製" : "複製網名"}
           </button>
        </div>
      </section>

      {/* Public Domains */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-xl font-bold">公有網域</h2>
             <p className="text-sm text-muted-foreground mt-1">將您的服務暴露至互聯網。</p>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all">
             <Plus className="w-4 h-4" /> 綁定域名
           </button>
        </div>

        <div className="space-y-4">
           {[
             { domain: "redis-demo.muchvps.app", type: "MuchVPS 域名", ssl: true },
             { domain: "cache.mycompany.com", type: "自定義域名", ssl: true }
           ].map((d, i) => (
             <div key={i} className="p-4 rounded-2xl border bg-card flex items-center justify-between hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                      <Globe className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold">{d.domain}</span>
                         <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.type}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">
                      <ShieldCheck className="w-3 h-3" /> SSL 有效
                   </div>
                   <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
                      <ExternalLink className="w-4 h-4" />
                   </button>
                   <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
                      <Settings className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
