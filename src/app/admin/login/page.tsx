"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login result:", res);

      if (res?.error) {
        setError("Felaktig e-postadress eller lösenord.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Ett oväntat fel uppstod.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 relative z-10 cms-animate-fade-in">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 shadow-xs">
            <Image
              src="/img/mathornet_logo_ny_transparent.png"
              alt="Mathörnet"
              width={160}
              height={45}
              className="mx-auto h-9 w-auto object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Logga in för att hantera produkter, nyheter och recept
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label htmlFor="email-address" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                E-postadress
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
                  placeholder="admin@mathornet.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Lösenord
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loggar in...</span>
                </>
              ) : (
                <span>Logga in</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Säker och krypterad anslutning
          </span>
        </div>
      </div>
    </div>
  );
}

