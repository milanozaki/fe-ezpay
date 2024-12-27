'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css'; // Pastikan CSS Ant Design diimpor

const KategoriPage: React.FC = () => {
  const [kategori, setKategori] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); 
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [currentNama, setCurrentNama] = useState<string>(''); 
  const [currentIdKategori, setCurrentIdKategori] = useState<string | null>(null); // Gunakan tipe string
  const [form] = Form.useForm();

  useEffect(() => {
    const idToko = localStorage.getItem('id_toko');

    if (!idToko) {
      notification.error({
        message: 'Error',
        description: 'ID Toko tidak ditemukan di localStorage.',
      });
      setLoading(false);
      return;
    }

    const fetchKategoriByToko = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3222/kategori/kategori-by-toko?id_toko=${encodeURIComponent(idToko)}`
        );
        console.log('Data Kategori:', response.data);
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

  const handleEditClick = (idKategori: string, nama: string) => {
    console.log('ID Kategori:', idKategori);
    setCurrentIdKategori(idKategori); 
    setCurrentNama(nama); 
    form.setFieldsValue({ nama }); 
    setIsModalVisible(true); 
  };

  const handleOkEdit = () => {
    if (!currentIdKategori) {
      notification.error({
        message: 'Gagal',
        description: 'ID Kategori tidak valid.',
      });
      return;
    }

    form.validateFields().then((values) => {
      axios
        .put(`http://localhost:3222/kategori/update/${currentIdKategori}`, {
          namaBaru: values.nama,
        })
        .then(() => {
          setKategori((prevKategori) =>
            prevKategori.map((item) =>
              item.idKategori === currentIdKategori
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
          const nama = { ...response.data.data, jumlahProduk: 0 };
          setKategori((prevKategori) => [...prevKategori, nama]);
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
            style={{ backgroundColor: '#3B8394', borderRadius: '12px', padding: '10px 20px' }}
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
                  <tr key={item.idKategori} className="hover:bg-gray-100">
                    <td className="py-3 px-6 text-center w-16">{index + 1}.</td>
                    <td className="py-3 px-6 text-center">{item.kategori}</td>
                    <td className="py-3 px-6 text-center">{item.jumlahProduk}</td>
                    <td className="py-3 px-6 text-center">
                      <Button onClick={() => handleEditClick(item.idKategori, item.kategori)} type="link">
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
