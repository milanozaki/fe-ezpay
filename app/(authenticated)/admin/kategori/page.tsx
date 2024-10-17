'use client'; // Menandakan komponen ini sebagai Client Component

import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form, notification } from 'antd'; // Import notification dari Ant Design
import { PlusOutlined } from '@ant-design/icons'; // Import icon Plus dari Ant Design
import 'antd/dist/reset.css'; // Pastikan Anda mengimpor CSS Ant Design
import axios from 'axios'; // Import Axios

const KategoriPage = () => {
  const [kategori, setKategori] = useState<any[]>([]); // State untuk menyimpan data kategori
  const [loading, setLoading] = useState<boolean>(true); // Menambahkan state loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk visibilitas modal
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false); // State untuk visibilitas modal tambah
  const [currentNama, setCurrentNama] = useState<string>(''); // State untuk menyimpan nama kategori yang sedang diedit
  const [idToko, setIdToko] = useState<string>(''); // State untuk menyimpan id_toko
  const [form] = Form.useForm(); // Form instance dari Ant Design

  useEffect(() => {
    // Mengambil id_toko dari local storage
    const idToko = localStorage.getItem('id_toko'); // Pastikan ID toko disimpan di local storage

    if (!idToko) {
      notification.error({
        message: 'Error',
        description: 'ID Toko tidak ditemukan di local storage.',
      });
      setLoading(false);
      return;
    }

    // Ambil data kategori berdasarkan id_toko
    const fetchKategoriByToko = async () => {
      try {
        const response = await axios.get(`http://localhost:3222/kategori/kategori-by-toko?id_toko=${encodeURIComponent(idToko)}`);
        setKategori(response.data.data || []);
      } catch (error: any) { // Use 'any' to specify that error can be of any type
        console.error('Error fetching kategori:', error);
        notification.error({
          message: 'Error',
          description: error.response?.data?.message || 'Gagal mengambil kategori.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKategoriByToko();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading
  }

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading
  }

  const handleEditClick = (namaKategori: string) => {
    setCurrentNama(namaKategori); // Set nama kategori yang akan diedit
    form.setFieldsValue({ nama: namaKategori }); // Set nilai form
    setIsModalVisible(true); // Tampilkan modal
  };

  const handleAddClick = () => {
    form.resetFields(); // Reset form
    setIsAddModalVisible(true); // Tampilkan modal tambah
  };

  const handleOkEdit = () => {
    form.validateFields()
      .then((values) => {
        axios.put(`http://localhost:3222/kategori/update/${encodeURIComponent(currentNama)}`, { namaBaru: values.nama })
          .then(() => {
            // Update kategori setelah berhasil
            setKategori((prevKategori) =>
              prevKategori.map((item) =>
                item.nama === currentNama ? { ...item, nama: values.nama } : item
              )
            );
            setIsModalVisible(false); // Sembunyikan modal setelah berhasil
            
            // Tampilkan notifikasi setelah edit berhasil
            notification.success({
              message: 'Berhasil',
              description: 'Kategori berhasil diedit.',
              duration: 3, // Durasi dalam detik
            });
          })
          .catch((error) => {
            // Menangani kesalahan pada permintaan
            console.error('Error updating data:', error.response?.data || error.message);
            notification.error({
              message: 'Gagal',
              description: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui kategori.',
              duration: 3,
            });
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleOkAdd = () => {
    // Ambil id_toko dari local storage
    const idToko = localStorage.getItem('id_toko');
  
    // Validasi id_toko
    if (!idToko) {
      notification.error({
        message: 'Gagal',
        description: 'ID Toko tidak ditemukan. Silakan coba lagi.',
        duration: 3,
      });
      return;
    }
  
    form.validateFields()
      .then((values) => {
        axios.post(`http://localhost:3222/kategori?id_toko=${encodeURIComponent(idToko)}`, { nama: values.nama })
          .then((response) => {
            // Pastikan response.data mengandung data kategori yang baru ditambahkan
            const newKategori = { nama: response.data.data.nama, jumlahProduk: 0 }; // Ambil nama dari response
            setKategori((prevKategori) => [...prevKategori, newKategori]);
            setIsAddModalVisible(false); // Sembunyikan modal setelah berhasil
            
            // Tampilkan notifikasi setelah tambah berhasil
            notification.success({
              message: 'Berhasil',
              description: 'Kategori berhasil ditambahkan.',
              duration: 3, // Durasi dalam detik
            });
          })
          .catch((error) => {
            console.error('Error adding data:', error.response?.data || error.message);
            notification.error({
              message: 'Gagal',
              description: error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori.',
              duration: 3,
            });
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  

  const handleCancel = () => {
    setIsModalVisible(false); // Sembunyikan modal
    setIsAddModalVisible(false); // Sembunyikan modal tambah
  };

  if (loading) {
    return <div className="text-center">Loading...</div>; // Menampilkan pesan loading saat data sedang di-fetch
  }

  return (
    <div className="mt-3 flex justify-center mr-20 ml-64">
      <div className="relative w-full max-w-7xl">
        {/* Button Tambah */}
        <div className="flex justify-start mt-2">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="flex items-center gap-1"
            onClick={handleAddClick}
            style={{
              backgroundColor: '#3B8394',
              borderColor: 'blue-500',
              color: '#fff',
              borderRadius: '12px',
              padding: '10px 20px',
              transition: 'background-color 0.1s, border-color 0.3s',
            }}
          >
            Tambah
          </Button>
        </div>

        {/* Tabel Kategori */}
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full bg-white border-collapse rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center font-semibold w-16">No</th>
                <th className="py-3 px-6 text-center font-semibold">Nama Kategori</th>
                <th className="py-3 px-6 text-center font-semibold">Jumlah Produk</th>
                <th className="py-3 px-6 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
        {kategori.length > 0 ? (
          kategori.map((item, index) => (
            <tr key={item.id_kategori} className="hover:bg-gray-100 transition duration-200">
              <td className="py-3 px-6 text-center w-16">{index + 1}.</td>
              <td className="py-3 px-6 text-center">{item.kategori}</td> {/* Assuming you have kategori property */}
              <td className="py-3 px-6 text-center">{item.jumlahProduk}</td>
              <td className="py-3 px-6 text-center">
                <Button onClick={() => handleEditClick(item.id_kategori)} type="link">Edit</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="py-3 px-6 text-center">Tidak ada kategori</td>
          </tr>
        )}
      </tbody>
          </table>
        </div>

        {/* Modal Edit Kategori */}
        <Modal
          title="Edit Kategori"
          visible={isModalVisible}
          onOk={handleOkEdit}
          onCancel={handleCancel}
          okText="Simpan"
          cancelText="Batal"
          okButtonProps={{
            style: {
              backgroundColor: '#3B8394',
              borderColor: '#3B8394',
              color: '#fff',
            },
          }}
          cancelButtonProps={{
            style: {
              borderColor: '#3B8394',
              color: '#000',
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="nama"
              label="Nama Kategori"
              rules={[{ required: true, message: 'Masukkan nama kategori' }]}
            >
              <Input placeholder="Masukkan nama kategori" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Tambah Kategori */}
        <Modal
          title="Tambah Kategori"
          visible={isAddModalVisible}
          onOk={handleOkAdd}
          onCancel={handleCancel}
          okText="Tambah"
          cancelText="Batal"
          okButtonProps={{
            style: {
              backgroundColor: '#3B8394',
              borderColor: '#3B8394',
              color: '#fff',
            },
          }}
          cancelButtonProps={{
            style: {
              borderColor: '#3B8394',
              color: '#000',
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="nama"
              label="Nama Kategori"
              rules={[{ required: true, message: 'Masukkan nama kategori' }]}
            >
              <Input placeholder="Masukkan nama kategori" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default KategoriPage;
