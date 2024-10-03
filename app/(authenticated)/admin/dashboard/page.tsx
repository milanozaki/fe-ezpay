"use client";
import React, { useEffect, useState } from "react";
import { CgShoppingBag } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Daftarkan komponen yang diperlukan dari Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// DashboardPage Component
const DashboardPage = () => {
  const [stokMenipis, setStokMenipis] = useState<any[]>([]);
  const [jumlahProduk, setJumlahProduk] = useState<number>(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState<number>(0);
  const [totalOmset, setTotalOmset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const stokResponse = await fetch(
          "http://localhost:3222/produk/filter-stok"
        );
        const stokData = await stokResponse.json();
        setStokMenipis(stokData);

        const jumlahResponse = await fetch(
          "http://localhost:3222/produk/count"
        );
        const jumlahData = await jumlahResponse.json();
        setJumlahProduk(jumlahData.jumlahProduk);

        const transaksiResponse = await fetch(
          "http://localhost:3222/transaksi/count"
        );
        const transaksiData = await transaksiResponse.json();
        setJumlahTransaksi(transaksiData.jumlahTransaksi);

        const omsetResponse = await fetch(
          "http://localhost:3222/transaksi/total-harga"
        );
        const omsetData = await omsetResponse.json();
        setTotalOmset(omsetData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistik Penjualan Bulanan",
      },
    },
  };

  // Sample dummy data for the chart
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Penjualan",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(51, 47, 208, 1)",
        borderColor: "rgba(51, 47, 208, )",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 mr-8 ml-60">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mr-5 ml-5">
        {/* Card Jumlah Produk */}
        <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
          <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#31716c]">
            Jumlah Produk
          </h2>
          <div className="flex items-center justify-center mt-10 ">
            <div className="bg-green-100 rounded-3xl w-[90px] h-[90px] flex items-center justify-center mr-12">
              <CgShoppingBag
                style={{ fontSize: 60, padding: 5 }}
                className="text-green-700"
              />
            </div>
            <div className="mr-12">
              <p className="text-sm text-gray-500">Total produk </p>
              <p className="text-3xl font-bold text-gray-900">{jumlahProduk}</p>
            </div>
          </div>
        </div>

        {/* Card Transaksi */}
        <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
          <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#0B8494]">
            Transaksi
          </h2>
          <div className="flex items-center justify-center mt-10">
            <div className="bg-blue-50 rounded-3xl w-[90px] h-[90px] flex items-center justify-center mr-12">
              <GrTransaction
                style={{ fontSize: 60, padding: 10 }}
                className="text-blue-700"
              />
            </div>
            <div className="mr-12">
              <p className="text-sm text-gray-500">Total transaksi</p>
              <p className="text-3xl font-bold text-gray-900">
                {jumlahTransaksi}
              </p>
            </div>
          </div>
        </div>

        {/* Card Stok Menipis */}
        <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
          <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#50B498]">
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
      <div className="grid grid-cols-[3fr,1fr] gap-5 mr-5 ml-5 mt-10">
        {/* Card Statistik Penjualan Bulanan */}
        <div className="w-full p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative flex flex-col h-full">
          <h2 className="text-xl font-semibold text-center bg-[#294978] absolute top-0 left-0 right-0 text-white p-3 rounded-t-xl">
            Statistik Penjualan Bulanan
          </h2>
          <div className="flex justify-center items-center h-full">
            <Bar data={chartData} options={chartOptions} height={130} />
          </div>
        </div>

        <div className="w-full h-full bg-gradient-to-r from-[#fc7a4a] to-[#ff6a34] p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative flex flex-col animate-pulseScale animate-glow">
          <h2 className="text-xl font-semibold text-center text-white ">
            Pendapatan Anda
          </h2>
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-3xl font-bold text-white">
              Rp {totalOmset.toLocaleString()}
            </p>
            <p className="text-sm text-white">Total Pendapatan Bulan Ini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
