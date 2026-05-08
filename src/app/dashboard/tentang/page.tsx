"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { MapPin, Phone, Mail, CreditCard, Map, Loader2 } from "lucide-react";

const defaultProfile = {
  name: "Musholla Baitul Anwar",
  address: "Jl. Sudirman No. 123, Jakarta Selatan",
  phone: "(021) 1234567",
  email: "admin@baitulmaal.com",
  bankAccounts:
    "Bank Syariah Indonesia (BSI)\nNo. Rek: 1234567890\na.n Masjid Baitul Maal\n\nBank Mandiri\nNo. Rek: 0987654321\na.n Masjid Baitul Maal",
  mapsUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666427009772!2d106.8295180153697!3d-6.175392395529188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1689258282000!5m2!1sen!2sid",
};

export default function TentangPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setProfile({
        name: data.nama || defaultProfile.name,
        address: data.alamat || defaultProfile.address,
        phone: data.telepon || defaultProfile.phone,
        email: data.email || defaultProfile.email,
        bankAccounts: defaultProfile.bankAccounts,
        mapsUrl: defaultProfile.mapsUrl,
      });
    } else if (error && error.code !== "PGRST116") {
      console.log("Error fetching profile:", error);
    }
    setIsLoading(false);
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto space-y-6 relative"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
          Tentang Kami
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Informasi kontak, lokasi, dan rekening resmi donasi masjid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Kontak & Rekening */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />{" "}
              Profil Masjid
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  NAMA MASJID
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                  {profile.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  ALAMAT LENGKAP
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {profile.address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />{" "}
              Hubungi Kami
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-800 dark:text-slate-200">
                <Phone className="w-4 h-4 mr-3 text-slate-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center text-sm text-slate-800 dark:text-slate-200">
                <Mail className="w-4 h-4 mr-3 text-slate-400" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 dark:bg-blue-800 rounded-2xl p-6 shadow-md text-white transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center text-blue-50">
              <CreditCard className="w-5 h-5 mr-2 text-blue-200" /> Rekening
              Donasi
            </h3>
            <div className="text-sm text-blue-50 whitespace-pre-wrap leading-relaxed">
              {profile.bankAccounts}
            </div>
            <p className="mt-4 text-xs text-blue-200 bg-blue-700/50 dark:bg-blue-900/50 p-3 rounded-xl border border-blue-500/50">
              Mohon berhati-hati terhadap penipuan. Kami hanya menerima donasi
              melalui rekening resmi di atas.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Peta Maps */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
            <Map className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-400" />{" "}
            Peta Lokasi
          </h3>
          <div className="flex-1 min-h-75 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            {profile.mapsUrl ? (
              <iframe
                src={profile.mapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Peta belum disetel oleh Administrator
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
