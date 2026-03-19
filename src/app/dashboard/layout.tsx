// src/app/dashboard/layout.tsx
"use client";

import React, { useState } from "react";
// Pastikan path import komponennya benar
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Penambahan dark:bg-slate-950 untuk background utama mode gelap
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Overlay Background untuk Mobile saat Sidebar Terbuka */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component: Teruskan state dan fungsi */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header Component: Teruskan fungsi toggle */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Area konten utama: Padding disesuaikan untuk mobile (p-4) dan desktop (md:p-8) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 p-4 md:p-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
