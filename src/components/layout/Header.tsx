"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, User, Moon, Sun, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
      setUserName(localStorage.getItem("userName"));
    }
  }, []);

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const isGuest = role !== "admin";

  // Logika Sapaan Dinamis
  const greetingName = isGuest
    ? "Pengunjung!"
    : userName
      ? `${userName}!`
      : "Admin!";
  const profileName = isGuest
    ? "Pengunjung Publik"
    : userName || "Administrator";

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 transition-colors duration-300"
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-3 md:mr-4 text-slate-500 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
            Assalamu&apos;alaikum, {greetingName}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 md:mt-1 transition-colors duration-300">
            {mounted ? today : "Memuat..."}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari donatur atau transaksi..."
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:text-white transition-all w-64"
          />
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Ganti Tema"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Moon className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        )}

        <button className="relative p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-3 md:pl-6 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {profileName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuest ? "Akses Baca" : "Administrator"}
            </p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
            <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
