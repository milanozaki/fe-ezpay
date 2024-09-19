'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd'; // Import Button dari Ant Design

// Tipe data untuk item tabel
interface TableData {
  id_toko: string;
  nama_toko: string;
  deskripsi_toko?: string;
  alamat_toko: string;
  tanggal: string;
  foto?: string; // Optional
  user: {
    nama: string;
    email: string;
    no_handphone: string;
  }
}

const InboxPage = () => {
  const [data, setData] = useState<TableData[]>([]); // State untuk menyimpan data tabel
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading
  const [error, setError] = useState<string | null>(null); // State untuk error
  const [selectedToko, setSelectedToko] = useState<TableData | null>(null); // State untuk detail toko
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3222/toko/daftar');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result); // Cek apakah data user sudah ada
        setData(result.map((item: any) => ({
          id_toko: item.id_toko,
          tanggal: item.createdAt,
          nama_toko: item.nama_toko,
          deskripsi_toko: item.deskripsi_toko,
          alamat_toko: item.alamat_toko,
          foto: item.foto,
          user: {
            nama: item.user?.nama || '',
            email: item.user?.email || '',
            no_handphone: item.user?.no_handphone || '',
          },
        })));
        
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDetailClick = (item: TableData) => {
    console.log('Detail Clicked:', item); // Debugging
    setSelectedToko(item);
    setIsModalVisible(true);
  };

  const handleTolak = async () => {
    if (selectedToko) {
      try {
        const response = await fetch(`http://localhost:3222/toko/register/${selectedToko.id_toko}/reject`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Tolak request failed: ${response.statusText}`);
        }
        setIsModalVisible(false);
        alert('Toko ditolak');
      } catch (error: any) {
        console.error('Error during reject request:', error); // Debugging
        alert(error.message);
      }
    }
  };
  

  const handleTerima = async () => {
    if (selectedToko) {
      try {
        const response = await fetch(`http://localhost:3222/toko/register/${selectedToko.id_toko}/approve`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Terima request failed: ${response.statusText}`);
        }
        setIsModalVisible(false);
        alert('Toko diterima');
      } catch (error: any) {
        console.error('Error during approve request:', error); // Debugging
        alert(error.message);
      }
    }
  };
  

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md relative">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">Pesan</th>
            <th className="py-2 px-4 text-left">Tanggal</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id_toko} className="border-b relative">
              <td className="py-2 px-4 relative">
                {/* Pin merah bulat di bagian kiri atas */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></div>
                PERMINTAAN Pembuatan Toko Baru
              </td>
              <td className="py-2 px-4">{item.tanggal}</td>
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
            <Button onClick={handleTolak} style={{ backgroundColor: 'red', color: 'white' }} className="mr-2">
              Tolak
            </Button>
            <Button onClick={handleTerima} style={{ backgroundColor: 'blue', color: 'white' }} type="primary">
              Terima
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

export default InboxPage;