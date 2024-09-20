"use client";

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
}

const KasirPage: React.FC = () => {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editKasirId, setEditKasirId] = useState<string | null>(null); // Track ID for edit
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing or adding

  useEffect(() => {
    // Fetch kasir list from API
    axios
      .get("http://localhost:3222/users/kasir")
      .then((response) => {
        setKasirList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching kasir:", error);
        message.error("Terjadi kesalahan saat mengambil data kasir.");
      });
  }, []);

  const handleAddKasir = async (values: any) => {
    try {
      await axios.post("http://localhost:3222/users/tambah-kasir", values);
      message.success("Kasir berhasil ditambahkan!");
      setIsModalVisible(false);
      form.resetFields();
      // Fetch updated kasir list
      const response = await axios.get("http://localhost:3222/users/kasir");
      setKasirList(response.data.data);
    } catch (error: any) {
      console.error("Error adding kasir:", error);
      message.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan kasir."
      );
    }
  };

  const handleEditKasir = async (values: any) => {
    if (!editKasirId) return;
    try {
      await axios.put(`http://localhost:3222/users/edit-kasir/${editKasirId}`, {
        status: values.status,
      });
      message.success("Status kasir berhasil diubah!");
      setIsModalVisible(false);
      form.resetFields();
      // Fetch updated kasir list
      const response = await axios.get("http://localhost:3222/users/kasir");
      setKasirList(response.data.data);
    } catch (error: any) {
      console.error("Error editing kasir:", error);
      message.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengedit status kasir."
      );
    }
  };

  const openEditModal = (kasir: Kasir) => {
    setIsEditMode(true); // Set mode to edit
    setIsModalVisible(true);
    setEditKasirId(kasir.id_kasir);
    form.setFieldsValue({
      status: kasir.status,
    });
  };

  return (
    <div className="p-4 mr-20 ml-64">
      <div className="flex justify-between items-center mb-4">
        <Button
          type="primary"
          onClick={() => {
            setEditKasirId(null); // Clear edit mode
            setIsEditMode(false); // Set mode to add
            setIsModalVisible(true);
            form.resetFields(); // Reset form for adding a new kasir
          }}
          className="bg-blue-500 text-white"
        >
          Tambah Kasir
        </Button>
      </div>

      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left font-semibold">No</th>
            <th className="py-3 px-20 text-left font-semibold">Nama</th>
            <th className="py-3 px-24 text-left font-semibold">Email</th>{" "}
            {/* Tambahkan kolom email */}
            <th className="py-3 px-16 text-left font-semibold">Status</th>
            <th className="py-3 px-6 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {kasirList.map((kasir, index) => (
            <tr key={kasir.id_kasir}>
              <td className="py-3 px-6 text-left w-16">{index + 1}</td>
              <td className="py-3 px-20 text-left">{kasir.nama_kasir}</td>
              <td className="py-3 px-24 text-left">{kasir.email_kasir}</td>{" "}
              {/* Tampilkan email */}
              <td
                className={`py-3 px-16 text-left ${
                  kasir.status === StatusEnum.ACTIVE
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {kasir.status}
              </td>
              <td className="py-3 px-6 text-left">
                <Button type="primary" onClick={() => openEditModal(kasir)}>
                  Edit Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding or Editing Kasir */}
      <Modal
        title={editKasirId ? "Edit Status Kasir" : "Tambah Kasir"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editKasirId ? handleEditKasir : handleAddKasir}
        >
          <div className="flex justify-between">
            {/* Nama Kasir - hanya ditampilkan saat tambah kasir */}
            {!isEditMode && (
              <Form.Item
                name="nama"
                label="Nama"
                rules={[{ required: true, message: "Nama kasir harus diisi!" }]}
                style={{ width: "48%" }} // Atur lebar untuk box pertama
              >
                <Input />
              </Form.Item>
            )}

            {/* Email Kasir */}
            {!isEditMode && (
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email kasir harus valid!",
                  },
                ]}
                style={{ width: "48%" }} // Atur lebar untuk box kedua
              >
                <Input />
              </Form.Item>
            )}
          </div>

          <div className="flex justify-between">
            {/* Status Kasir */}
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Status kasir harus diisi!" }]}
              style={{ width: "48%" }} // Atur lebar untuk box ketiga
            >
              <Select>
                {Object.entries(StatusEnum).map(([key, value]) => (
                  <Select.Option key={key} value={value}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Kosongkan sebelahnya untuk simetri */}
            <div style={{ width: "48%" }}></div>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editKasirId ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KasirPage;
