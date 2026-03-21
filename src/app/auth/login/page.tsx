"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("登入失敗：請檢查您的電子郵件與密碼。");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("發生意外錯誤，請稍後再試。");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[100px] opacity-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[480px] bg-zinc-900/30 border border-white/10 rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_30px_rgba(99,102,241,0.5)]"
            >
              M
            </motion.div>
            <div className="space-y-1">
               <span className="font-bold text-3xl tracking-tight text-white italic font-serif">MuchVPS</span>
               <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Access Management v2</p>
               </div>
            </div>
          </Link>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
               <Mail className="w-3 h-3 text-primary" /> 電子郵件
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 px-6 text-zinc-200 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium placeholder:text-zinc-800"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
               <Lock className="w-3 h-3 text-primary" /> 安全密碼
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 px-6 text-zinc-200 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium placeholder:text-zinc-800"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs text-center font-bold bg-red-400/10 py-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <div className="pt-4">
             <button 
               type="submit" 
               disabled={loading}
               className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:shadow-[0_15px_40px_-5px_rgba(99,102,241,0.5)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   登入控制台
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-center">
           <button 
             onClick={() => signIn("github")}
             className="w-full py-4 bg-zinc-950/50 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest group"
           >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              GitHub Secure Connect
           </button>
           <p className="text-xs text-zinc-500 font-medium">
             全新加入 MuchCloud？ <Link href="/auth/signup" className="text-white font-bold hover:text-primary transition-all">立即註冊領取 $5 額度</Link>
           </p>
        </div>
      </motion.div>
      
      {/* Decorative Footer info */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em]">
         <span>Enterprise Grade</span>
         <span>•</span>
         <span>MuchCloud</span>
      </div>
    </div>
  );
}
