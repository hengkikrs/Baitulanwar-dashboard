"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";

export default function DonationRadarChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("amount, category, type");

    if (error) {
      console.error("Error fetching radar data:", error);
      return;
    }

    if (transactions) {
      const counts: Record<string, number> = {
        Infaq: 0,
        Zakat: 0,
        Sedekah: 0,
        Wakaf: 0,
        Sosial: 0,
        Pembangunan: 0,
      };

      transactions.forEach((trx: any) => {
        if (trx.type === "Pemasukan") {
          const nominal = parseInt(trx.amount.replace(/[^0-9]/g, ""), 10) || 0;
          if (counts[trx.category] !== undefined) {
            counts[trx.category] += nominal;
          }
        }
      });

      const formatted = Object.keys(counts).map((key) => ({
        subject: key,
        A: counts[key] / 1000000, // In Million Rp
        fullMark: 150,
      }));

      setData(formatted);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return null;

  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const labelColor = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 h-100 flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        Distribusi Kategori
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Berdasarkan total volume donasi (Juta Rp)
      </p>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: labelColor, fontSize: 12, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Donasi"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
              animationDuration={1500}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
