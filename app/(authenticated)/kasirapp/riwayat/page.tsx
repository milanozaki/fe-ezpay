"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, Table, Button, FloatButton, Modal } from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import axios from "axios";

const { RangePicker } = DatePicker;

// Fungsi untuk memformat angka menjadi mata uang
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0); // Tambahkan state untuk total item
  const pageSize = 10;

  // Fungsi untuk mengambil data transaksi
  const fetchData = async (startDate = "", endDate = "", page = currentPage, limit = pageSize) => {
    try {
      const response = await axios.get("http://localhost:3222/transaksi/all", {
        params: {
          startDate,
          endDate,
          page,
          limit, // Kirimkan limit ke backend
        },
      });
      if (response.data) {
        setData(
          response.data.data.map((item: any, index: number) => ({
            ...item,
            key: index,
          }))
        );
        setTotalItems(response.data.total); // Set total items dari response
      } else {
        console.error("Data is not in array format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Mengambil data saat komponen dimuat
  }, []);

  // Menampilkan modal untuk detail transaksi
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

  // Mengatur tanggal dari RangePicker
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      fetchData(dateStrings[0], dateStrings[1], 1); // Reset ke halaman 1 saat filter tanggal
    } else {
      fetchData(); // Mengambil data tanpa filter tanggal
    }
  };

  // Definisi kolom tabel
  const columns = [
    {
      title: "Tanggal & Waktu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (text ? new Date(text).toLocaleString() : "N/A"),
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
    fetchData("", "", page); // Ambil data untuk halaman yang dipilih
  };

  // Fungsi untuk mengekspor data ke Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");
    XLSX.writeFile(wb, "Riwayat_Transaksi.xlsx");
  };

  return (
    <div
      className="pt-0 pb-6 px-8 relative"
      style={{ overflowY: "auto", maxHeight: "90vh", overflowX: "hidden" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={handleDateChange} className="mb-4" />
        </div>
        <div className="relative">
          <FloatButton
            tooltip={<div>Export to Excel</div>}
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={exportToExcel}
          />
        </div>
      </div>
      <div className="relative w-full bg-white p-4 shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItems, // Total item yang diterima dari backend
            onChange: onPageChange,
          }}
          scroll={{ x: "max-content" }} 
        />
      </div>

      <Modal
        title="Detail Transaksi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        {selectedTransaction ? (
          <div>
            <p>
              <strong>ID Transaksi:</strong> {selectedTransaction.id_transaksi}
            </p>
            <p>
              <strong>Tanggal & Waktu:</strong>{" "}
              {new Date(selectedTransaction.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>User:</strong> {selectedTransaction.user?.nama} (ID:{" "}
              {selectedTransaction.user?.id_user})
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

