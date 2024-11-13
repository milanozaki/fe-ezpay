"use client";
import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Table,
  Button,
  FloatButton,
  Modal,
  Popconfirm,
} from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import axios from "axios";
import Cookies from "js-cookie";

const { RangePicker } = DatePicker;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0); // Total data
  const pageSize = 10;

  const fetchData = async (startDate = "", endDate = "", page = 1) => {
    try {
      const id_user = Cookies.get("id_user");
      if (!id_user) {
        console.error("ID User tidak ditemukan di cookies");
        return;
      }
  
      const response = await axios.get(
        `http://localhost:3222/transaksi/ser/user/${id_user}`,
        {
          params: {
            startDate,
            endDate,
            page,
            limit: pageSize,
          },
        }
      );
  
      console.log("Response data:", response.data); // Tambahkan log ini
  
      // Cek apakah response.data adalah array
      if (Array.isArray(response.data)) {
        setData(
          response.data.map((item: any, index: any) => ({
            ...item,
            key: index,
          }))
        );
        setTotal(response.data.length); // Total data sesuai dengan panjang array
      } else {
        console.error("Data is not in array format:", response.data);
        setData([]); // Atur data ke array kosong
        setTotal(0); // Atur total ke 0
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData("", "", currentPage); // Panggil fetchData saat pertama kali
  }, [currentPage]); // Tambahkan currentPage ke dependencies

  const showModal = (transaction: any) => {
    /*************  ✨ Codeium Command ⭐  *************/
    /**

/******  c307285a-69cf-48d1-b436-3e666379b4c3  *******/ setSelectedTransaction(
      transaction
    );
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (dates: any, dateStrings: any) => {
    fetchData(dateStrings[0], dateStrings[1], currentPage); // Fetch data berdasarkan rentang tanggal
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

  // Handle pagination
  const onPageChange = (page: any) => {
    setCurrentPage(page);
    fetchData("", "", page); // Fetch data untuk halaman baru berdasarkan id_user dari cookies
  };

  return (
    <div className="pt-1 pl-5 pb-5 mr-16 ml-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={handleDateChange} className="mb-4" />
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
