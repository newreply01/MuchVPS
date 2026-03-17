"use client";

import Link from "next/link";
import { ThemeToggler } from "./ui/theme-toggler";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="font-bold text-xl tracking-tight">MuchVPS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">產品</Link>
            <Link href="/marketplace" className="hover:text-primary transition-colors">市場</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">控制台</Link>
            <Link href="#" className="hover:text-primary transition-colors">文檔</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggler />
          <Link
            href="/auth/login"
            className="hidden md:block text-sm font-medium hover:text-primary transition-colors"
          >
            登入
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
          >
            開始使用
          </Link>
        </div>
      </div>
    </header>
  );
}
