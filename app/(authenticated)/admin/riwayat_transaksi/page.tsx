"use client";

import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Table,
  Button,
  FloatButton,
  Modal,
  Popconfirm,
} from "antd"; // Import Popconfirm
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import axios from "axios";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const pageSize = 10;
  const router = useRouter();

  // Function to get cookies by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // Check if accessToken exists; if not, redirect to login page
  const accessToken = getCookie("accessToken");

  useEffect(() => {
    if (!accessToken) {
      // If accessToken doesn't exist, redirect to login
      router.push("/login_admin");
    } else {
      // Fetch data if accessToken exists
      fetchData();
    }
  }, [accessToken, router]);

  // Fetch data from backend with optional date range
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get("http://localhost:3222/transaksi/all", {
        params: {
          startDate,
          endDate,
        },
      });
      console.log("Fetched Data:", response.data); // Check the data structure
      if (Array.isArray(response.data)) {
        setData(
          response.data.map((item: any, index: number) => ({
            ...item,
            key: index,
          })) // Add key for each item
        );
      } else {
        console.error("Data is not in array format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  // Show modal with transaction details
  const showModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  // Close modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle date changes
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      fetchData(dateStrings[0], dateStrings[1]); // Fetch data based on date range
    } else {
      fetchData(); // Show all data if no date selected
    }
  };

  // Define columns for the table
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

  // Pagination handler
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Data displayed based on pagination
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");
    XLSX.writeFile(wb, "Riwayat_Transaksi.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div className="pt-1 pl-5 pb-5 mr-24 ml-60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={handleDateChange} className="mb-4" />
        </div>
        {/* Use Popconfirm for exporting to Excel */}
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
      <div className="relative w-full h-auto bg-white p-6 shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={{
            current: currentPage,
            pageSize,
            total: data.length,
            onChange: onPageChange,
          }}
        />
      </div>

      <Modal
        title="Detail Transaksi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} // Adjust width as needed
      >
        {selectedTransaction ? (
          <div>
            <p>
              <strong>ID Transaksi:</strong> {selectedTransaction.id_transaksi}
            </p>
            <p>
              <strong>Tanggal & Waktu:</strong>{" "}
              {selectedTransaction.createdAt
                ? `${new Date(selectedTransaction.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}, ${new Date(
                    selectedTransaction.createdAt
                  ).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                    timeZoneName: "short",
                  })}`
                : "N/A"}
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
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
    </div>
  );
};

export default RiwayatTransaksiPage;
