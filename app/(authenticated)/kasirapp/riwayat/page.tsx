"use client";
import React, { useState, useEffect } from "react";
import { DatePicker, Table, Button, Modal, message, Spin } from "antd";
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
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // State untuk loading
  const pageSize = 10;

  const fetchData = async (startDate = "", endDate = "", page = 1) => {
    try {
      setLoading(true); // Mulai loading
      const id_user = Cookies.get("id_user");
      if (!id_user) {
        message.error("ID User tidak ditemukan di cookies");
        return;
      }

      const response = await axios.get(
        `http://localhost:3222/transaksi/${id_user}`,
        {
          params: { startDate, endDate, page, limit: pageSize },
        }
      );

      const { data: responseData, total: responseTotal } = response.data;

      if (Array.isArray(responseData)) {
        setData(responseData.map((item: any, index: any) => ({ ...item, key: index })));
        setTotal(responseTotal || responseData.length);
      } else {
        console.error("Data is not in array format:", responseData);
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false); // Akhiri loading
    }
  };

  useEffect(() => {
    fetchData("", "", currentPage);
  }, [currentPage]);

  const showModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const handleDateChange = (dates: any, dateStrings: any) => {
    setCurrentPage(1); // Reset halaman saat filter tanggal diubah
    fetchData(dateStrings[0], dateStrings[1], 1);
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

  const onPageChange = (page: any) => setCurrentPage(page);

  return (
    <div className="pt-1 pl-5 pb-5 mr-16 ml-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={handleDateChange} className="mb-4" />
        </div>
      </div>
      <div className="relative w-full h-auto bg-white p-6 shadow-lg rounded-lg">
        {loading ? (
          <Spin size="large" />
        ) : (
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
        )}
      </div>
      <Modal
  title="Detail Transaksi"
  open={isModalVisible}
  onCancel={handleCancel} // Close modal when clicking on the backdrop or close button
  footer={null} // Remove the default footer
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
