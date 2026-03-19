"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

// Data riwayat historis untuk menggambar kurva grafik
const historicalData = [
  { name: "Okt", pemasukan: 15, pengeluaran: 5 },
  { name: "Nov", pemasukan: 20, pengeluaran: 8 },
  { name: "Des", pemasukan: 45, pengeluaran: 12 },
  { name: "Jan", pemasukan: 30, pengeluaran: 10 },
  { name: "Feb", pemasukan: 55, pengeluaran: 15 },
  { name: "Mar", pemasukan: 0, pengeluaran: 0 }, // Nilai Maret akan diisi dari localStorage
];

export default function FinanceChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>(historicalData);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTransactions = localStorage.getItem("masjid_transactions");

      // Copy data historis agar tidak merubah aslinya
      let currentData = JSON.parse(JSON.stringify(historicalData));

      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);

        transactions.forEach((trx: any) => {
          // trx.date formatnya "19 Mar 2026"
          const parts = trx.date.split(" ");
          if (parts.length >= 2) {
            const month = parts[1]; // Ambil teks "Mar"
            const nominal =
              (parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0) / 1000000;

            // Cari index bulan di array data kita
            const monthIndex = currentData.findIndex(
              (d: any) => d.name === month,
            );

            if (monthIndex !== -1) {
              if (trx.type === "Pemasukan")
                currentData[monthIndex].pemasukan += nominal;
              if (trx.type === "Pengeluaran")
                currentData[monthIndex].pengeluaran += nominal;
            } else {
              // Jika ada transaksi di bulan baru (misal April), tambahkan ke ujung kanan grafik
              currentData.push({
                name: month,
                pemasukan: trx.type === "Pemasukan" ? nominal : 0,
                pengeluaran: trx.type === "Pengeluaran" ? nominal : 0,
              });
            }
          }
        });
      }
      setChartData(currentData);
    }
  }, []);

  const textColor = mounted && theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = mounted && theme === "dark" ? "#1e293b" : "#f1f5f9";
  const tooltipBg = mounted && theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = mounted && theme === "dark" ? "#1e293b" : "#f1f5f9";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-96 flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors">
        Statistik Keuangan (Juta Rp)
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: "12px",
                border: `1px solid ${tooltipBorder}`,
                color: textColor,
              }}
              // FIX: Ubah parameter menjadi any dan tambahkan pengecekan tipe
              formatter={(value: any) =>
                typeof value === "number" ? value.toFixed(2) : value
              }
            />
            <Area
              type="monotone"
              dataKey="pemasukan"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPemasukan)"
            />
            <Area
              type="monotone"
              dataKey="pengeluaran"
              stroke="#e11d48"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPengeluaran)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
