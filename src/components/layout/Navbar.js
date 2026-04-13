"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Clear the cookie middleware reads
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">

      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          {/* Hamburger icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <Link href="/" className="text-lg font-bold text-blue-600 tracking-tight">
          UserPanel- Pharmaedge.ai
        </Link>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full
          ${user?.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-green-100 text-green-700"
          }`}
        >
          {user?.role}
        </span>

        {/* Name */}
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[160px] truncate">
          {user?.name}
        </span>

        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center uppercase flex-shrink-0">
          {user?.name?.[0] ?? "U"}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}