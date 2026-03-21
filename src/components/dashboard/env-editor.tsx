"use client";

import { useState } from "react";
import { Plus, Trash2, Shield, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateEnvVars } from "@/app/actions/service";

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
}

interface EnvEditorProps {
  serviceId: string;
  initialVars: EnvVar[];
}

export function EnvEditor({ serviceId, initialVars }: EnvEditorProps) {
  const [vars, setVars] = useState<EnvVar[]>(initialVars);
  const [revealAll, setRevealAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const addVar = () => setVars([...vars, { key: "", value: "", isSecret: false }]);
  const removeVar = (index: number) => setVars(vars.filter((_, i) => i !== index));
  const updateVar = (index: number, field: keyof EnvVar, val: any) => {
    const newVars = [...vars];
    newVars[index] = { ...newVars[index], [field]: val };
    setVars(newVars);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateEnvVars(serviceId, vars);
      alert("環境變量已保存！");
    } catch (error) {
      console.error(error);
      alert("保存失敗，請重試。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">環境變量</h2>
          <p className="text-sm text-muted-foreground mt-1">配置您的服務所需的環境變量或秘密信息。</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setRevealAll(!revealAll)}
             className="p-2 border rounded-xl hover:bg-muted transition-colors"
           >
             {revealAll ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             保存更改
           </button>
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden bg-card">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-muted/50 border-b">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">鍵 (Key)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">值 (Value)</th>
                  <th className="px-6 py-4 w-20"></th>
               </tr>
            </thead>
            <tbody className="divide-y">
               {vars.map((v, i) => (
                 <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                       <input 
                         type="text" 
                         value={v.key}
                         onChange={(e) => updateVar(i, "key", e.target.value)}
                         placeholder="ENV_NAME"
                         className="bg-transparent border-none outline-none font-mono text-sm w-full focus:text-primary"
                       />
                    </td>
                    <td className="px-6 py-4">
                       <div className="relative">
                          <input 
                            type={!revealAll && v.isSecret ? "password" : "text"}
                            value={v.value}
                            onChange={(e) => updateVar(i, "value", e.target.value)}
                            placeholder="value"
                            className="bg-transparent border-none outline-none font-mono text-sm w-full focus:text-primary pr-8"
                          />
                          <button 
                            onClick={() => updateVar(i, "isSecret", !v.isSecret)}
                            className={cn(
                              "absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors",
                              v.isSecret ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <button 
                         onClick={() => removeVar(i)}
                         className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                 </tr>
               ))}
               <tr>
                  <td colSpan={3} className="px-4 py-2">
                     <button 
                       onClick={addVar}
                       className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-dashed border-transparent hover:border-primary/30 mt-2 mb-2"
                     >
                        <Plus className="w-4 h-4" /> 新增變量
                     </button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
}
