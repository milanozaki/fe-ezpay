"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Input, Select, Card, Pagination } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

// Custom style for the Save button
const saveButtonStyle = {
  backgroundColor: "#3B8394", // Ganti dengan warna yang diinginkan
  borderColor: "#3B8394", // Ganti dengan warna border yang diinginkan
  color: "#fff", // Warna teks
  borderRadius: "4px", // Radius border
};

// Custom style for the Cancel button
const cancelButtonStyle = {
  backgroundColor: "#fff", // Ganti dengan warna yang diinginkan
  borderColor: "#3B8394", // Ganti dengan warna border yang diinginkan
  color: "#3B8394", // Warna teks
  borderRadius: "4px", // Radius border
};

// Custom style for the Add button
const addButtonStyle = {
  backgroundColor: "#3B8394", // Warna latar belakang
  borderColor: "#3B8394", // Warna border
  color: "#fff", // Warna teks
  borderRadius: "12px", // Radius border
  padding: "10px 20px", // Padding
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.1s, border-color 0.3s", // Transisi
};

const ProdukPage = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false); // State untuk visibilitas modal tambah
  const [form] = Form.useForm(); // Form instance dari Ant Design
  const [categories, setCategories] = useState<string[]>([]); // State untuk kategori
  const [produk, setProduk] = useState<any[]>([]); // State untuk produk
  const [currentPage, setCurrentPage] = useState<number>(1); // State untuk halaman saat ini

  useEffect(() => {
    // Fetch categories from API
    axios
      .get("http://localhost:3222/kategori") // Ganti dengan endpoint API yang sesuai
      .then((response) => {
        // Asumsi response.data adalah array dari objek dengan properti "nama"
        const categoryData = response.data.data;
        if (Array.isArray(categoryData)) {
          const categoryNames = categoryData.map((item) => item.nama);
          setCategories(categoryNames);
        } else {
          console.error("Data from API is not in expected format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch produk from API
    axios
      .get("http://localhost:3222/produk/all") // Ganti dengan endpoint API yang sesuai
      .then((response) => {
        // Asumsi response.data adalah array dari objek produk
        const produkData = response.data.data;
        console.log("Produk data:", produkData); // Debugging log
        if (Array.isArray(produkData)) {
          setProduk(produkData);
        } else {
          console.error("Data from API is not in expected format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching produk:", error);
      });
  }, []);

  const handleAddClick = () => {
    form.resetFields(); // Reset form
    setIsAddModalVisible(true); // Tampilkan modal tambah
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        // Handle form submission
        setIsAddModalVisible(false); // Sembunyikan modal setelah submit
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsAddModalVisible(false); // Sembunyikan modal
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Ubah halaman saat ini
  };

  return (
    <div className="p-4 mr-20 ml-64">
      {/* Container for button, search bar, and dropdown */}
      <div className="flex justify-between items-center mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClick} // Tampilkan modal tambah saat diklik
          style={addButtonStyle}
        >
          Tambah
        </Button>
        <div className="flex items-center">
          {/* Search Bar */}
          <Input
            placeholder="Cari..."
            prefix={<SearchOutlined />}
            style={{ width: 250, marginRight: 10 }}
          />

          {/* Dropdown */}
          <Select defaultValue="semua" style={{ width: 150 }}>
            <Select.Option value="semua">Semua</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {produk.map((item) => (
          <Card
            key={item.id}
            cover={<img alt={item.nama_produk} src={item.gambar_produk} />}
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => console.log(`Edit ${item.nama_produk}`)}
              />,
            ]}
          >
            <Card.Meta title={item.nama_produk} description={`${item.harga_produk} USD`} />
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        total={produk.length}
        pageSize={8}
        onChange={handlePageChange}
        className="flex justify-end"
      />

      <Modal
        title="Tambah Produk"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" style={cancelButtonStyle} onClick={handleCancel}>
            Batal
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            style={saveButtonStyle} // Terapkan gaya khusus di sini
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nama_produk"
            label="Nama Produk"
            rules={[{ required: true, message: "Silakan masukkan nama produk!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stok"
            label="Stok"
            rules={[{ required: true, message: "Silakan masukkan stok produk!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gambar_produk"
            label="Gambar Produk"
            rules={[{ required: true, message: "Silakan masukkan URL gambar produk!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status_produk"
            label="Status Produk"
            rules={[{ required: true, message: "Silakan pilih status produk!" }]}
          >
            <Select>
              <Select.Option value="aktif">Aktif</Select.Option>
              <Select.Option value="nonaktif">Nonaktif</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="satuan_produk"
            label="Satuan Produk"
            rules={[{ required: true, message: "Silakan masukkan satuan produk!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProdukPage;
