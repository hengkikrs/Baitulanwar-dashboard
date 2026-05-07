"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useTheme } from "next-themes";

// Data riwayat historis
const historicalBarData = [
  { name: "Okt '25", value: 71.5 },
  { name: "Nov '25", value: 118.3 },
  { name: "Des '25", value: 215.5 },
  { name: "Jan '26", value: 104.5 },
  { name: "Feb '26", value: 175.6 },
  { name: "Mar '26", value: 0 }, // Akan diisi dinamis
];

export default function MonthlyTrendChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>(historicalBarData);

  const fetchTrendData = async () => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("date, amount, type");

    if (error) {
      console.error("Error fetching trend data:", error);
      return;
    }

    if (transactions) {
      let currentData = JSON.parse(JSON.stringify(historicalBarData));

      transactions.forEach((trx: any) => {
        if (trx.type === "Pemasukan") {
          let monthYear = "";
          try {
            const dateObj = new Date(trx.date);
            const month = new Intl.DateTimeFormat("id-ID", {
              month: "short",
            }).format(dateObj);
            const year = dateObj.getFullYear().toString().substring(2);
            monthYear = `${month} '${year}`;
          } catch (e) {
            const parts = trx.date.split(" ");
            if (parts.length === 3)
              monthYear = `${parts[1]} '${parts[2].substring(2)}`;
          }

          if (monthYear) {
            const nominal =
              (parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0) / 1000000;

            const monthIndex = currentData.findIndex(
              (d: any) => d.name === monthYear,
            );

            if (monthIndex !== -1) {
              currentData[monthIndex].value += nominal;
            } else {
              currentData.push({ name: monthYear, value: nominal });
            }
          }
        }
      });
      setChartData(currentData);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTrendData();
  }, []);

  const textColor = mounted && theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = mounted && theme === "dark" ? "#1e293b" : "#f1f5f9";
  const barColor = "#3b82f6";
  const labelColor = mounted && theme === "dark" ? "#ffffff" : "#0f172a";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-100 flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors">
        Tren Pemasukan Bulanan (Juta Rp)
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
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
              tick={{ fill: textColor, fontSize: 10 }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  mounted && theme === "dark" ? "#0f172a" : "#fff",
                borderRadius: "12px",
                border: "none",
                color: mounted && theme === "dark" ? "#fff" : "#000",
              }}
              // FIX: Ubah parameter menjadi any dan tambahkan pengecekan tipe
              formatter={(value: any) =>
                typeof value === "number" ? value.toFixed(2) : value
              }
            />
            <Bar dataKey="value" fill={barColor} radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                fill={labelColor}
                fontSize={10}
                formatter={(value: any) =>
                  typeof value === "number" ? value.toFixed(1) : value
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
