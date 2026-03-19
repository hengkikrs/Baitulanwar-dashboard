"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";

const COLORS: Record<string, string> = {
  Infaq: "#2563eb",
  Sedekah: "#3b82f6",
  Wakaf: "#60a5fa",
  Zakat: "#93c5fd",
  CSR: "#1d4ed8",
  Lainnya: "#94a3b8",
};

export default function FundSourceChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTransactions = localStorage.getItem("masjid_transactions");
      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);
        const catData: Record<string, number> = {};

        transactions.forEach((trx: any) => {
          if (trx.type === "Pemasukan") {
            const nominal =
              parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0;
            const cat = trx.category || "Lainnya";
            if (!catData[cat]) catData[cat] = 0;
            catData[cat] += nominal;
          }
        });

        const formattedData = Object.keys(catData)
          .map((key) => ({
            name: key,
            value: catData[key],
            color: COLORS[key] || COLORS["Lainnya"],
          }))
          .filter((item) => item.value > 0);

        setChartData(
          formattedData.length > 0
            ? formattedData
            : [{ name: "Belum Ada", value: 1, color: "#cbd5e1" }],
        );
      }
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-100 flex flex-col transition-colors duration-300 overflow-hidden">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 transition-colors">
        Sumber Dana (Pemasukan)
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              labelLine={false}
              label={({
                cx = 0,
                cy = 0,
                midAngle = 0,
                innerRadius = 0,
                outerRadius = 0,
                value = 0,
                name,
              }) => {
                if (name === "Belum Ada") return null;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                const percentage = (
                  (value /
                    chartData.reduce((sum, item) => sum + item.value, 0)) *
                  100
                ).toFixed(0);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight="bold"
                  >
                    {percentage}%
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor:
                  mounted && theme === "dark" ? "#0f172a" : "#fff",
                borderRadius: "12px",
                border: "none",
                color: mounted && theme === "dark" ? "#fff" : "#000",
              }}
              // FIX: Ubah parameter menjadi any agar terhindar dari tipe 'undefined' yang konflik dengan number
              formatter={(value: any) => {
                const numValue =
                  typeof value === "number" ? value : Number(value) || 0;
                return `Rp ${numValue.toLocaleString("id-ID")}`;
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
                color: mounted && theme === "dark" ? "#f8fafc" : "#0f172a",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
