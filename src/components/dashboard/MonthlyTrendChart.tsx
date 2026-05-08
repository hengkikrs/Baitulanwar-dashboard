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
  Cell,
} from "recharts";
import { useTheme } from "next-themes";

const historicalBarData = [
  { name: "Okt '25", value: 71.5 },
  { name: "Nov '25", value: 118.3 },
  { name: "Des '25", value: 215.5 },
  { name: "Jan '26", value: 104.5 },
  { name: "Feb '26", value: 175.6 },
  { name: "Mar '26", value: 0 },
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
  
  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 h-100 flex flex-col transition-all duration-300">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">
        Tren Pemasukan
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
        Volume donasi masuk bulanan (Juta Rp)
      </p>
      
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
              tick={{ fill: textColor, fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 10, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                borderRadius: "16px",
                border: theme === "dark" ? "1px solid #1e293b" : "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: any) =>
                typeof value === "number" ? `Rp ${value.toFixed(2)} Juta` : value
              }
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "#3b82f6" : "#60a5fa"} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill={theme === "dark" ? "#fff" : "#0f172a"}
                fontSize={10}
                fontWeight={700}
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
