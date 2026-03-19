import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import ThemeProvider yang baru kita buat
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musholla Baitul Anwar - Dashboard",
  description: "Sistem Manajemen Keuangan Musholla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // SuppressHydrationWarning wajib ditambahkan agar next-themes tidak bentrok
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
