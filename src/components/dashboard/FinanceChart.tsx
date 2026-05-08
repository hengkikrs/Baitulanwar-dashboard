"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { TrendingUp, TrendingDown } from "lucide-react";

const historicalData = [
  { name: "Okt", pemasukan: 15, pengeluaran: 5 },
  { name: "Nov", pemasukan: 20, pengeluaran: 8 },
  { name: "Des", pemasukan: 45, pengeluaran: 12 },
  { name: "Jan", pemasukan: 30, pengeluaran: 10 },
  { name: "Feb", pemasukan: 55, pengeluaran: 15 },
  { name: "Mar", pemasukan: 0, pengeluaran: 0 },
];

export default function FinanceChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>(historicalData);
  const [stats, setStats] = useState({ totalIn: 0, totalOut: 0 });

  const fetchChartData = async () => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("date, amount, type");

    if (error) {
      console.error("Error fetching chart data:", error);
      return;
    }

    if (transactions) {
      let currentData = JSON.parse(JSON.stringify(historicalData));
      let totalIn = 0;
      let totalOut = 0;

      transactions.forEach((trx: any) => {
        let month = "";
        try {
          const dateObj = new Date(trx.date);
          month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
            dateObj,
          );
        } catch (e) {
          const parts = trx.date.split(" ");
          if (parts.length >= 2) month = parts[1];
        }

        if (month) {
          const nominal =
            (parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0) / 1000000;

          if (trx.type === "Pemasukan") totalIn += nominal;
          if (trx.type === "Pengeluaran") totalOut += nominal;

          const monthIndex = currentData.findIndex(
            (d: any) => d.name === month,
          );

          if (monthIndex !== -1) {
            if (trx.type === "Pemasukan")
              currentData[monthIndex].pemasukan += nominal;
            if (trx.type === "Pengeluaran")
              currentData[monthIndex].pengeluaran += nominal;
          } else {
            currentData.push({
              name: month,
              pemasukan: trx.type === "Pemasukan" ? nominal : 0,
              pengeluaran: trx.type === "Pengeluaran" ? nominal : 0,
            });
          }
        }
      });
      setChartData(currentData);
      setStats({ totalIn, totalOut });
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchChartData();
  }, []);

  const textColor = mounted && theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = mounted && theme === "dark" ? "#1e293b" : "#f1f5f9";
  const tooltipBg = mounted && theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = mounted && theme === "dark" ? "#1e293b" : "#f1f5f9";

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-500 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
            Perbandingan Kas
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Garis pemasukan vs pengeluaran (Juta Rp)
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Pemasukan</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">{stats.totalIn.toFixed(1)}M</h4>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mr-3">
              <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Pengeluaran</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">{stats.totalOut.toFixed(1)}M</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: "16px",
                border: `1px solid ${tooltipBorder}`,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "12px",
              }}
              itemStyle={{ fontWeight: 600, fontSize: "12px" }}
              labelStyle={{ fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: textColor }}
              formatter={(value: any) =>
                typeof value === "number" ? `Rp ${value.toFixed(2)} Juta` : value
              }
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="pemasukan"
              name="Pemasukan"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="pengeluaran"
              name="Pengeluaran"
              stroke="#f43f5e"
              strokeWidth={4}
              dot={{ r: 6, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
