'use client';
import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const description1 = 'Data Pemilik Toko';
const description2 = 'Data Toko';
const description3 = 'Verifikasi Akun';

const RegistrasiPage = () => {
    return (
      <div className="flex flex-col min-h-screen bg-white px-4 py-8 relative">
        {/* Header dengan gambar */}
        <header className="absolute top-2 left-4 flex items-center">
            <img 
            src="/images/logoEzpay.png"
            alt="Logo"
            width={80}
            height={80}
            className="mt-5 ml-5"
            />
        </header>
        
        {/* Konten Utama */}
        <main className="flex-1 flex flex-col items-center mt-18">
            <h1 className="text-xl font-semibold -mt-15">Daftarkan Tokomu Sekarang</h1>

            {/* Komponen Steps */}
            <div className="w-full max-w-md mt-5">
                <Steps current={0} direction="horizontal" type="default" progressDot>
                    <Step title="Step 1" description={description1} />
                    <Step title="Step 2" description={description2} />
                    <Step title="Step 3" description={description3} />
                </Steps>
            </div>
        </main>
        
        {/* Footer copyright */}
        <footer className="text-black text-sm text-center py-1 mt-auto">
            © 2024 Ezpay. All rights reserved.
        </footer>
      </div>
    );
};

export default RegistrasiPage;
