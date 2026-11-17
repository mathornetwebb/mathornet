"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  ChefHat, 
  MapPin, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Nyheter", href: "/admin/content/news", icon: BookOpen },
  { name: "Produkter", href: "/admin/content/products", icon: Package },
  { name: "Recept", href: "/admin/content/recipes", icon: ChefHat },
  { name: "Butiker", href: "/admin/content/stores", icon: MapPin },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 text-white z-40 px-4 flex items-center justify-between shadow-lg">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center">
            <img src="/img/mathornet_logo_ny_transparent.png" alt="Mathörnet" className="h-7 w-auto object-contain" />
          </div>
          <span className="font-outfit font-extrabold text-xs tracking-wider uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">CMS</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          aria-label="Öppna meny"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={cn(
        "w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="group flex items-center gap-3">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center transition-transform duration-200 group-hover:scale-105">
              <img src="/img/mathornet_logo_ny_transparent.png" alt="Mathörnet" className="h-8 w-auto object-contain" />
            </div>
            <span className="font-outfit font-extrabold text-[10px] tracking-wider uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">CMS</span>
          </Link>
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-2">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Huvudmeny</span>
        </div>
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-950/50 font-semibold" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"
                )} />
                <span className="font-outfit">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 cms-pulse-glow" />
              Gå till webbplatsen
            </span>
            <span>↗</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logga ut</span>
          </button>
        </div>
      </aside>
    </>
  );
}
