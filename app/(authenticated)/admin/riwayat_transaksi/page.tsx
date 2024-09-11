'use client'; // Menandakan komponen ini sebagai Client Component

import React, { useState } from 'react';
import { DatePicker, Table, Button, FloatButton, Modal } from 'antd'; // Import komponen yang diperlukan
import 'antd/dist/reset.css'; // Pastikan Anda mengimpor CSS Ant Design

const { RangePicker } = DatePicker; // Gunakan RangePicker dari DatePicker

const RiwayatTransaksiPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const pageSize = 7; // Jumlah item per halaman

  const onChange = (dates: any, dateStrings: [string, string]) => {
    console.log('Tanggal Awal:', dateStrings[0], 'Tanggal Akhir:', dateStrings[1]);
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

  // Data dummy untuk tabel riwayat transaksi
  const data = [
    // Tambahkan lebih banyak data untuk pagination
    { key: '1', tanggal: '2024-09-05 14:30', jumlahItem: 5, metodePembayaran: 'Tunai', totalPembayaran: 'Rp 150.000' },
    { key: '2', tanggal: '2024-09-06 15:00', jumlahItem: 3, metodePembayaran: 'QRIS', totalPembayaran: 'Rp 100.000' },
    { key: '3', tanggal: '2024-09-07 16:00', jumlahItem: 7, metodePembayaran: 'Tunai', totalPembayaran: 'Rp 200.000' },
    { key: '4', tanggal: '2024-09-08 17:30', jumlahItem: 4, metodePembayaran: 'QRIS', totalPembayaran: 'Rp 120.000' },
    { key: '5', tanggal: '2024-09-09 18:00', jumlahItem: 6, metodePembayaran: 'Tunai', totalPembayaran: 'Rp 180.000' },
    { key: '6', tanggal: '2024-09-10 19:00', jumlahItem: 8, metodePembayaran: 'QRIS', totalPembayaran: 'Rp 220.000' },
    { key: '7', tanggal: '2024-09-11 20:00', jumlahItem: 2, metodePembayaran: 'Tunai', totalPembayaran: 'Rp 80.000' },
    { key: '8', tanggal: '2024-09-12 21:00', jumlahItem: 10, metodePembayaran: 'QRIS', totalPembayaran: 'Rp 250.000' },
    { key: '9', tanggal: '2024-09-13 22:00', jumlahItem: 4, metodePembayaran: 'Tunai', totalPembayaran: 'Rp 120.000' },
    // Tambahkan data lainnya sesuai kebutuhan
  ];

  // Kolom untuk tabel riwayat transaksi
  const columns = [
    {
      title: 'Tanggal & Waktu',
      dataIndex: 'tanggal',
      key: 'tanggal',
    },
    {
      title: 'Jumlah Item',
      dataIndex: 'jumlahItem',
      key: 'jumlahItem',
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'metodePembayaran',
      key: 'metodePembayaran',
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalPembayaran',
      key: 'totalPembayaran',
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (text: any, record: any) => (
        <Button onClick={() => showModal(record)}>Lihat</Button>
      ),
    },
  ];

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Menghitung data yang ditampilkan berdasarkan halaman saat ini
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="pt-1 pl-5 pb-5">
      <div className="flex items-center justify-between mb-4">
        {/* RangePicker untuk memilih tanggal awal dan akhir */}
        <div>
          <h3 className="text-sm mb-4">Pilih Tanggal</h3>
          <RangePicker onChange={onChange} className="mb-4" />
        </div>
        {/* FloatButton */}
        <FloatButton 
          tooltip={<div>Buka dengan Excel</div>} 
          style={{ position: 'relative', top: 0, right: 0}} 
        />
      </div>
      {/* Tabel riwayat transaksi */}
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

      {/* Modal untuk menampilkan detail transaksi */}
      <Modal
        title="Detail Transaksi"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedTransaction ? (
          <div>
            <p><strong>Tanggal & Waktu:</strong> {selectedTransaction.tanggal}</p>
            <p><strong>Jumlah Item:</strong> {selectedTransaction.jumlahItem}</p>
            <p><strong>Metode Pembayaran:</strong> {selectedTransaction.metodePembayaran}</p>
            <p><strong>Total Pembayaran:</strong> {selectedTransaction.totalPembayaran}</p>
          </div>
        ) : (
          <p>Tidak ada detail yang tersedia.</p>
        )}
      </Modal>
    </div>
  );
};

export default RiwayatTransaksiPage;
