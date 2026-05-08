"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Lock,
  Globe,
  Bell,
  Save,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function PengaturanPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading, setIsLoading] = useState(false);
  const [profilForm, setProfilForm] = useState({
    nama: "Musholla Baitul Anwar",
    alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
    telepon: "(021) 1234567",
    email: "admin@baitulmaal.com",
  });

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setProfilForm({
        nama: data.nama || "",
        alamat: data.alamat || "",
        telepon: data.telepon || "",
        email: data.email || "",
      });
    } else if (error && error.code !== "PGRST116") {
      console.log("Error fetching profile:", error);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const { data: existing } = await supabase
        .from("profile")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        await supabase
          .from("profile")
          .update({
            nama: profilForm.nama,
            alamat: profilForm.alamat,
            telepon: profilForm.telepon,
            email: profilForm.email,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("profile").insert([profilForm]);
      }
      alert("Profil berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan profil.");
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: "profil", label: "Profil Musholla", icon: Building2 },
    { id: "akun", label: "Akun Admin", icon: User },
    { id: "sistem", label: "Preferensi Sistem", icon: Globe },
    { id: "keamanan", label: "Keamanan", icon: Lock },
    { id: "notifikasi", label: "Notifikasi", icon: Bell },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      {/* Header Halaman */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
          Pengaturan Sistem
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Kelola informasi musholla, preferensi admin, dan keamanan aplikasi.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu Pengaturan */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-2 space-y-1 transition-colors">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 transition-colors ${activeTab === tab.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Area Konten Pengaturan */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            {/* Tab: Profil Musholla */}
            {activeTab === "profil" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                    Profil Musholla
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    Informasi dasar yang akan ditampilkan pada laporan dan
                    kuitansi.
                  </p>
                </div>

                <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Nama Musholla
                    </label>
                    <input
                      type="text"
                      value={profilForm.nama}
                      onChange={(e) => setProfilForm({ ...profilForm, nama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Alamat Lengkap
                    </label>
                    <textarea
                      rows={3}
                      value={profilForm.alamat}
                      onChange={(e) => setProfilForm({ ...profilForm, alamat: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      value={profilForm.telepon}
                      onChange={(e) => setProfilForm({ ...profilForm, telepon: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      value={profilForm.email}
                      onChange={(e) => setProfilForm({ ...profilForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Keamanan */}
            {activeTab === "keamanan" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                    Keamanan Akun
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    Perbarui kata sandi dan amankan akun Anda.
                  </p>
                </div>

                <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex items-start space-x-4 mb-6 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 transition-colors">
                      Otentikasi Dua Langkah (2FA) Aktif
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-1 transition-colors">
                      Akun Anda dilindungi dengan keamanan ekstra. Kami akan
                      meminta kode verifikasi saat Anda login dari perangkat
                      baru.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder untuk tab lainnya */}
            {["akun", "sistem", "notifikasi"].includes(activeTab) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Globe className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                  Halaman{" "}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm transition-colors">
                  Pengaturan untuk {activeTab} dapat dikembangkan lebih lanjut
                  di sini sesuai kebutuhan sistem.
                </p>
              </motion.div>
            )}

            {/* Tombol Simpan Global */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end transition-colors">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm font-medium disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
