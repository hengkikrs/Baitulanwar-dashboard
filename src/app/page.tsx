"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, ArrowRight, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setGuestRole = () => {
    if (typeof window !== "undefined")
      localStorage.setItem("userRole", "guest");
  };

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {mounted && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800"
            title="Ganti Tema"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 z-10 mt-8"
      >
        {/* LOGO DIPERBESAR */}
        <Image
          src="/images/logo-masjid.png"
          alt="Logo Masjid"
          width={112} // Diperbesar secara signifikan
          height={112}
          className="mx-auto mb-6 drop-shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-2 bg-white dark:bg-slate-900"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight mb-4 transition-colors duration-300">
          Sistem Informasi{" "}
          <span className="text-blue-600 dark:text-blue-400">Musholla</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-lg mb-2 transition-colors duration-300">
          Transparansi pengelolaan dana umat. Pilih cara Anda masuk ke dalam
          sistem.
        </p>
        <p className="text-slate-500 dark:text-slate-500 text-sm font-medium transition-colors duration-300">
          {mounted ? today : "Memuat..."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10"
      >
        <Link href="/dashboard" onClick={setGuestRole} className="group">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Pengunjung Publik
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1">
              Lihat transparansi dana, riwayat donasi, dan grafik keuangan
              musholla tanpa perlu login. Hanya akses baca.
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              <span>Lihat Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </div>
          </div>
        </Link>

        <Link href="/login" className="group">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Administrator
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1">
              Login untuk mengelola data donatur, mencatat transaksi
              masuk/keluar, dan mengubah pengaturan sistem.
            </p>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-2 transition-all">
              <span>Login Admin</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
