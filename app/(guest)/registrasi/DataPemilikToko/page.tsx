'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

const DataPemilikToko = () => {
  const router = useRouter();

  return (
    <div>
      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Nama Lengkap</label>
        <Input placeholder="Nama Lengkap" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <Input placeholder="Email" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">No Handphone</label>
        <Input placeholder="No Handphone" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <Input.Password placeholder="Password" size="large" />
      </div>

      {/* Tombol hanya ada di halaman ini */}
      <div className="flex justify-between w-full max-w-md mt-6 mb-16">
        <Button type="default" size="large" onClick={() => router.push('/')}>Kembali</Button>
        <Button type="primary" size="large" onClick={() => router.push('/registrasi/DataToko')}>Selanjutnya</Button>
      </div>
    </div>
  );
};

export default DataPemilikToko;
