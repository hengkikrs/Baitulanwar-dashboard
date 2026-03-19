"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Simulasi database akun admin
const ADMIN_ACCOUNTS: Record<string, string> = {
  ketua: "admin1",
  sekretaris: "admin2",
  bendahara: "admin3",
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      // Normalisasi input (huruf kecil semua dan tanpa spasi)
      const inputUser = username.toLowerCase().trim();

      // Cek apakah username ada di "database" dan passwordnya cocok
      if (ADMIN_ACCOUNTS[inputUser] && ADMIN_ACCOUNTS[inputUser] === password) {
        if (typeof window !== "undefined") {
          // Buat huruf pertama menjadi kapital (Contoh: "ketua" -> "Ketua")
          const displayName =
            inputUser.charAt(0).toUpperCase() + inputUser.slice(1);

          localStorage.setItem("userRole", "admin");
          localStorage.setItem("userName", displayName); // Simpan nama admin yang login
          router.push("/dashboard");
        }
      } else {
        setErrorMsg("Username atau password yang Anda masukkan salah.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Pilihan
        </Link>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 transition-colors duration-300"
        >
          <div className="text-center mb-8">
            <Image
              src="/images/logo-masjid.png"
              alt="Logo Masjid"
              width={80}
              height={80}
              className="mx-auto mb-4 drop-shadow-md"
            />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors duration-300">
              Login Administrator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors duration-300">
              Gunakan kredensial yang telah diberikan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-center space-x-2 border border-red-100 dark:border-red-800/50"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative">
                {/* Icon diganti menjadi User */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-slate-800/50 outline-none transition-all sm:text-sm"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-slate-800/50 outline-none transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Kotak Hint Dihapus */}

            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl font-medium shadow-md transition-all duration-200 ${isLoading ? "bg-blue-400 cursor-not-allowed text-blue-50" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk Sistem</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
