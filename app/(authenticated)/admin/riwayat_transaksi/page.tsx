"use client";
import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Table,
  Button,
  FloatButton,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0); // Total data
  const [kasirList, setKasirList] = useState<any[]>([]); // State untuk kasir
  const [selectedKasir, setSelectedKasir] = useState<string | undefined>(
    undefined
  ); // State untuk kasir yang dipilih
  const pageSize = 10;

  const fetchKasir = async (id_toko: any) => {
    try {
      const response = await axios.get(
        `http://localhost:3222/users/kasir?id_toko=${id_toko}`
      );
      console.log("Data kasir:", response.data); // Memeriksa data kasir
      setKasirList(response.data); // Memperbarui state kasirList
    } catch (error) {
      console.error("Error fetching kasir:", error);
    }
  };

  const fetchData = async (
    id_toko: string,
    startDate = "",
    endDate = "",
    kasirId = "",
    page = 1
  ) => {
    try {
      const response = await axios.get("http://localhost:3222/transaksi/all", {
        params: {
          id_toko,
          startDate,
          endDate,
          kasirId, // Tambahkan kasirId ke parameter
          page,
        },
      });
      if (Array.isArray(response.data.data)) {
        setData(
          response.data.data.map((item: any, index: number) => ({
            ...item,
            key: index,
          }))
        );
        setTotal(response.data.total); // Set total data dari response
      } else {
        console.error("Data is not in array format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage

    if (id_toko) {
      fetchKasir(id_toko); // Ambil daftar kasir
      fetchData(id_toko, "", "", "", currentPage); // Panggil fetchData saat pertama kali
    } else {
      console.error("ID Toko tidak ditemukan di localStorage");
    }
  }, [currentPage]); // Tambahkan currentPage ke dependencies

  const handleKasirChange = (value: string) => {
    setSelectedKasir(value);
    const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage
    if (id_toko) {
      fetchData(id_toko, "", "", value, currentPage); // Fetch data berdasarkan kasir yang dipilih
    }
  };

  const showModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage

    if (id_toko) {
      fetchData(
        id_toko,
        dateStrings[0],
        dateStrings[1],
        selectedKasir,
        currentPage
      ); // Fetch data berdasarkan rentang tanggal dan kasir yang dipilih
    } else {
      console.error("ID Toko tidak ditemukan di localStorage");
    }
  };

  const columns = [
    {
      title: "Tanggal & Waktu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text
          ? `${new Date(text).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}, ${new Date(text).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
              timeZoneName: "short",
            })}`
          : "N/A",
    },
    {
      title: "Jumlah Item",
      dataIndex: "jumlah_produk",
      key: "jumlah_produk",
      render: (jumlah: number) => jumlah ?? "N/A",
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "metodeTransaksi",
      key: "metodeTransaksi",
      render: (metode: string[]) => (metode ? metode.join(", ") : "N/A"),
    },
    {
      title: "Total Pembayaran",
      dataIndex: "totalHarga",
      key: "totalHarga",
      render: (total: number) => `Rp ${formatCurrency(total)}` ?? "N/A",
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (text: any, record: any) => (
        <Button onClick={() => showModal(record)}>Lihat</Button>
      ),
    },
  ];

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage

    if (id_toko) {
      fetchData(id_toko, "", "", selectedKasir, page); // Fetch data untuk halaman baru
    } else {
      console.error("ID Toko tidak ditemukan di localStorage");
    }
  };

  const exportToExcel = async () => {
    const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage
    if (id_toko) {
      // Ambil data seluruhnya tanpa paging
      const response = await axios.get("http://localhost:3222/transaksi/all", {
        params: {
          id_toko,
          startDate: "", // Atau rentang tanggal yang dipilih
          endDate: "", // Atau rentang tanggal yang dipilih
          page: 1,
          limit: 1000000, // Mengambil seluruh data
        },
      });

      const detailedData = response.data.data
        .map((transaction: any) => {
          const transactionInfo = {
            "Id Transaksi": transaction.id_transaksi,
            "Tanggal & Waktu": new Date(transaction.createdAt).toLocaleString(),
            Kasir: transaction.user?.nama,
            "Jumlah Item": transaction.jumlah_produk,
            "Metode Pembayaran": transaction.metodeTransaksi?.join(", "),
            "Total Pembayaran": `Rp ${formatCurrency(transaction.totalHarga)}`,
          };

          const productDetails =
            transaction.produkDetail?.map((product: any) => ({
              ...transactionInfo,
              "Kode Produk": product.kode_produk,
              "Nama Produk": product.nama_produk,
              "Jumlah Produk": product.jumlah,
              "Harga Produk": `Rp ${formatCurrency(product.harga)}`,
              "Total Produk": `Rp ${formatCurrency(product.total)}`,
            })) || [];

          return productDetails;
        })
        .flat();

      const ws = XLSX.utils.json_to_sheet(detailedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");
      XLSX.writeFile(wb, "Riwayat_Transaksi.xlsx");
    } else {
      console.error("ID Toko tidak ditemukan di localStorage");
    }
  };

  return (
    <div className="pt-1 pl-5 pb-5 mr-16 ml-60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={handleDateChange} className="mb-4" />
        </div>
        <div className="flex items-center">
          <Popconfirm
            title="Apakah Anda yakin ingin mengekspor data ke Excel?"
            onConfirm={exportToExcel}
            okText="Ya"
            cancelText="Batal"
          >
            <FloatButton
              tooltip={<div>Export to Excel</div>}
              style={{ position: "relative", top: 0, right: 0 }}
            />
          </Popconfirm>
        </div>
      </div>
      <div className="relative w-full h-auto bg-white p-6 shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize,
            total: total,
            onChange: onPageChange,
          }}
        />
      </div>

      <Modal
        title="Detail Transaksi"
        open={isModalVisible}
        onCancel={handleCancel} // Untuk menangani penutupan dengan klik X
        width={800}
        closable={true} // Menampilkan hanya tombol X
        footer={null} // Menghilangkan footer (OK dan Cancel button)
      >
        {selectedTransaction ? (
          <div>
            <p>
              <strong>Id Transaksi:</strong> {selectedTransaction.id_transaksi}
            </p>
            <p>
              <strong>Tanggal & Waktu:</strong>{" "}
              {new Date(selectedTransaction.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Kasir:</strong> {selectedTransaction.user?.nama}
            </p>
            <p>
              <strong>Jumlah Item:</strong> {selectedTransaction.jumlah_produk}
            </p>
            <p>
              <strong>Metode Pembayaran:</strong>{" "}
              {selectedTransaction.metodeTransaksi?.join(", ")}
            </p>
            <p>
              <strong>Total Pembayaran:</strong> Rp{" "}
              {selectedTransaction.totalHarga
                ? formatCurrency(selectedTransaction.totalHarga)
                : "N/A"}
            </p>

            <Table
              dataSource={selectedTransaction.produkDetail}
              columns={[
                {
                  title: "Kode Produk",
                  dataIndex: "kode_produk",
                  key: "kode_produk",
                },
                {
                  title: "Nama Produk",
                  dataIndex: "nama_produk",
                  key: "nama_produk",
                },
                { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
                {
                  title: "Harga",
                  dataIndex: "harga",
                  key: "harga",
                  render: (total: number) => `Rp ${formatCurrency(total)}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (total: number) => `Rp ${formatCurrency(total)}`,
                },
              ]}
              rowKey="id_produk"
              pagination={false}
            />
          </div>
        ) : (
          <p>Tidak ada detail yang tersedia.</p>
        )}
      </Modal>
    </div>
  );
};

export default RiwayatTransaksiPage;
