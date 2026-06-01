"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="text-sm font-semibold tracking-wider text-slate-400">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space text-white">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header Panel */}
        <header className="flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950/20 px-8 backdrop-blur-md">
          <h1 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Secured AI Workspace
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-medium text-slate-300">
              Welcome, <span className="font-bold text-white">{user?.name}</span>
            </p>
          </div>
        </header>

        {/* Dashboard Pages view */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
