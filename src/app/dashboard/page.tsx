"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Memuat komponen secara dinamis (SSR dimatikan)
const SummaryCards = dynamic(() => import("@/components/dashboard/SummaryCards"), { ssr: false });
const FinanceChart = dynamic(() => import("@/components/dashboard/FinanceChart"), { ssr: false });
const MonthlyTrendChart = dynamic(() => import("@/components/dashboard/MonthlyTrendChart"), { ssr: false });
const FundSourceChart = dynamic(() => import("@/components/dashboard/FundSourceChart"), { ssr: false });
const FundUsageChart = dynamic(() => import("@/components/dashboard/FundUsageChart"), { ssr: false });
const RecentDonorsTable = dynamic(() => import("@/components/dashboard/RecentDonorsTable"), { ssr: false });
const DonationRadarChart = dynamic(() => import("@/components/dashboard/DonationRadarChart"), { ssr: false });
const TopDonorsList = dynamic(() => import("@/components/dashboard/TopDonorsList"), { ssr: false });

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white transition-colors tracking-tight">
            Dashboard Utama
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Statistik real-time Musholla Baitul Anwar
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Status Sistem</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Terhubung ke Supabase
          </p>
        </div>
      </div>

      {/* Kartu Ringkasan Atas */}
      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Utama Arus Kas (Besar) */}
        <div className="lg:col-span-2">
          <FinanceChart />
        </div>
        
        {/* Peringkat Donatur (Kecil di samping) */}
        <div className="lg:col-span-1">
          <TopDonorsList />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Radar Chart Kategori */}
        <DonationRadarChart />
        
        {/* Tren Pemasukan Bulanan */}
        <MonthlyTrendChart />

        {/* Sumber Dana Pie */}
        <FundSourceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alokasi Penggunaan Dana */}
        <FundUsageChart />
        
        {/* Tabel Donatur Terbaru */}
        <RecentDonorsTable />
      </div>
    </motion.div>
  );
}
