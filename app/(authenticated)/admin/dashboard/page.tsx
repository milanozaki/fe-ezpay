'use client'; // Menandakan komponen ini sebagai Client Component
import React, { useEffect, useState } from 'react';
import { CgShoppingBag } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";

// DashboardPage Component
const DashboardPage = () => {
  const [stokMenipis, setStokMenipis] = useState<any[]>([]); // State untuk menyimpan data stok menipis
  const [jumlahProduk, setJumlahProduk] = useState<number>(0); // State untuk menyimpan jumlah produk
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true sebelum memulai fetch

        // Fetch untuk stok menipis
        const stokResponse = await fetch('http://localhost:3222/produk/filter-stok');
        const stokData = await stokResponse.json();
        setStokMenipis(stokData);

        // Fetch untuk jumlah produk
        const jumlahResponse = await fetch('http://localhost:3222/produk/count');
        const jumlahData = await jumlahResponse.json();
        setJumlahProduk(jumlahData.jumlahProduk);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false setelah fetch selesai
      }
    };

    fetchData();
  }, []);

  // Jika data sedang diambil, tampilkan loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Baris pertama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mr-5 ml-5">
        <div className="w-full h-[200px] bg-white p-6 shadow-lg rounded-lg relative">
          <h2 className="text-xl font-semibold text-center text-white p-2 absolute top-0 left-0 right-0 rounded-t-lg"
              style={{
                backgroundImage: 'linear-gradient(to right, #007F73, #4CCD99)',
              }}
          >
            Jumlah Produk
          </h2>
          <div className="flex items-center justify-center mt-10">
            <div className="bg-green-100 rounded-2xl w-[90px] h-[90px] flex items-center justify-center">
              <CgShoppingBag style={{ fontSize: 60, padding: 10 }} className="text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total produk </p>
              <p className="text-2xl font-semibold text-gray-700">{jumlahProduk}</p>
            </div>
          </div>
        </div>
        <div className="w-full h-[200px] bg-white p-6 shadow-lg rounded-lg relative">
          <h2 className="text-xl font-semibold text-center text-white p-2 absolute top-0 left-0 right-0 rounded-t-lg"
              style={{
                backgroundImage: 'linear-gradient(to right, #687EFF, #80B3FF)',
              }}
          >
            Transaksi
          </h2>
          <div className="flex items-center justify-center mt-10">
            <div className="bg-blue-50 rounded-2xl w-[90px] h-[90px] flex items-center justify-center">
              <GrTransaction style={{ fontSize: 60, padding: 10 }} className="text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total transaksi</p>
              <p className="text-2xl font-semibold text-gray-700">250</p>
            </div>
          </div>
        </div>
        <div className="w-full h-[200px] bg-white p-6 shadow-lg rounded-lg relative">
          <h2 className="text-xl font-semibold text-center text-white p-2 absolute top-0 left-0 right-0 rounded-t-lg"
              style={{
                backgroundImage: 'linear-gradient(to right, #3D8399, #21404A)',
              }}
          >
            Stok Menipis
          </h2>
          <div className="mt-8">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Nama Produk</th>
                  <th className="border-b p-2">Stok</th>
                </tr>
              </thead>
              <tbody>
                {stokMenipis.slice(0, 2).map((item, index) => (
                  <tr key={index}>
                    <td className="border-t p-2">{item.nama_produk}</td>
                    <td className="border-t p-2">{item.stok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Baris kedua */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10 mr-5 ml-5 mt-10">
        <div className="w-full h-[200px] bg-white p-6 shadow-lg rounded-lg relative">
          <h2 className="text-xl font-semibold text-center bg-[#257691] text-white p-2 absolute top-0 left-0 right-0 rounded-t-lg">
            Statistik Penjualan Bulanan
          </h2>
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-700">Data penjualan tidak tersedia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
