'use client';
import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

const DataPemilikToko = () => {
  const router = useRouter();
  
  // State untuk menyimpan nilai input
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [noHandphone, setNoHandphone] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi untuk memeriksa input
  const handleNext = () => {
    if (!namaLengkap || !email || !noHandphone || !password) {
      message.error('Data Tidak Boleh Ada Yang Kosong!');
      return;
    }
    router.push('/registrasi/DataToko');
  };

  return (
    <div>
      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Nama Lengkap</label>
        <Input 
          placeholder="Nama Lengkap" 
          size="large" 
          value={namaLengkap} 
          onChange={(e) => setNamaLengkap(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <Input 
          placeholder="Email" 
          size="large" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">No Handphone</label>
        <Input 
          placeholder="No Handphone" 
          size="large" 
          value={noHandphone} 
          onChange={(e) => setNoHandphone(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <Input.Password 
          placeholder="Password" 
          size="large" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>

      {/* Tombol hanya ada di halaman ini */}
      <div className="flex justify-between w-full max-w-md mt-6 mb-16">
        <Button type="default" size="large" onClick={() => router.push('/')}>Kembali</Button>
        <Button type="primary" size="large" onClick={handleNext}>Selanjutnya</Button>
      </div>
    </div>
  );
};

export default DataPemilikToko;
