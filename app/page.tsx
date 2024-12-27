"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleButtonClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#5aa5be] px-4 py-8">
      {/* Header dengan gambar */}
      <header className="flex flex-col items-center mb-4">
        <img 
          src="/images/logoEzpay.png"
          alt="Logo"
          width={120}
          height={120}
          className="mb-4"
        />
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col items-center justify-center mt-[-5rem]">
        {/* Tombol */}
        <div className="flex flex-col gap-5 w-full max-w-xs px-4">
          <button
            type="button"
            className="w-full bg-[#1b7c99] text-white py-3 px-4 rounded-2xl border border-transparent transition-transform transform hover:scale-105 hover:bg-[#389cb0] hover:border-[#389cb0] hover:shadow-lg hover:text-[#e0f7fa] duration-300 text-sm"
            onClick={() => handleButtonClick('/login_admin')}
          >
            Masuk TokoMu
          </button>
          <button
            type="button"
            className="w-full bg-[#1b7c99] text-white py-3 px-4 rounded-2xl border border-transparent transition-transform transform hover:scale-105 hover:bg-[#389cb0] hover:border-[#389cb0] hover:shadow-lg hover:text-[#e0f7fa] duration-300 text-sm"
            onClick={() => handleButtonClick('/registrasi/DataToko')}
          >
            Buka TokoMu Sekarang
          </button>
          <button
            type="button"
            className="w-full bg-[#1b7c99] text-white py-3 px-4 rounded-2xl border border-transparent transition-transform transform hover:scale-105 hover:bg-[#389cb0] hover:border-[#389cb0] hover:shadow-lg hover:text-[#e0f7fa] duration-300 text-sm"
            onClick={() => handleButtonClick('/login_kasir')}
          >
            Masuk Sebagai Kasir
          </button>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-white text-sm text-center py-2 mt-auto">
        © 2024 Ezpay. All rights reserved.
      </footer>
    </div>
  );
}
