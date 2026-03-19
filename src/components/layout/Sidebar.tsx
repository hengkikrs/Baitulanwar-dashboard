"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings,
  LogOut,
  Home,
  Info, // Tambahkan import Info
} from "lucide-react";
import Image from "next/image";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName"); // Bersihkan nama juga
      router.push("/");
    }
  };

  // Tambahkan menu Tentang
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      show: true,
    },
    { name: "Donatur", icon: Users, path: "/dashboard/donatur", show: true },
    {
      name: "Transaksi",
      icon: ArrowLeftRight,
      path: "/dashboard/transaksi",
      show: true,
    },
    { name: "Tentang", icon: Info, path: "/dashboard/tentang", show: true }, // Menu baru untuk semua
    {
      name: "Pengaturan",
      icon: Settings,
      path: "/dashboard/pengaturan",
      show: role === "admin",
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col shadow-2xl lg:shadow-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <Image
          src="/images/logo-masjid.png"
          alt="Logo Masjid"
          width={44}
          height={44}
          className="mr-3 shrink-0"
        />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors duration-300">
          Baitul <span className="text-blue-600 dark:text-blue-400">Maal</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
              >
                <span
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors duration-200 shrink-0",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400",
                    )}
                  />
                  {item.name}
                </span>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
        {role === "admin" ? (
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors shrink-0" />
            <span className="font-medium">Keluar Admin</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
          >
            <Home className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="font-medium">Halaman Utama</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
