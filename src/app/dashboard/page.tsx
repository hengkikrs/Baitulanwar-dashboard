"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Memuat komponen secara dinamis (SSR dimatikan)
// Ini adalah KUNCI agar grafik Recharts + LocalStorage berjalan mulus di server online
const SummaryCards = dynamic(() => import("@/components/dashboard/SummaryCards"), { ssr: false });
const FinanceChart = dynamic(() => import("@/components/dashboard/FinanceChart"), { ssr: false });
const FundSourceChart = dynamic(() => import("@/components/dashboard/FundSourceChart"), { ssr: false });
const FundUsageChart = dynamic(() => import("@/components/dashboard/FundUsageChart"), { ssr: false });
const RecentDonorsTable = dynamic(() => import("@/components/dashboard/RecentDonorsTable"), { ssr: false });

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
          Ringkasan Beranda
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Pantau pergerakan dana dan donasi secara real-time.
        </p>
      </div>

      {/* Row 1: Kartu Ringkasan */}
      <SummaryCards />

      {/* Row 2: Grafik Keuangan Area */}
      <div className="grid grid-cols-1 gap-8">
        <FinanceChart />
      </div>

      {/* Row 3: Dua Grafik Donut Berdampingan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <FundSourceChart />
        <FundUsageChart />
      </div>

      {/* Row 5: Tabel Donatur Terbaru */}
      <div className="mt-8">
        <RecentDonorsTable />
      </div>
    </motion.div>
  );
}
