"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecentDonorsTable() {
  const [mounted, setMounted] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);

  const fetchRecentDonors = async () => {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("lastDate", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent donors:", error);
      return;
    }

    if (data) {
      setDonors(data);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRecentDonors();
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300 overflow-hidden">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
          Donatur Terbaru
        </h3>
      </div>

      <div className="overflow-x-auto">
        {/* Hapus min-w untuk responsivitas penuh di mobile */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 md:pb-4 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Donatur
              </th>
              <th className="hidden md:table-cell pb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Kategori
              </th>
              <th className="hidden md:table-cell pb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Tanggal
              </th>
              <th className="pb-3 md:pb-4 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor, index) => (
              <tr
                key={index}
                className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <td className="py-3 md:py-4">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {donor.name}
                  </p>
                  {/* Di Mobile, Kategori dan Tanggal pindah ke bawah nama */}
                  <p className="text-[11px] text-slate-500 md:hidden mt-0.5">
                    {donor.category} • {formatDateDisplay(donor.lastDate)}
                  </p>
                </td>
                <td className="hidden md:table-cell py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {donor.category}
                  </span>
                </td>
                <td className="hidden md:table-cell py-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatDateDisplay(donor.lastDate)}
                </td>
                <td className="py-3 md:py-4 text-sm font-bold text-slate-800 dark:text-white text-right">
                  {donor.totalDonation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donors.length === 0 && (
          <div className="text-center text-sm text-slate-400 mt-6">
            Belum ada donatur yang tercatat.
          </div>
        )}
      </div>
    </div>
  );
}
