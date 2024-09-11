'use client'; // Menandakan komponen ini sebagai Client Component

import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form } from 'antd'; // Import komponen Modal, Input, dan Form dari Ant Design
import { PlusOutlined } from '@ant-design/icons'; // Import icon Plus dari Ant Design
import 'antd/dist/reset.css'; // Pastikan Anda mengimpor CSS Ant Design
import axios from 'axios'; // Import Axios

const KategoriPage = () => {
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Menambahkan state loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk visibilitas modal
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false); // State untuk visibilitas modal tambah
  const [currentNama, setCurrentNama] = useState<string>(''); // State untuk menyimpan nama kategori yang sedang diedit
  const [form] = Form.useForm(); // Form instance dari Ant Design

  useEffect(() => {
    // Ambil data dari API
    axios.get('http://localhost:3222/kategori')
      .then((response) => {
        // Asumsi data yang diterima adalah array dengan objek yang memiliki nama kategori
        setKategori(response.data.data || []); 
        setLoading(false); // Set loading menjadi false setelah data diterima
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading menjadi false jika ada error
      });
  }, []);

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
          })
          .catch((error) => {
            console.error('Error updating data:', error.response?.data || error.message);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  
  const handleOkAdd = () => {
    // Kirim data kategori baru ke API
    form.validateFields()
      .then((values) => {
        axios.post('http://localhost:3222/kategori', { nama: values.nama })
          .then((response) => {
            setKategori((prevKategori) => [...prevKategori, response.data]);
            setIsAddModalVisible(false); // Sembunyikan modal setelah berhasil
          })
          .catch((error) => {
            console.error('Error adding data:', error);
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
    <div className="mt-3 flex justify-center">
      <div className="relative w-full max-w-7xl">
        {/* Button Tambah */}
        <div className="flex justify-start mt-2"> {/* Ubah justify-end menjadi justify-start */}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="flex items-center gap-1"
            onClick={handleAddClick} // Tampilkan modal tambah saat diklik
            style={{
              backgroundColor: '#3B8394', // Warna latar belakang
              borderColor: '#3B8394', // Warna border
              color: '#fff', // Warna teks
              borderRadius: '12px', // Radius border
              padding: '10px 20px', // Padding
              transition: 'background-color 0.1s, border-color 0.3s', // Transisi
            }}
          >
            Tambah
          </Button>
        </div>

        {/* Tabel Kategori */}
        <div className="mt-5 overflow-x-auto">
  <table className="min-w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <th className="py-3 px-6 text-left font-semibold border border-gray-300 w-16">No</th> {/* Mengatur lebar kolom No */}
        <th className="py-3 px-6 text-left font-semibold border border-gray-300">Nama Kategori</th>
        <th className="py-3 px-6 text-left font-semibold border border-gray-300">Aksi</th>
      </tr>
    </thead>
    <tbody className="text-gray-700 text-sm">
      {kategori.length > 0 ? (
        kategori.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100 transition duration-200">
            <td className="py-3 px-6 text-left border border-gray-300 w-16">{index + 1}</td> {/* Menyesuaikan juga pada tbody */}
            <td className="py-3 px-6 text-left border border-gray-300">{item.nama}</td>
            <td className="py-3 px-6 text-left border border-gray-300">
              <a
                href="#"
                onClick={() => handleEditClick(item.nama)}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Edit
              </a>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} className="py-3 px-6 text-center text-gray-500">
            Tidak ada data
          </td>
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
              backgroundColor: '#3B8394', // Warna latar belakang tombol "Simpan"
              borderColor: '#3B8394', // Warna border tombol "Simpan"
              color: '#fff', // Warna teks tombol "Simpan"
            },
          }}
          cancelButtonProps={{
            style: {
              borderColor: '#3B8394', // Warna border tombol "Batal"
              color: '#000', // Warna teks tombol "Batal"
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ nama: currentNama }}
          >
            <Form.Item
              name="nama"
              label="Nama Kategori"
              rules={[{ required: true, message: 'Masukkan nama kategori' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Tambah Kategori */}
        <Modal
          title="Tambah Kategori"
          visible={isAddModalVisible}
          onOk={handleOkAdd}
          onCancel={handleCancel}
          okText="Simpan"
          cancelText="Batal"
          okButtonProps={{
            style: {
              backgroundColor: '#3B8394', // Warna latar belakang tombol "Simpan"
              borderColor: '#3B8394', // Warna border tombol "Simpan"
              color: '#fff', // Warna teks tombol "Simpan"
            },
          }}
          cancelButtonProps={{
            style: {
              borderColor: '#d9d9d9', // Warna border tombol "Batal"
              color: '#000', // Warna teks tombol "Batal"
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
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default KategoriPage;
