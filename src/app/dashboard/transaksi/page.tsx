"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Edit,
  Trash2,
  X,
  Save,
  Target,
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 10; // Jumlah data per halaman

export default function TransaksiPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTrx, setFilteredTrx] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Paginasi State
  const [currentPage, setCurrentPage] = useState(1);

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    category: "Operasional",
    description: "",
    amount: "",
    date: "",
  });
  const [targetFormData, setTargetFormData] = useState({
    description: "Alokasi Pembangunan",
    amount: "",
    date: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
      const savedTransactions = localStorage.getItem("masjid_transactions");
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
        setFilteredTrx(parsed);
      }
    }
  }, []);

  useEffect(() => {
    let result = transactions;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(s) ||
          t.id.toLowerCase().includes(s),
      );
    }
    if (filters.type) result = result.filter((t) => t.type === filters.type);
    if (filters.category)
      result = result.filter((t) => t.category === filters.category);
    if (filters.startDate)
      result = result.filter(
        (t) => new Date(t.date) >= new Date(filters.startDate),
      );
    if (filters.endDate)
      result = result.filter(
        (t) => new Date(t.date) <= new Date(filters.endDate),
      );
    if (filters.minAmount) {
      const min = parseInt(filters.minAmount.replace(/[^0-9]/g, ""), 10) || 0;
      result = result.filter(
        (t) => (parseInt(t.amount.replace(/[^0-9]/g, ""), 10) || 0) >= min,
      );
    }
    if (filters.maxAmount) {
      const max = parseInt(filters.maxAmount.replace(/[^0-9]/g, ""), 10) || 0;
      result = result.filter(
        (t) => (parseInt(t.amount.replace(/[^0-9]/g, ""), 10) || 0) <= max,
      );
    }
    setFilteredTrx(result);
    setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
  }, [filters, transactions]);

  // Kalkulasi Paginasi
  const totalPages = Math.ceil(filteredTrx.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTrx = filteredTrx.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const formatRupiah = (angka: string) => {
    const numberString = angka.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) rupiah += (sisa ? "." : "") + ribuan.join(".");
    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "-";
    if (dateStr.includes(" ")) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "minAmount" || name === "maxAmount")
      setFilters({ ...filters, [name]: formatRupiah(value) });
    else setFilters({ ...filters, [name]: value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isTarget = false,
  ) => {
    const { name, value } = e.target;
    if (isTarget) {
      if (name === "amount")
        setTargetFormData({ ...targetFormData, [name]: formatRupiah(value) });
      else setTargetFormData({ ...targetFormData, [name]: value });
    } else {
      if (name === "amount")
        setFormData({ ...formData, [name]: formatRupiah(value) });
      else setFormData({ ...formData, [name]: value });
    }
  };

  const resetFilters = () =>
    setFilters({
      search: "",
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  const openAddModal = () => {
    setEditId(null);
    setFormData({
      category: "Operasional",
      description: "",
      amount: "",
      date: getTodayDate(),
    });
    setIsModalOpen(true);
  };
  const openTargetModal = () => {
    setTargetFormData({
      description: "Alokasi Pembangunan",
      amount: "",
      date: getTodayDate(),
    });
    setIsTargetModalOpen(true);
  };

  const openEditModal = (trx: any) => {
    setEditId(trx.id);
    setFormData({
      category: trx.category,
      description: trx.description,
      date: trx.date,
      amount: trx.amount.replace(/[^0-9]/g, ""),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus transaksi ini?")) {
      const updatedTrx = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTrx);
      localStorage.setItem("masjid_transactions", JSON.stringify(updatedTrx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputDate = formData.date || getTodayDate();
    if (editId) {
      const updatedTrx = transactions.map((t) =>
        t.id === editId
          ? {
              ...t,
              category: formData.category,
              description: formData.description,
              date: inputDate,
              amount: `Rp ${formData.amount}`,
            }
          : t,
      );
      setTransactions(updatedTrx);
      localStorage.setItem("masjid_transactions", JSON.stringify(updatedTrx));
    } else {
      const newTransaction = {
        id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
        date: inputDate,
        type: "Pengeluaran",
        category: formData.category,
        description: formData.description,
        amount: `Rp ${formData.amount}`,
        status: "Selesai",
      };
      const updatedTrx = [newTransaction, ...transactions];
      setTransactions(updatedTrx);
      localStorage.setItem("masjid_transactions", JSON.stringify(updatedTrx));
    }
    setIsModalOpen(false);
  };

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputDate = targetFormData.date || getTodayDate();
    const newTransaction = {
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      date: inputDate,
      type: "Alokasi",
      category: "Pembangunan",
      description: targetFormData.description,
      amount: `Rp ${targetFormData.amount}`,
      status: "Selesai",
    };
    const updatedTrx = [newTransaction, ...transactions];
    setTransactions(updatedTrx);
    localStorage.setItem("masjid_transactions", JSON.stringify(updatedTrx));
    setIsTargetModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Tanggal",
      "Keterangan",
      "Tipe",
      "Kategori",
      "Nominal",
      "Status",
    ];
    const rows = filteredTrx.map((t) => [
      t.id,
      t.date,
      t.description,
      t.type,
      t.category,
      `"${t.amount}"`,
      t.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Laporan_Transaksi_${getTodayDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const exportToPDF = () => {
    setIsExportOpen(false);
    setTimeout(() => window.print(), 300);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-6 relative"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-8 print:hidden">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            Riwayat Transaksi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau seluruh kas masuk, keluar, dan alokasi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto relative">
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 z-20 overflow-hidden"
                >
                  <button
                    onClick={exportToCSV}
                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />{" "}
                    Excel (CSV)
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2 text-rose-600" /> Cetak
                    PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {role === "admin" && (
            <>
              <button
                onClick={openTargetModal}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm flex-1 sm:flex-none transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Alokasi Target</span>
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm text-sm flex-1 sm:flex-none transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Pengeluaran</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              name="search"
              placeholder="Cari keterangan..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-colors"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border transition-colors w-full sm:w-auto text-sm font-medium ${isFilterOpen ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter Lanjutan</span>
          </button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Tipe
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="">Semua Tipe</option>
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                    <option value="Alokasi">Alokasi Target</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="">Semua</option>
                    <optgroup label="Masuk">
                      <option value="Infaq">Infaq</option>
                      <option value="Zakat">Zakat</option>
                      <option value="Wakaf">Wakaf</option>
                    </optgroup>
                    <optgroup label="Keluar">
                      <option value="Operasional">Operasional</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Pembangunan">Pembangunan</option>
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Min (Rp)
                  </label>
                  <input
                    type="text"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Max (Rp)
                  </label>
                  <input
                    type="text"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="md:col-span-6 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">Buku Kas Masjid</h1>
        <p className="text-center text-sm mt-1">
          Laporan dicetak pada: {formatDateDisplay(getTodayDate())}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Transaksi
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Keterangan
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">
                  Tipe
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                  Nominal
                </th>
                {role === "admin" && (
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 text-center print:hidden">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedTrx.map((trx, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 group transition-colors"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-white md:hidden">
                      {trx.description}
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white hidden md:block">
                      {trx.id}
                    </p>

                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="md:hidden">{trx.id} • </span>
                      {formatDateDisplay(trx.date)}
                    </p>

                    <div className="md:hidden mt-2 flex gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${trx.type === "Alokasi" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                      >
                        {trx.category}
                      </span>
                      {trx.type === "Pemasukan" ? (
                        <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                          Masuk
                        </span>
                      ) : trx.type === "Alokasi" ? (
                        <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                          Alokasi
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">
                          Keluar
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="hidden md:table-cell px-6 py-4">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {trx.description}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded border ${trx.type === "Alokasi" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                    >
                      {trx.category}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-center">
                    {trx.type === "Pemasukan" ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <ArrowDownLeft className="w-3 h-3 mr-1" />
                        Masuk
                      </span>
                    ) : trx.type === "Alokasi" ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <ArrowRightLeft className="w-3 h-3 mr-1" />
                        Alokasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        Keluar
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-4 md:px-6 py-3 md:py-4 text-sm font-bold text-right ${trx.type === "Pemasukan" ? "text-emerald-600 dark:text-emerald-400" : trx.type === "Alokasi" ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {trx.type === "Pemasukan" ? "+" : "-"} {trx.amount}
                  </td>
                  {role === "admin" && (
                    <td className="px-4 md:px-6 py-3 md:py-4 text-center align-top md:align-middle print:hidden">
                      {trx.type === "Pemasukan" ? (
                        <div className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 italic">
                          Via Donatur
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                          {trx.type !== "Alokasi" && (
                            <button
                              onClick={() => openEditModal(trx)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(trx.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrx.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Tidak ada data.
            </div>
          )}
        </div>

        {/* --- KONTROL PAGINASI --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-slate-100 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-900/50 print:hidden">
            <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Menampilkan{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {filteredTrx.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              hingga{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredTrx.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {filteredTrx.length}
              </span>{" "}
              data
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 px-2">
                Hal {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                  {editId ? "Edit Pengeluaran" : "Catat Pengeluaran"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    >
                      <option value="Operasional">Operasional</option>
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Honor">Honor</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nominal (Rp)
                  </label>
                  <input
                    type="text"
                    name="amount"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Keterangan Singkat
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="pt-3 md:pt-4 flex justify-end space-x-2 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTargetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsTargetModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-300">
                    Alokasi Pembangunan
                  </h3>
                  <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                    Pindahkan dana Kas ke Target Pembangunan.
                  </p>
                </div>
                <button
                  onClick={() => setIsTargetModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleTargetSubmit}
                className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto"
              >
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={targetFormData.date}
                    onChange={(e) =>
                      setTargetFormData({
                        ...targetFormData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nominal (Rp)
                  </label>
                  <input
                    type="text"
                    name="amount"
                    required
                    value={targetFormData.amount}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Keterangan Singkat
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    value={targetFormData.description}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="pt-3 md:pt-4 flex justify-end space-x-2 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTargetModalOpen(false)}
                    className="px-4 py-2 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    <span>Alokasikan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
