'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd'; // Menggunakan Ant Design untuk modal

// Tipe data untuk item tabel
interface TableData {
  id_toko: string;
  nama_toko: string;
  deskripsi_toko?: string;
  alamat_toko: string;
  foto?: string; // Optional
  user: {
    nama: string;
    email: string;
    no_handphone: string;
  }
}

const KelolaAkunpage = () => {
  const [data, setData] = useState<TableData[]>([]); // State untuk menyimpan data tabel
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading
  const [error, setError] = useState<string | null>(null); // State untuk error
  const [selectedToko, setSelectedToko] = useState<TableData | null>(null); // State untuk detail toko
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk modal

  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchData = async () => {
      setLoading(true); // Set loading true saat fetch data
      setError(null); // Reset error saat memulai fetch
      try {
        const response = await fetch('http://localhost:3222/toko/approved'); // Ganti dengan endpoint API Anda
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        setError(error.message);
        setData([]); // Reset data jika ada error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = (item: TableData) => {
    setSelectedToko(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">No</th>
            <th className="py-2 px-4 text-left">Nama Toko</th>
            <th className="py-2 px-4 text-left">Pemilik</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
  {data.map((item, index) => (
    <tr key={item.id_toko} className="border-b">
      <td className="py-2 px-4">{index + 1 + "."}</td>
      <td className="py-2 px-4">{item.nama_toko}</td>
      <td className="py-2 px-4">
        {item.user ? item.user.nama : 'Tidak ada data'}
      </td>
      <td className="py-2 px-4">
        {item.user ? item.user.email : 'Tidak ada data'}
      </td>
      <td className="py-2 px-4">
        <a
          onClick={() => handleDetailClick(item)}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Detail
        </a>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Modal untuk menampilkan detail toko */}
      <Modal
        title={selectedToko?.nama_toko || 'Detail Toko'}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={
          <div className="flex justify-end">
            <Button onClick={handleCloseModal} type="primary">
              Tutup
            </Button>
          </div>
        }
        width={600}
      >
        {selectedToko ? (
          <div className="p-4">
            {selectedToko.foto && (
              <img 
                src={selectedToko.foto} 
                alt={selectedToko.nama_toko} 
                className="w-full max-w-md mb-4" 
              />
            )}
            <p><strong>Pemilik:</strong> {selectedToko.user.nama}</p>
            <p><strong>Email:</strong> {selectedToko.user.email}</p>
            <p><strong>No Handphone:</strong> {selectedToko.user.no_handphone}</p>
            <p><strong>Alamat:</strong> {selectedToko.alamat_toko}</p>
            <p><strong>Deskripsi:</strong> {selectedToko.deskripsi_toko}</p>
          </div>
        ) : (
          <div>Loading detail...</div>
        )}
      </Modal>
    </div>
  );
};

export default KelolaAkunpage;
