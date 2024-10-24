"use client";
import React, { useEffect, useState } from "react";
import { CgShoppingBag } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import { Bar } from "react-chartjs-2";
import { useRouter } from "next/navigation"; // untuk navigasi programatik
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { message } from "antd"; // Jika kamu menggunakan Ant Design untuk notifikasi

// Daftarkan komponen yang diperlukan dari Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlySales {
  month: string;
  total: number;
}

interface Produk {
  id_produk: string;
  nama_produk: string;
  stok: number;
}

const Period = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  THIS_WEEK: "this_week",
  LAST_WEEK: "last_week",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  LAST_30_DAYS: "last_30_days",
  THIS_QUARTER: "this_quarter",
  LAST_QUARTER: "last_quarter",
  THIS_YEAR: "this_year",
  LAST_YEAR: "last_year",
};

// DashboardPage Component
const DashboardPage = () => {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0); // State untuk menyimpan jumlah transaksi
  const [error, setError] = useState<string | null>(null); // Ubah tipe state menjadi string atau null
  const [totalHarga, setTotalHarga] = useState(0);
  const [period, setPeriod] = useState(Period.THIS_MONTH); // Default periode
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [produkCount, setProdukCount] = useState(0);
  const idToko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage
  const router = useRouter(); // hook untuk navigasi

  const fetchProdukCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3222/produk/count?id_toko=${idToko}`
      );
      setProdukCount(response.data);
    } catch (error) {
      console.error("Error fetching produk count:", error);
      message.error("Terjadi kesalahan saat mengambil jumlah produk");
    }
  };

  useEffect(() => {
    fetchProdukCount();
  }, [idToko]); // Dependensi jika idToko berubah, panggil ulang

  useEffect(() => {
    axios
      .get(`http://localhost:3222/produk/filter-min-stok/toko/${idToko}`)
      .then((response) => {
        setProduk(response.data); // Simpan data produk yang diterima
      })
      .catch((error) => {
        console.error("Error fetching produk:", error);
      });
  }, [idToko]);

  useEffect(() => {
    // Ambil id_toko dari localStorage
    const id_toko = localStorage.getItem("id_toko");

    if (!id_toko) {
      console.error("id_toko not found in localStorage");
      setError("id_toko not found");
      return;
    }

    // Fetch jumlah transaksi dari API menggunakan Axios
    axios
      .get(`http://localhost:3222/transaksi/count?id_toko=${id_toko}`)
      .then((response) => {
        setJumlahTransaksi(response.data.jumlahTransaksi); // Simpan data jumlah transaksi ke state
      })
      .catch((error) => {
        console.error("Error fetching jumlah transaksi:", error);
        setError("Error fetching data"); // Set error jika ada masalah
      });
  }, []); // useEffect dijalankan sekali setelah komponen dipasang

  useEffect(() => {
    if (idToko) {
      axios
        .get(
          `http://localhost:3222/transaksi/total-harga?id_toko=${idToko}&period=${period}`
        )
        .then((response) => {
          setTotalHarga(response.data); // Simpan totalHarga yang diterima
        })
        .catch((error) => {
          console.error("Error fetching total harga:", error);
        });
    }
  }, [idToko, period]); // Tambahkan period ke dalam dependency array

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3222/transaksi/monthly-sales?id_toko=${idToko}`
        );
        setMonthlySales(response.data); // Simpan data penjualan bulanan yang diterima
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    if (idToko) {
      fetchMonthlySales(); // Panggil fungsi fetch jika id_toko tersedia
    } else {
      console.error("id_toko is not found in localStorage.");
    }
  }, [idToko]); // Dependency array untuk re-fetch saat idToko berubah

  const data = {
    labels: monthlySales.map((sale) => {
      const date = new Date(`${sale.month}-01`); // Mengonversi 'YYYY-MM' menjadi Date object
      return new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date); // Menghasilkan nama bulan dalam bahasa Indonesia
    }),
    datasets: [
      {
        label: "Total Penjualan",
        data: monthlySales.map((sale) => sale.total),
        backgroundColor: "rgba(51, 47, 208, 1)",
        borderColor: "rgba(51, 47, 208, 1)",
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
              <p className="text-3xl font-bold text-gray-900">{produkCount}</p>
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
                {produk.slice(0, 2).map((item, index) => (
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
        <div className="container mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-4">
            Penjualan Bulanan
          </h2>
          {monthlySales.length > 0 ? (
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Grafik Penjualan Bulanan",
                  },
                },
              }}
            />
          ) : (
            <div className="text-center">Loading data...</div>
          )}
        </div>

        <div className="w-full h-full bg-gradient-to-r from-[#fc7a4a] to-[#ff6a34] p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative flex flex-col animate-pulseScale animate-glow">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center text-white mb-4">
              Pendapatan Anda
            </h2>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)} // Mengubah periode saat dropdown berubah
              className="block w-8/12 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Period.TODAY}>Hari Ini</option>
              <option value={Period.YESTERDAY}>Kemarin</option>
              <option value={Period.THIS_WEEK}>Minggu Ini</option>
              <option value={Period.LAST_WEEK}>Minggu Lalu</option>
              <option value={Period.THIS_MONTH}>Bulan Ini</option>
              <option value={Period.LAST_MONTH}>Bulan Lalu</option>
              <option value={Period.LAST_30_DAYS}>30 Hari Terakhir</option>
              <option value={Period.THIS_QUARTER}>Kuartal Ini</option>
              <option value={Period.LAST_QUARTER}>Kuartal Lalu</option>
              <option value={Period.THIS_YEAR}>Tahun Ini</option>
              <option value={Period.LAST_YEAR}>Tahun Lalu</option>
            </select>
          </div>

          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-3xl font-bold text-white">
              Rp {totalHarga.toLocaleString()}
            </p>
            <p className="text-sm text-white">Total Pendapatan Bulan Ini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
