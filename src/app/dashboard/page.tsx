"use client";

import React from "react";
import { motion } from "framer-motion";

// Pastikan semua komponen ini sudah ada di folder src/components/dashboard/
import SummaryCards from "@/components/dashboard/SummaryCards";
import FinanceChart from "@/components/dashboard/FinanceChart";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import FundSourceChart from "@/components/dashboard/FundSourceChart";
import FundUsageChart from "@/components/dashboard/FundUsageChart";
import RecentDonorsTable from "@/components/dashboard/RecentDonorsTable";

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

      {/* Row 1: Kartu Ringkasan (Pemasukan, Pengeluaran, Saldo, Target) */}
      <SummaryCards />

      {/* Row 2: Grafik Keuangan Area (Garis melengkung) */}
      <div className="grid grid-cols-1 gap-8">
        <FinanceChart />
      </div>

      {/* Row 3: Tren Pemasukan Bar (Grafik Batang) */}
      <div className="grid grid-cols-1 gap-8 mt-8">
        <MonthlyTrendChart />
      </div>

      {/* Row 4: Dua Grafik Donut Berdampingan (Pemasukan Kiri, Pengeluaran Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <FundSourceChart />
        <FundUsageChart />
      </div>

      {/* Row 5: Tabel 5 Donatur Terbaru */}
      <div className="mt-8">
        <RecentDonorsTable />
      </div>
    </motion.div>
  );
}
