'use client';

import React from 'react';
import Link from 'next/link';

const VerifikasiPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Komponen Steps */}
      <div className="w-full max-w-2xl mt-5">
        {/* Komponen Steps bisa ditambahkan di sini jika perlu */}
      </div>

      <h1 className="text-2xl font-semibold mb-2 mt-4 max-w-2xl text-center">
        PENGAJUAN TOKO MU TELAH DI KIRIM, TUNGGU BEBERAPA SAAT...
      </h1>
      <p className="text-center mb-4 max-w-lg">
        Anda bisa mengecek status toko anda dengan mencoba melakukan login.
      </p>

      <div className="flex space-x-4">
        <Link href="/login_admin">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </Link>
        <Link href="/">
          <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
            Kembali ke Beranda
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VerifikasiPage;
