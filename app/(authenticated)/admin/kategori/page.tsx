'use client'; // Menandakan komponen ini sebagai Client Component

import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form, notification } from 'antd'; // Import notification dari Ant Design
import { PlusOutlined } from '@ant-design/icons'; // Import icon Plus dari Ant Design
import 'antd/dist/reset.css'; // Pastikan Anda mengimpor CSS Ant Design
import axios from 'axios'; // Import Axios

const KategoriPage = () => {
  const [kategori, setKategori] = useState<any[]>([]); // State untuk menyimpan data kategori
  const [loading, setLoading] = useState<boolean>(true); // State loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State untuk visibilitas modal edit
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false); // State modal tambah kategori
  const [currentNama, setCurrentNama] = useState<string>(''); // Nama kategori saat ini
  const [currentIdKategori, setCurrentIdKategori] = useState<number | null>(null); // ID kategori saat ini
  const [form] = Form.useForm(); // Form instance dari Ant Design

  useEffect(() => {
    const idToko = localStorage.getItem('id_toko'); // Ambil id_toko dari local storage

    if (!idToko) {
      notification.error({
        message: 'Error',
        description: 'ID Toko tidak ditemukan di local storage.',
      });
      setLoading(false);
      return;
    }

    const fetchKategoriByToko = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3222/kategori/kategori-by-toko?id_toko=${encodeURIComponent(idToko)}`
        );
        setKategori(response.data.data || []);
      } catch (error: any) {
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

  const handleEditClick = (id: number, nama: string) => {
    setCurrentIdKategori(id); // Simpan ID kategori
    setCurrentNama(nama); // Simpan nama kategori
    form.setFieldsValue({ nama }); // Isi form dengan nama kategori
    setIsModalVisible(true); // Tampilkan modal edit
  };

  const handleOkEdit = () => {
    form.validateFields().then((values) => {
      axios
        .put(`http://localhost:3222/kategori/update/${encodeURIComponent(currentIdKategori!)}`, {
          namaBaru: values.nama,
        })
        .then(() => {
          setKategori((prevKategori) =>
            prevKategori.map((item) =>
              item.id_kategori === currentIdKategori
                ? { ...item, kategori: values.nama }
                : item
            )
          );
          setIsModalVisible(false);
          notification.success({
            message: 'Berhasil',
            description: 'Kategori berhasil diedit.',
            duration: 3,
          });
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          notification.error({
            message: 'Gagal',
            description: error.response?.data?.message || 'Gagal memperbarui kategori.',
          });
        });
    });
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleOkAdd = () => {
    const idToko = localStorage.getItem('id_toko');

    if (!idToko) {
      notification.error({
        message: 'Gagal',
        description: 'ID Toko tidak ditemukan.',
        duration: 3,
      });
      return;
    }

    form.validateFields().then((values) => {
      axios
        .post(`http://localhost:3222/kategori?id_toko=${encodeURIComponent(idToko)}`, {
          nama: values.nama,
        })
        .then((response) => {
          const newKategori = { nama: response.data.data.nama, jumlahProduk: 0 };
          setKategori((prevKategori) => [...prevKategori, newKategori]);
          setIsAddModalVisible(false);
          notification.success({
            message: 'Berhasil',
            description: 'Kategori berhasil ditambahkan.',
            duration: 3,
          });
        })
        .catch((error) => {
          console.error('Error adding data:', error);
          notification.error({
            message: 'Gagal',
            description: error.response?.data?.message || 'Gagal menambahkan kategori.',
          });
        });
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-3 flex justify-center mr-20 ml-64">
      <div className="relative w-full max-w-7xl">
        <div className="flex justify-start mt-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            style={{
              backgroundColor: '#3B8394',
              borderRadius: '12px',
              padding: '10px 20px',
            }}
          >
            Tambah
          </Button>
        </div>

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
                  <tr key={item.id_kategori} className="hover:bg-gray-100">
                    <td className="py-3 px-6 text-center w-16">{index + 1}.</td>
                    <td className="py-3 px-6 text-center">{item.kategori}</td>
                    <td className="py-3 px-6 text-center">{item.jumlahProduk}</td>
                    <td className="py-3 px-6 text-center">
                      <Button
                        onClick={() => handleEditClick(item.id_kategori, item.kategori)}
                        type="link"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-3 px-6 text-center">
                    Tidak ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          title="Edit Kategori"
          visible={isModalVisible}
          onOk={handleOkEdit}
          onCancel={handleCancel}
          okText="Simpan"
          cancelText="Batal"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nama"
              label="Nama Kategori"
              rules={[{ required: true, message: 'Masukkan nama kategori' }]}
            >
              <Input placeholder="Masukkan nama kategori" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Tambah Kategori"
          visible={isAddModalVisible}
          onOk={handleOkAdd}
          onCancel={handleCancel}
          okText="Tambah"
          cancelText="Batal"
        >
          <Form form={form} layout="vertical">
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
