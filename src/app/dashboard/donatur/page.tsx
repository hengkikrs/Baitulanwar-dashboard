"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Mail,
  Phone,
  X,
  Save,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const defaultDonors = [
  {
    id: 1,
    name: "Bapak Budi Santoso",
    email: "budi.s@email.com",
    phone: "0812-3456-7890",
    category: "Wakaf",
    totalDonation: "Rp 25.000.000",
    lastDate: "2026-03-18",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Ibu Siti Aminah",
    email: "siti.aminah@email.com",
    phone: "0813-4567-8901",
    category: "Zakat",
    totalDonation: "Rp 12.500.000",
    lastDate: "2026-03-15",
    status: "Aktif",
  },
];

const ITEMS_PER_PAGE = 10; // Jumlah data per halaman

export default function DonaturPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editId, setEditId] = useState<number | string | null>(null);

  // Paginasi State
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Infaq",
    amount: "",
    status: "Aktif",
    date: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const STORAGE_KEY = "donors_data";

  const getLocalDonors = (): any[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const setLocalDonors = (data: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const fetchDonors = async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .order("lastDate", { ascending: false });

      if (error) {
        console.log("Supabase error, using localStorage:", error.message);
        const local = getLocalDonors();
        if (local.length > 0) {
          setDonors(local);
          setFilteredDonors(local);
        } else {
          setDonors(defaultDonors);
          setFilteredDonors(defaultDonors);
        }
      } else if (data && data.length > 0) {
        setDonors(data);
        setFilteredDonors(data);
        setLocalDonors(data);
      } else {
        const local = getLocalDonors();
        if (local.length > 0) {
          setDonors(local);
          setFilteredDonors(local);
        } else {
          setDonors(defaultDonors);
          setFilteredDonors(defaultDonors);
        }
      }
    } catch (err) {
      console.error("fetchDonors error:", err);
      const local = getLocalDonors();
      if (local.length > 0) {
        setDonors(local);
        setFilteredDonors(local);
      } else {
        setDonors(defaultDonors);
        setFilteredDonors(defaultDonors);
      }
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
      fetchDonors();
    }
  }, []);

  useEffect(() => {
    let result = donors;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.email.toLowerCase().includes(s) ||
          d.phone.includes(s),
      );
    }
    if (filters.category)
      result = result.filter((d) => d.category === filters.category);
    if (filters.startDate)
      result = result.filter(
        (d) => new Date(d.lastDate) >= new Date(filters.startDate),
      );
    if (filters.endDate)
      result = result.filter(
        (d) => new Date(d.lastDate) <= new Date(filters.endDate),
      );
    if (filters.minAmount) {
      const min = parseInt(filters.minAmount.replace(/[^0-9]/g, ""), 10) || 0;
      result = result.filter(
        (d) =>
          (parseInt(d.totalDonation.replace(/[^0-9]/g, ""), 10) || 0) >= min,
      );
    }
    if (filters.maxAmount) {
      const max = parseInt(filters.maxAmount.replace(/[^0-9]/g, ""), 10) || 0;
      result = result.filter(
        (d) =>
          (parseInt(d.totalDonation.replace(/[^0-9]/g, ""), 10) || 0) <= max,
      );
    }
    setFilteredDonors(result);
    setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
  }, [filters, donors]);

  // Kalkulasi Paginasi
  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDonors = filteredDonors.slice(
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
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

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
  ) => {
    const { name, value } = e.target;
    if (name === "amount")
      setFormData({ ...formData, [name]: formatRupiah(value) });
    else setFormData({ ...formData, [name]: value });
  };

  const resetFilters = () =>
    setFilters({
      search: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "Infaq",
      amount: "",
      status: "Aktif",
      date: getTodayDate(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (donor: any) => {
    setEditId(donor.id);
    setFormData({
      name: donor.name === "Hamba Allah" ? "" : donor.name,
      email: donor.email === "-" ? "" : donor.email,
      phone: donor.phone === "-" ? "" : donor.phone,
      category: donor.category,
      status: donor.status || "Aktif",
      date: donor.lastDate,
      amount: donor.totalDonation.replace(/[^0-9]/g, ""),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Yakin ingin menghapus data donatur ini?")) {
      try {
        const { error } = await supabase.from("donors").delete().eq("id", id);
        
        if (error) {
          console.log("Delete from Supabase failed, using localStorage");
          const localData = getLocalDonors().filter((d: any) => d.id !== id);
          setLocalDonors(localData);
          setDonors(localData);
          setFilteredDonors(localData);
        } else {
          fetchDonors();
        }
      } catch (err) {
        console.error("Delete error:", err);
        const localData = getLocalDonors().filter((d: any) => d.id !== id);
        setLocalDonors(localData);
        setDonors(localData);
        setFilteredDonors(localData);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputDate = formData.date || getTodayDate();
    const finalName =
      formData.name.trim() !== "" ? formData.name : "Hamba Allah";
    const finalEmail = formData.email.trim() !== "" ? formData.email : "-";
    const finalPhone = formData.phone.trim() !== "" ? formData.phone : "-";

    const newDonor = {
      id: editId || Date.now(),
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      category: formData.category,
      totalDonation: `Rp ${formData.amount}`,
      lastDate: inputDate,
      status: formData.status,
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from("donors")
          .update({
            name: finalName,
            email: finalEmail,
            phone: finalPhone,
            category: formData.category,
            totalDonation: `Rp ${formData.amount}`,
            status: formData.status,
            lastDate: inputDate,
          })
          .eq("id", editId);

        if (error) {
          console.log("Update failed, saving to localStorage:", error.message);
          const localData = getLocalDonors();
          const updatedData = localData.map((d: any) => d.id === editId ? { ...d, ...newDonor } : d);
          setLocalDonors(updatedData);
          setDonors(updatedData);
          setFilteredDonors(updatedData);
          alert("Data berhasil diperbarui!");
        } else {
          alert("Data berhasil diperbarui!");
          fetchDonors();
        }
      } else {
        const { error: donorError } = await supabase.from("donors").insert([
          {
            name: finalName,
            email: finalEmail,
            phone: finalPhone,
            category: formData.category,
            totalDonation: `Rp ${formData.amount}`,
            lastDate: inputDate,
            status: formData.status,
          },
        ]);

        if (donorError) {
          console.log("Insert failed, saving to localStorage:", donorError.message);
          const localData = getLocalDonors();
          const updatedData = [newDonor, ...localData];
          setLocalDonors(updatedData);
          setDonors(updatedData);
          setFilteredDonors(updatedData);
          alert("Data berhasil disimpan!");
        } else {
          const newTrxId = `TRX-${Math.floor(Math.random() * 9000) + 1000}`;
          await supabase.from("transactions").insert([
            {
              id: newTrxId,
              date: inputDate,
              type: "Pemasukan",
              category: formData.category,
              description: `Donasi dari ${finalName}`,
              amount: `Rp ${formData.amount}`,
              status: "Selesai",
            },
          ]);
          alert("Data donatur berhasil disimpan!");
          fetchDonors();
        }
      }
    } catch (err) {
      console.error("Submit error, saving to localStorage:", err);
      const localData = getLocalDonors();
      const updatedData = editId 
        ? localData.map((d: any) => d.id === editId ? { ...d, ...newDonor } : d)
        : [newDonor, ...localData];
      setLocalDonors(updatedData);
      setDonors(updatedData);
      setFilteredDonors(updatedData);
      alert("Data berhasil disimpan!");
    }
    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    // Export mengekspor SEMUA data yang difilter, bukan hanya halaman saat ini
    const headers = [
      "ID",
      "Nama Donatur",
      "Email",
      "Telepon",
      "Kategori",
      "Total Donasi",
      "Tanggal",
      "Status",
    ];
    const rows = filteredDonors.map((d) => [
      d.id,
      d.name,
      d.email,
      d.phone,
      d.category,
      `"${d.totalDonation}"`,
      d.lastDate,
      d.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Laporan_Donatur_${getTodayDate()}.csv`);
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
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white transition-colors">
            Daftar Donatur
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
            Kelola data donatur masjid.
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
            <button
              onClick={openAddModal}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm flex-1 sm:flex-none transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
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
              placeholder="Cari donatur..."
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
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Semua</option>
                    <option value="Infaq">Infaq</option>
                    <option value="Zakat">Zakat</option>
                    <option value="Sedekah">Sedekah</option>
                    <option value="Wakaf">Wakaf</option>
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
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
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
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Min. Nominal (Rp)
                  </label>
                  <input
                    type="text"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Max. Nominal (Rp)
                  </label>
                  <input
                    type="text"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-5 flex justify-end">
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
        <h1 className="text-2xl font-bold text-center">
          Laporan Donatur Masjid
        </h1>
        <p className="text-center text-sm mt-1">
          Dicetak pada: {formatDateDisplay(getTodayDate())}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors flex flex-col min-h-[300px]">
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-medium">Memuat data donatur...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Donatur
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Kontak
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Kategori
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 text-right md:text-left">
                    Donasi
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Tanggal
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">
                    Status
                  </th>
                  {role === "admin" && (
                    <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 text-center print:hidden">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedDonors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 group transition-colors"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {donor.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        ID: #DNR-{donor.id.toString().substring(0, 4)}
                      </p>
                      <div className="md:hidden mt-2 space-y-1">
                        <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                          <Mail className="w-3 h-3 mr-1" />
                          {donor.email}
                        </div>
                        <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                          <Phone className="w-3 h-3 mr-1" />
                          {donor.phone}
                        </div>
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {donor.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-lg ${donor.status === "Aktif" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                          >
                            {donor.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                    <div className="flex flex-col space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1.5" />
                        {donor.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1.5" />
                        {donor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                      {donor.category}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {donor.totalDonation}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 md:hidden mt-0.5">
                      {formatDateDisplay(donor.lastDate)}
                    </p>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatDateDisplay(donor.lastDate)}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-center">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg ${donor.status === "Aktif" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                    >
                      {donor.status}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td className="px-4 md:px-6 py-3 md:py-4 text-center align-top md:align-middle print:hidden">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <button
                          onClick={() => openEditModal(donor)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(donor.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonors.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Tidak ada data.
            </div>
          )}
          {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-slate-100 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-900/50 print:hidden">
            <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Menampilkan{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {filteredDonors.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              hingga{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredDonors.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {filteredDonors.length}
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                  {editId ? "Edit Donatur" : "Tambah Donatur"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nama Donatur
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Hamba Allah (Opsional)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Opsional"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Telepon
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Opsional"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                      <option value="Infaq">Infaq</option>
                      <option value="Zakat">Zakat</option>
                      <option value="Sedekah">Sedekah</option>
                      <option value="Wakaf">Wakaf</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Pasif">Pasif</option>
                      <option value="Anonim">Anonim</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Jumlah (Rp)
                    </label>
                    <input
                      type="text"
                      name="amount"
                      required
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="500.000"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-2 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1 transition-colors"
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
    </motion.div>
  );
}
