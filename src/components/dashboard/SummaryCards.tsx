"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Building } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function SummaryCards() {
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    saldo: 0,
    targetTerkumpul: 0,
  });

  // Target Pembangunan Ditetapkan ke Rp 500 Juta
  const TARGET_PEMBANGUNAN = 500000000;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTransactions = localStorage.getItem("masjid_transactions");
      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);

        let totalMasuk = 0;
        let totalKeluar = 0;
        let totalAlokasi = 0;

        // Proses penjumlahan dinamis sesuai tipe transaksi
        transactions.forEach((trx: any) => {
          const nominal = parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0;

          if (trx.type === "Pemasukan") totalMasuk += nominal;
          if (trx.type === "Pengeluaran") totalKeluar += nominal;
          if (trx.type === "Alokasi") totalAlokasi += nominal;
        });

        setSummary({
          pemasukan: totalMasuk,
          pengeluaran: totalKeluar,
          // Sisa Saldo = Semua Uang Masuk dikurangi Pengeluaran dan Dana yang sudah dialokasikan/dikunci untuk Pembangunan
          saldo: totalMasuk - totalKeluar - totalAlokasi,
          targetTerkumpul: totalAlokasi,
        });
      }
    }
  }, []);

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Menghitung persentase Progress Bar (Maksimal 100%)
  const percentage = Math.min(
    Math.round((summary.targetTerkumpul / TARGET_PEMBANGUNAN) * 100),
    100,
  );

  const summaryData = [
    {
      title: "Total Pemasukan",
      amount: formatRp(summary.pemasukan),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      description: "Dari Semua Donatur",
      isTarget: false,
    },
    {
      title: "Total Pengeluaran",
      amount: formatRp(summary.pengeluaran),
      icon: TrendingDown,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-950/40",
      description: "Seluruh Kas Keluar",
      isTarget: false,
    },
    {
      title: "Sisa Saldo Kas Umum",
      amount: formatRp(summary.saldo),
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950/40",
      description: "Dana Bebas Siap Pakai",
      isTarget: false,
    },
    {
      title: "Target Pembangunan",
      amount: formatRp(TARGET_PEMBANGUNAN),
      icon: Building,
      color: "text-white dark:text-white",
      bg: "bg-blue-600 dark:bg-blue-800",
      description: `Terkumpul ${formatRp(summary.targetTerkumpul)} (${percentage}%)`,
      isTarget: true,
    },
  ];

  if (!mounted) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {summaryData.map((data, index) => (
        <motion.div
          key={index}
          variants={item}
          className={`p-6 rounded-2xl shadow-sm border ${data.isTarget ? "bg-linear-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 flex items-center space-x-4"}`}
        >
          {data.isTarget ? (
            <div className="relative z-10 w-full h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-blue-100 text-sm font-medium">
                  {data.title}
                </p>
                <data.icon className="w-5 h-5 text-blue-200" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{data.amount}</h3>
              <div className="w-full bg-blue-900/50 rounded-full h-2.5 mb-1 mt-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-white h-2.5 rounded-full"
                ></motion.div>
              </div>
              <p className="text-xs text-blue-100 text-right mt-1">
                {data.description}
              </p>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-xl ${data.bg}`}>
                <data.icon className={`w-6 h-6 ${data.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {data.title}
                </p>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mt-1 truncate">
                  {data.amount}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {data.description}
                </p>
              </div>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
