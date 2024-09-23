'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Upload } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { UploadOutlined } from '@ant-design/icons';

const DataToko = () => {
  const router = useRouter();

  return (
    <div>
      {/* Form Input Data Toko */}
      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Nama Toko</label>
        <Input placeholder="Nama Toko" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Deskripsi Toko</label>
        <Input placeholder="Deskripsi Toko" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Alamat Toko</label>
        <Input placeholder="Alamat Toko" size="large" />
      </div>

      <div className='mb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-700">Foto Toko</label>
        <Upload>
          <Button icon={<UploadOutlined />}>Upload Foto</Button>
        </Upload>
      </div>

      {/* Tombol kembali dan selanjutnya */}
      <div className="flex justify-between w-full max-w-md mt-6 mb-16">
        <Button type="default" size="large" onClick={() => router.push('/registrasi/DataPemilikToko')}>Kembali</Button>
        <Button type="primary" size="large" onClick={() => router.push('/registrasi/verifikasi')}>Selanjutnya</Button>
      </div>
    </div>
  );
};

export default DataToko;
