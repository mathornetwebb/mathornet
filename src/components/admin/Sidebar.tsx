"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  ChefHat, 
  MapPin, 
  LogOut,
  Settings
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

  return (
    <aside className="w-64 bg-[#1B263B] text-white flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl">
      <div className="p-6 border-b border-white/10 flex flex-col gap-4">
        <Link href="/">
          <img src="/img/mathornet_logo_ny_transparent.png" alt="Mathörnet" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="px-6 pt-6">
        <span className="font-outfit font-bold text-sm tracking-widest text-white/50 uppercase">Admin CMS</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-white/40 group-hover:text-white"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logga ut</span>
        </button>
      </div>
    </aside>
  );
}
