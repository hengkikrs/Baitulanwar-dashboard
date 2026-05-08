"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function TopDonorsList() {
  const [donors, setDonors] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const fetchTopDonors = async () => {
    const { data, error } = await supabase
      .from("donors")
      .select("name, totalDonation")
      .order("totalDonation", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching top donors:", error);
      return;
    }

    if (data) {
      setDonors(data);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTopDonors();
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 h-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Peringkat Donatur
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Donatur dengan kontribusi terbesar
          </p>
        </div>
        <Award className="w-8 h-8 text-amber-500" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {donors.map((donor, index) => {
          const amount = parseInt(donor.totalDonation.replace(/[^0-9]/g, ""), 10) || 0;
          const maxAmount = donors[0] ? parseInt(donors[0].totalDonation.replace(/[^0-9]/g, ""), 10) : 1;
          const percentage = Math.min((amount / maxAmount) * 100, 100);

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 font-bold text-xs ${
                    index === 0 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                    index === 1 ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                    "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    #{index + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-500 transition-colors">
                    {donor.name}
                  </span>
                </div>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {donor.totalDonation}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    index === 0 ? "bg-amber-500" :
                    index === 1 ? "bg-slate-400" :
                    "bg-blue-500"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
        
        {donors.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
            <User className="w-12 h-12 mb-2 opacity-20" />
            <p>Belum ada data donatur</p>
          </div>
        )}
      </div>
    </div>
  );
}
