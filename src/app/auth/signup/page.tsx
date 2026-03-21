"use client";

import { useState } from "react";
import { signup } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Github } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signup(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[100px] opacity-10" />

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
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Identity Cloud v2</p>
               </div>
            </div>
          </Link>
        </div>

        <div className="min-h-[350px]">
           <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center space-y-8 py-4"
                >
                   <div className="relative inline-block">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" 
                      />
                      <div className="w-20 h-20 bg-green-500/10 text-green-500 border border-green-500/20 rounded-3xl flex items-center justify-center relative">
                         <Mail className="w-10 h-10" />
                      </div>
                   </div>
                   <div>
                      <h2 className="font-bold text-2xl text-white italic font-serif">註冊成功</h2>
                      <p className="text-zinc-500 mt-3 leading-relaxed text-sm">
                         帳號 <span className="text-primary font-bold">{email}</span> 已成功啟動。現在您可以登入 MuchCloud 控制台。
                      </p>
                   </div>
                   <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-[0_15px_40px_-5px_rgba(99,102,241,0.5)] transition-all transform active:scale-95 shadow-xl">
                      <ArrowRight className="w-4 h-4" /> 前往登入介面
                   </Link>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSignup} 
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                       <Mail className="w-3 h-3 text-primary" /> 電子郵件地址
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

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
                     <ShieldCheck className="w-5 h-5 text-primary" />
                     <p className="text-[11px] text-primary/70 leading-relaxed font-medium">
                        您的數據將通過 256 位加密存儲，並自動部署在 MuchCloud 全球分散式身份集群中。
                     </p>
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
                           啟動部署之旅
                           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                     </button>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-center">
                     <button 
                       type="button" 
                       onClick={() => signIn("github")}
                       className="w-full py-4 bg-zinc-950/50 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest group"
                     >
                       <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                       GitHub Secure Connect
                     </button>
                    <p className="text-center text-xs text-zinc-500 pt-2 font-medium">
                      已有帳號？ <Link href="/auth/login" className="text-primary font-bold hover:underline transition-all">立即登入</Link>
                    </p>
                  </div>
                </motion.form>
              )}
           </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Decorative Footer info */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em]">
         <span>Encrypted</span>
         <span>•</span>
         <span>Global</span>
         <span>•</span>
         <span>MuchVPS</span>
      </div>
    </div>
  );
}
