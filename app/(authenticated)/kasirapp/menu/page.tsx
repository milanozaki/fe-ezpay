'use client'; // Menandakan ini adalah komponen client-side
import React, { useEffect, useState } from 'react';

const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([]); // State untuk menyimpan data kategori
  const [activeButton, setActiveButton] = useState<string>('Semua'); // State untuk tombol yang aktif
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading

  // Fetch data kategori dari API saat komponen di-mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // Mulai loading
        const response = await fetch('http://localhost:3222/kategori'); // Sesuaikan endpoint API Anda
        const data = await response.json();
        setCategories(data.data); // Asumsikan data kategori ada di dalam data.data
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading jika data sedang diambil
  }

  // Fungsi untuk handle tombol yang aktif
  const handleButtonClick = (namaKategori: string) => {
    setActiveButton(namaKategori); // Set tombol yang diklik menjadi aktif
  };

  // Kondisi untuk menentukan apakah tombol aktif atau tidak
  const getButtonStyle = (namaKategori: string) => {
    return activeButton === namaKategori
      ? 'bg-[#3B8394] text-white border-[#3B8394]' // Jika aktif
      : 'bg-white text-[#3B8394] border-[#3B8394] hover:bg-[#3B8394] hover:text-white'; // Jika tidak aktif
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-3xl border-2 transition duration-300 flex items-center justify-center ${getButtonStyle('Semua')}`}
          onClick={() => handleButtonClick('Semua')}
        >
          Semua
        </button>

        {/* Render tombol berdasarkan kategori dari API */}
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-3xl border-2 transition duration-300 flex items-center justify-center ${getButtonStyle(category.nama)}`}
            onClick={() => handleButtonClick(category.nama)}
          >
            {category.nama} {/* Menampilkan nama kategori */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
