'use client';
import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

const DataAkunToko = () => {
  const router = useRouter();
  
  // State untuk menyimpan nilai input
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [noHandphone, setNoHandphone] = useState('');
  const [password, setPassword] = useState('');
  const [namaToko, setNamaToko] = useState('');
  const [alamatToko, setAlamatToko] = useState('');
  const [deskripsiToko, setDeskripsiToko] = useState('');
  const [foto, setFoto] = useState<File | null>(null); // Ubah ini untuk mendukung File atau null

  // Fungsi untuk mendaftar
  const handleRegister = async () => {
    if (!namaLengkap || !email || !noHandphone || !password || !namaToko || !alamatToko || !deskripsiToko || !foto) {
      message.error('Data Tidak Boleh Ada Yang Kosong!');
      return;
    }

    const adminDto = {
      nama: namaLengkap,
      email: email,
      no_handphone: noHandphone,
      password: password,
    };

    const tokoDto = {
      nama_toko: namaToko,
      alamat_toko: alamatToko,
      deskripsi_toko: deskripsiToko,
    };

    const formData = new FormData();
    formData.append('adminDto', JSON.stringify(adminDto));
    formData.append('tokoDto', JSON.stringify(tokoDto));
    formData.append('foto', foto); // Menambahkan file foto

    try {
      const response = await fetch('http://localhost:3222/toko/create-with-admin', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Pindah ke halaman Verifikasi
        router.push('/registrasi/verifikasi');
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Terjadi kesalahan saat mendaftar.');
      }
    } catch (error) {
      message.error('Terjadi kesalahan jaringan.');
      console.error(error);
    }
  };

  return (
    <div>
      {/* Data Pemilik Toko */}
      <h1 className='text-xl mb-3 font-semibold'>Data Pemilik Toko</h1>
      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Nama Lengkap</label>
        <Input 
          placeholder="Nama Lengkap" 
          size="large" 
          value={namaLengkap} 
          onChange={(e) => setNamaLengkap(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Email</label>
        <Input 
          placeholder="Email" 
          size="large" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">No Handphone</label>
        <Input 
          placeholder="No Handphone" 
          size="large" 
          value={noHandphone} 
          onChange={(e) => setNoHandphone(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Password</label>
        <Input.Password 
          placeholder="Password" 
          size="large" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>

      {/* Data Toko */}
      <h1 className='text-xl mb-3 mt-8 font-semibold'>Data Toko</h1>
      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Nama Toko</label>
        <Input 
          placeholder="Nama Toko" 
          size="large" 
          value={namaToko} 
          onChange={(e) => setNamaToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Alamat Toko</label>
        <Input 
          placeholder="Alamat Toko" 
          size="large" 
          value={alamatToko} 
          onChange={(e) => setAlamatToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Deskripsi Toko</label>
        <Input.TextArea 
          placeholder="Deskripsi Toko" 
          size="large" 
          value={deskripsiToko} 
          onChange={(e) => setDeskripsiToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm text-gray-700">Foto Toko (File)</label>
        <Input 
          type="file" // Ubah tipe input menjadi file
          size="large"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFoto(e.target.files[0]); // Menyimpan file yang dipilih
            }
          }} 
        />
      </div>

      <div className="flex justify-between w-full max-w-md mt-6 mb-16">
        <Button type="default" size="large" onClick={() => router.push('/')}>Kembali</Button>
        <Button type="primary" size="large" onClick={handleRegister}>Daftar</Button>
      </div>
    </div>
  );
};

export default DataAkunToko;
