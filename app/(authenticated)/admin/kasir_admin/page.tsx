'use client';

import React, { useState, useEffect } from "react";
import { Button, message, Form, Input, Modal, Select } from "antd";
import axios from "axios";

// Define the enum
enum StatusEnum {
  ACTIVE = "aktif",
  INACTIVE = "tidak aktif",
}

interface Kasir {
  id_kasir: string;
  nama_kasir: string;
  status: StatusEnum;
  email_kasir: string;
  lastLogin: string | null;
}

const KasirPage: React.FC = () => {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editKasirId, setEditKasirId] = useState<string | null>(null); // Track ID for edit
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing or adding
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idToko = localStorage.getItem("id_toko");

    const fetchKasir = async () => {
      if (idToko) {
        try {
          const response = await axios.get(
            `http://localhost:3222/users/kasir?id_toko=${idToko}`
          );
          setKasirList(response.data.data);
        } catch (error) {
          message.error("Terjadi kesalahan saat mengambil data kasir");
        } finally {
          setLoading(false);
        }
      } else {
        message.error("ID Toko tidak ditemukan!");
        setLoading(false);
      }
    };

    fetchKasir();
  }, []); // Run once on mount

  if (loading) return <div>Loading...</div>;

  // Handle add kasir
  const handleAddKasir = async (values: any) => {
    try {
      const idToko = localStorage.getItem("id_toko");

      const response = await axios.post(
        `http://localhost:3222/users/tambah-kasir?id_toko=${idToko}`,
        values
      );

      message.success("Kasir berhasil ditambahkan!");
      setIsModalVisible(false);
      form.resetFields();

      // Update kasir list
      setKasirList((prevKasirList) => [
        ...prevKasirList,
        {
          id_kasir: response.data.id_kasir,
          nama_kasir: values.nama,
          email_kasir: values.email,
          status: values.status,
          lastLogin: null,
        },
      ]);
    } catch (error: unknown) {
      message.error("Terjadi kesalahan saat menambahkan kasir.");
    }
  };

// Open edit modal and capture id_kasir
const openEditModal = (kasir: Kasir) => {
  setIsEditMode(true); // Set mode to edit
  setIsModalVisible(true);
  setEditKasirId(kasir.id_kasir); // Capture and set the id_kasir
  form.setFieldsValue({
    nama: kasir.nama_kasir,
    email: kasir.email_kasir,
    status: kasir.status,
  });
};

// Handle edit kasir by using editKasirId in the PUT request URL
const handleEditKasir = async (values: any) => {
  if (!editKasirId) {
    message.error("ID kasir tidak ditemukan!");
    return;
  }

  try {
    // Send PUT request with captured editKasirId
    await axios.put(
      `http://localhost:3222/users/edit-kasir/${editKasirId}`, 
      values
    );

    message.success("Status kasir berhasil diubah!");
    setIsModalVisible(false);
    form.resetFields();

    // Update kasir list without refreshing the page
    setKasirList((prevKasirList) =>
      prevKasirList.map((kasir) =>
        kasir.id_kasir === editKasirId ? { ...kasir, status: values.status } : kasir
      )
    );
  } catch (error) {
    message.error("Terjadi kesalahan saat mengedit status kasir.");
  }
};


  // Open add modal
  const openAddModal = () => {
    setIsEditMode(false); // Set mode to add
    setIsModalVisible(true);
    form.resetFields(); // Reset form for adding a new kasir
  };

  return (
    <div className="p-4 mr-20 ml-64">
      <div className="flex justify-between items-center mb-4">
        <Button
          type="primary"
          onClick={openAddModal}  // Open the add modal
          className="bg-blue-500 text-white"
        >
          + Tambah Kasir
        </Button>
      </div>

      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left font-semibold">No</th>
            <th className="py-3 px-20 text-left font-semibold">Nama</th>
            <th className="py-3 px-24 text-left font-semibold">Email</th>
            <th className="py-3 px-16 text-left font-semibold">Status</th>
            <th className="py-3 px-6 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {kasirList.map((kasir, index) => (
            <tr key={kasir.id_kasir}>
              <td className="py-3 px-6 text-left w-16">{index + 1}</td>
              <td className="py-3 px-20 text-left">{kasir.nama_kasir}</td>
              <td className="py-3 px-24 text-left">{kasir.email_kasir}</td>
              <td
                className={`py-3 px-16 text-left ${kasir.status === StatusEnum.ACTIVE ? "text-green-600" : "text-red-600"}`}
              >
                {kasir.status}
              </td>
              <td className="py-3 px-6 text-left">
                <Button
                  type="primary"
                  onClick={() => openEditModal(kasir)}  // Open the edit modal
                >
                  Edit Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Kasir */}
      <Modal
        title="Tambah Kasir"
        visible={!isEditMode && isModalVisible} // Show this modal when adding kasir
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddKasir}  // Handle add kasir
        >
          {/* Nama Kasir */}
          <Form.Item
            name="nama"
            label="Nama"
            rules={[{ required: true, message: "Nama kasir harus diisi!" }]}

          >
            <Input />
          </Form.Item>

          {/* Email Kasir */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Email kasir harus valid!" }]}
          >
            <Input />
          </Form.Item>

          {/* Status Kasir */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status harus dipilih!" }]}
          >
            <Select>
              <Select.Option value={StatusEnum.ACTIVE}>Aktif</Select.Option>
              <Select.Option value={StatusEnum.INACTIVE}>Tidak Aktif</Select.Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tambah Kasir
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Editing Kasir */}
      <Modal
        title="Edit Status Kasir"
        visible={isEditMode && isModalVisible} // Tampilkan modal hanya jika mode edit
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditKasir}  // Handle edit kasir
        >
          {/* Nama Kasir */}
          <Form.Item
            name="nama"
            label="Nama"
            rules={[{ required: true, message: "Nama kasir harus diisi!" }]}
          >
            <Input />
          </Form.Item>

          {/* Email Kasir */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Email kasir harus valid!" }]}
          >
            <Input />
          </Form.Item>

          {/* Status Kasir */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status harus dipilih!" }]}
          >
            <Select>
              <Select.Option value={StatusEnum.ACTIVE}>Aktif</Select.Option>
              <Select.Option value={StatusEnum.INACTIVE}>Tidak Aktif</Select.Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KasirPage;
