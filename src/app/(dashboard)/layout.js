"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import useAuthStore from "@/store/useAuthStore";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, _hydrated, hydrate } = useAuthStore();
  const router = useRouter();


  useEffect(() => {
    hydrate(); 
  }, []);

  // cient-side auth guard (middleware handles server side)
  useEffect(() => {
    if (!_hydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  },  [_hydrated, isAuthenticated, router]);

  if (!_hydrated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}