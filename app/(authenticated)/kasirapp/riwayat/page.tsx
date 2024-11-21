"use client";
import React, { useState, useEffect } from "react";
import { DatePicker, Table, Button, Modal, message, Spin, Typography, Row, Col } from "antd";
import "antd/dist/reset.css"
import * as XLSX from "xlsx";
import axios from "axios";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchData = async (startDate = "", endDate = "", page = 1) => {
    try {
      setLoading(true);
      const id_user = Cookies.get("id_user");
      if (!id_user) {
        message.error("ID User tidak ditemukan di cookies");
        return;
      }
      const response = await axios.get(
        `http://localhost:3222/transaksi/${id_user}`,
        { params: { startDate, endDate, page, limit: pageSize } }
      );
      const { data: responseData, total: responseTotal } = response.data;
      setData(
        responseData.map((item: any, index: any) => ({ ...item, key: index }))
      );
      setTotal(responseTotal || responseData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("", "", currentPage);
  }, [currentPage]);

  const showModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleDateChange = (dates: any, dateStrings: any) => {
    setCurrentPage(1);
    fetchData(dateStrings[0], dateStrings[1], 1);
  };

  const onPageChange = (page: any) => setCurrentPage(page);

  const generatePDF = async () => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent) {
      const canvas = await html2canvas(modalContent);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`Struk_Transaksi_${selectedTransaction.id_transaksi}.pdf`);
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
      onCancel={handleCancel}
      footer={[
        <Button key="print" type="primary" onClick={generatePDF} style={{ width: "100%" }}>
          Cetak PDF
        </Button>,
      ]}
      width={800}
      bodyStyle={{ padding: "24px" }}
      centered
    >
      <div id="modal-content">
        {selectedTransaction ? (
          <div>
            {/* Informasi Transaksi */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>No Transaksi:</Text>
                <p>{selectedTransaction.id_transaksi}</p>
              </Col>
              <Col span={12}>
                <Text strong>Tanggal & Waktu:</Text>
                <p>{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>Kasir:</Text>
                <p>{selectedTransaction.user?.nama}</p>
              </Col>
              <Col span={12}>
                <Text strong>Jumlah Item:</Text>
                <p>{selectedTransaction.jumlah_produk}</p>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>Metode Pembayaran:</Text>
                <p>{selectedTransaction.metodeTransaksi?.join(", ")}</p>
              </Col>
              <Col span={12}>
                <Text strong>Total Pembayaran:</Text>
                <p>Rp {selectedTransaction.totalHarga ? formatCurrency(selectedTransaction.totalHarga) : "N/A"}</p>
              </Col>
            </Row>

            {/* Tabel Produk */}
            <Table
              dataSource={selectedTransaction.produkDetail}
              columns={[
                { title: "Kode Produk", dataIndex: "kode_produk", key: "kode_produk" },
                { title: "Nama Produk", dataIndex: "nama_produk", key: "nama_produk" },
                { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
                {
                  title: "Harga",
                  dataIndex: "harga",
                  key: "harga",
                  render: (text: number) => `Rp ${formatCurrency(text)}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (text: number) => `Rp ${formatCurrency(text)}`,
                },
              ]}
              rowKey="id_produk"
              pagination={false}
              bordered
              size="small"
              style={{ marginTop: 20 }}
            />
          </div>
        ) : (
          <Text>Tidak ada detail yang tersedia.</Text>
        )}
      </div>
    </Modal>
    </div>
  );
};

export default RiwayatTransaksiPage;
