'use client';

import React from "react";
import { Steps } from 'antd';
import { usePathname } from "next/navigation";

const { Step } = Steps;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';

  // Menentukan langkah aktif dan status langkah
  let currentStep = 0;
  const stepStatuses: Array<'wait' | 'process' | 'finish'> = ['wait', 'wait', 'wait'];

  if (pathname.includes('/registrasi/DataPemilikToko')) {
    currentStep = 0; // Langkah pertama aktif
    stepStatuses[0] = 'process'; // Langkah pertama aktif
  } else if (pathname.includes('/registrasi/DataToko')) {
    currentStep = 1; // Langkah kedua aktif
    stepStatuses[0] = 'finish'; // Langkah pertama selesai
    stepStatuses[1] = 'process'; // Langkah kedua aktif
  } else if (pathname.includes('/registrasi/verifikasi')) {
    currentStep = 2; // Langkah ketiga aktif
    stepStatuses[0] = 'finish'; // Langkah pertama selesai
    stepStatuses[1] = 'finish'; // Langkah kedua selesai
    stepStatuses[2] = 'process'; // Langkah ketiga aktif
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-8 relative">
      {/* Konten Utama */}
      <div className="flex-1 flex flex-col items-center mt-18">
        <h1 className="text-xl font-semibold -mt-15">Daftarkan Tokomu di Ezpay</h1>

        {/* Komponen Steps */}
        <div className="w-full max-w-md mt-5">
          <Steps current={currentStep} direction="horizontal" type="default" progressDot>
            <Step title="Data Pemilik Toko" status={stepStatuses[0]} />
            <Step title="Data Toko" status={stepStatuses[1]} />
            <Step title="Verifikasi" status={stepStatuses[2]} />
          </Steps>
        </div>

        {/* Children content (can be form or other components) */}
        <div className="w-full max-w-md mt-10 space-y-6">
          {children}
        </div>
      </div>

      {/* Footer copyright full-width dan selalu nempel di bawah */}
      <footer className="w-full bg-[#cfe2ff] text-black text-sm text-center py-4 absolute bottom-0 left-0">
      © 2024 Ezpay. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
