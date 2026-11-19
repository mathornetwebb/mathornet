import { 
  BookOpen, 
  Package, 
  ChefHat, 
  MapPin,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Sparkles,
  Server,
  Activity
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { PublishButton } from "./PublishButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const newsCount = await prisma.news.count();
  const productCount = await prisma.product.count();
  const recipeCount = await prisma.recipe.count();
  const storeCount = await prisma.store.count();

  const stats = [
    { 
      name: "Nyheter", 
      value: newsCount.toString(), 
      icon: BookOpen, 
      href: "/admin/content/news", 
      gradient: "from-blue-600 to-indigo-600",
      bgTint: "bg-blue-50 text-blue-700 border-blue-100",
      desc: "Artiklar & inlägg"
    },
    { 
      name: "Produkter", 
      value: productCount.toString(), 
      icon: Package, 
      href: "/admin/content/products", 
      gradient: "from-emerald-600 to-teal-600",
      bgTint: "bg-emerald-50 text-emerald-700 border-emerald-100",
      desc: "Mathörnet & Ahalna"
    },
    { 
      name: "Recept", 
      value: recipeCount.toString(), 
      icon: ChefHat, 
      href: "/admin/content/recipes", 
      gradient: "from-amber-500 to-orange-500",
      bgTint: "bg-amber-50 text-amber-700 border-amber-100",
      desc: "Middagar & rätter"
    },
    { 
      name: "Butiker", 
      value: storeCount.toString(), 
      icon: MapPin, 
      href: "/admin/content/stores", 
      gradient: "from-purple-600 to-pink-600",
      bgTint: "bg-purple-50 text-purple-700 border-purple-100",
      desc: "Återförsäljare"
    },
  ];

  const quickActions = [
    { title: "Ny Nyhet", subtitle: "Skriv ett nyhetsinlägg", href: "/admin/content/news/new", icon: BookOpen, color: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white" },
    { title: "Ny Produkt", subtitle: "Lägg till i sortimentet", href: "/admin/content/products/new", icon: Package, color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white" },
    { title: "Nytt Recept", subtitle: "Skapa matinspiration", href: "/admin/content/recipes/new", icon: ChefHat, color: "text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white" },
    { title: "Ny Butik", subtitle: "Lägg till återförsäljare", href: "/admin/content/stores/new", icon: MapPin, color: "text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto cms-animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/5 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mathörnet Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Välkommen tillbaka! Här är en översikt av ditt innehåll och administration.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <span>Visa live-sida</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 block cursor-pointer overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-sm shadow-slate-900/10 transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                  <span className="text-xs text-slate-400 font-medium">{stat.desc}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Snabba åtgärder (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">Snabba åtgärder</h3>
              <p className="text-xs text-slate-500 mt-0.5">Skapa nytt innehåll med ett klick</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">4 genvägar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-lg transition-colors duration-200 ${action.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-bold text-sm text-slate-900 group-hover:text-slate-950 truncate">
                        {action.title}
                      </span>
                      <span className="block text-xs text-slate-500 truncate mt-0.5">
                        {action.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Systemstatus & Publicering (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">Systemstatus</h3>
                  <p className="text-xs text-slate-500">Driftstatus och plattform</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 cms-pulse-glow"></span>
                <span>Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Miljö</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">Produktion</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Version</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">v1.0.0</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <div className="mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Publicera ändringar</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                När du har lagt till eller ändrat innehåll klickar du nedan för att omedelbart uppdatera live-sidan.
              </p>
            </div>
            <PublishButton />
          </div>
        </div>
      </div>
    </div>
  );
}

