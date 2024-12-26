"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { message } from "antd";
import ProductCountCard from './ProductCountCard';
import TransactionCard from './TransactionCard';
import LowStockCard from './LowStockCard';
import MonthlySalesChart from './MonthlySalesChart';
import RevenueCard from './RevenueCard';

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

const DashboardPage: React.FC = () => {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [jumlahTransaksi, setJumlahTransaksi] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  const [period, setPeriod] = useState<string>(Period.THIS_MONTH);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [produkCount, setProdukCount] = useState<number>(0);
  const idToko = localStorage.getItem("id_toko");

  const fetchProdukCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3222/produk/count?id_toko=${idToko}`);
      setProdukCount(response.data);
    } catch (error) {
      console.error("Error fetching produk count:", error);
      message.error("Terjadi kesalahan saat mengambil jumlah produk");
    }
  };

  useEffect(() => {
    fetchProdukCount();
  }, [idToko]);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    axios
      .get(`http://localhost:3222/produk/filter-min-stok/toko/${idToko}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProduk(response.data);
      })
      .catch((error) => {
        console.error('Error fetching produk:', error);
      });
  }, [idToko]);

  useEffect(() => {
    const id_toko = localStorage.getItem("id_toko");
    if (!id_toko) {
      console.error("id_toko not found in localStorage");
      setError("id_toko not found");
      return;
    }

    axios
      .get(`http://localhost:3222/transaksi/count?id_toko=${id_toko}`)
      .then((response) => {
        setJumlahTransaksi(response.data.jumlahTransaksi);
      })
      .catch((error) => {
        console.error("Error fetching jumlah transaksi:", error);
        setError("Error fetching data");
      });
  }, []);

  useEffect(() => {
    if (idToko) {
      axios
        .get(`http://localhost:3222/transaksi/total-harga?id_toko=${idToko}&period=${period}`)
        .then((response) => {
          setTotalHarga(response.data);
        })
        .catch((error) => {
          console.error("Error fetching total harga:", error);
        });
    }
  }, [idToko, period]);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get(`http://localhost:3222/transaksi/monthly-sales?id_toko=${idToko}`);
        setMonthlySales(response.data);
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    if (idToko) {
      fetchMonthlySales();
    } else {
      console.error("id_toko is not found in localStorage.");
    }
  }, [idToko]);

  return (
    <div className="p-6 mr-8 ml-60">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mr-5 ml-5">
        <ProductCountCard produkCount={produkCount} />
        <TransactionCard jumlahTransaksi={jumlahTransaksi} />
        <LowStockCard produk={produk}/>
      </div>

      <div className="grid grid-cols-[3fr,1fr] gap-5 mr-5 ml-5 mt-10">
        <MonthlySalesChart monthlySales={monthlySales} />
        <RevenueCard totalHarga={totalHarga} period={period} setPeriod={setPeriod} />
      </div>
    </div>
  );
};

export default DashboardPage;