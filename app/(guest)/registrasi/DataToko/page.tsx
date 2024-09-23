'use client';
import React, { useState } from 'react';
import { Input, Button, Upload, message } from 'antd';
import { useRouter } from 'next/navigation';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface'; // Impor UploadFile dari antd

const DataToko = () => {
  const router = useRouter();

  // State untuk menyimpan nilai input
  const [namaToko, setNamaToko] = useState('');
  const [deskripsiToko, setDeskripsiToko] = useState('');
  const [alamatToko, setAlamatToko] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]); // Menentukan tipe untuk fileList

  // Fungsi untuk memeriksa input
  const handleKirim = () => {
    if (!namaToko || !deskripsiToko || !alamatToko || fileList.length === 0) {
      message.error('Data Tidak Boleh Ada Yang Kosong!');
      return;
    }
    // Jika semua field valid, lanjutkan ke halaman verifikasi
    router.push('/registrasi/verifikasi');
  };

  return (
    <div>
      {/* Form Input Data Toko */}
      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Nama Toko</label>
        <Input 
          placeholder="Nama Toko" 
          size="large" 
          value={namaToko} 
          onChange={(e) => setNamaToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Deskripsi Toko</label>
        <Input 
          placeholder="Deskripsi Toko" 
          size="large" 
          value={deskripsiToko} 
          onChange={(e) => setDeskripsiToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Alamat Toko</label>
        <Input 
          placeholder="Alamat Toko" 
          size="large" 
          value={alamatToko} 
          onChange={(e) => setAlamatToko(e.target.value)} 
        />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Foto Toko</label>
        <Upload 
          fileList={fileList} 
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <Button icon={<UploadOutlined />}>Upload Foto</Button>
        </Upload>
      </div>

      {/* Tombol kembali dan kirim */}
      <div className="flex justify-between w-full max-w-md mt-6 mb-16">
        <Button type="default" size="large" onClick={() => router.push('/registrasi/DataPemilikToko')}>Kembali</Button>
        <Button type="primary" size="large" onClick={handleKirim}>Kirim</Button>
      </div>
    </div>
  );
};

export default DataToko;
