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
  id_user: string;
  nama: string;
  status: StatusEnum;
  email: string;
  lastLogin: string | null;
}

const KasirPage: React.FC = () => {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editKasirId, setEditKasirId] = useState<string | null>(null); // Track ID for edit
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing or adding

  useEffect(() => {
    const fetchKasirUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3222/users/kasir");
        console.log("Fetched kasir users:", response.data); // Log the response
        // Check if the data is in the correct structure
        setKasirList(response.data); // Adjust this if needed based on the API response
      } catch (error) {
        console.error("Error fetching kasir:", error);
        message.error("Terjadi kesalahan saat mengambil data kasir.");
      }
    };

    fetchKasirUsers();
  }, []);

  const handleAddKasir = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3222/users/tambah-kasir",
        values
      );
      message.success("Kasir berhasil ditambahkan!");
      setIsModalVisible(false);
      form.resetFields();

      // Update kasir list without refetching
      setKasirList((prevKasirList) => [
        ...prevKasirList,
        {
          id_user: response.data.id_user, // Assuming your backend returns the new kasir ID
          nama: values.nama,
          email: values.email,
          status: values.status,
          lastLogin: null, // Default or adjust as needed
        },
      ]);
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

      // Update kasir list without refetching
      setKasirList((prevKasirList) =>
        prevKasirList.map((kasir) =>
          kasir.id_user === editKasirId
            ? { ...kasir, status: values.status }
            : kasir
        )
      );
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
    setEditKasirId(kasir.id_user);
    form.setFieldsValue({
      status: kasir.status,
    });
  };

  const timeAgo = (
    lastLogin: string | null
  ): { status: string; isOnline: boolean } => {
    if (!lastLogin) return { status: "Belum login", isOnline: false }; // Handle null case

    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastLoginDate.getTime()) / 1000
    );

    // Check if the kasir is online (logged in within the last 10 minutes)
    if (diffInSeconds <= 600) {
      return { status: "Online", isOnline: true }; // Display "Online" if within the last 10 minutes
    }

    let timeString = "";

    if (diffInSeconds < 60) {
      timeString = `${diffInSeconds} detik yang lalu`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      timeString = `${minutes} menit yang lalu`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      timeString = `${hours} jam yang lalu`;
    }

    return { status: timeString, isOnline: false };
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
          style={{
            backgroundColor: "#3B8394",
            color: "#fff",
            borderRadius: "12px",
          }}
        >
          + Tambah Kasir
        </Button>
      </div>

      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left font-semibold">No</th>
            <th className="py-3 px-10 text-left font-semibold">Nama</th>
            <th className="py-3 px-10 text-left font-semibold">Email</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-16 text-left font-semibold">
              Terakhir Login
            </th>
            <th className="py-3 px-12 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(kasirList) && kasirList.length > 0 ? (
            kasirList.map((kasir, index) => {
              const { status, isOnline } = timeAgo(kasir.lastLogin); // Get status and online check
              return (
                <tr key={kasir.id_user}>
                  <td className="py-3 px-7 text-left w-16">{index + 1}</td>
                  <td className="py-3 px-10 text-left">{kasir.nama}</td>
                  <td className="py-3 px-2 text-left">{kasir.email}</td>
                  <td
                    className={`py-2 px-2 text-left flex items-center gap-2 mt-2 mb-2 ${
                      kasir.status === StatusEnum.ACTIVE
                        ? " text-green-600"
                        : " text-red-600"
                    }`}
                    style={{
                      borderRadius: "8px", // Tambahkan border radius agar tampilan lebih halus
                    }}
                  >
                    {/* Dot untuk menunjukkan status */}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        kasir.status === StatusEnum.ACTIVE ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {/* Tampilkan status */}
                    {kasir.status}
                  </td>
                  <td
                    className={`py-3 px-16 text-left ${
                      isOnline ? "text-green-600" : "text-black"
                    }`}
                  >
                    {status} {/* Updated to use the status */}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <Button type="primary" onClick={() => openEditModal(kasir)}>
                      Edit Status
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="py-3 px-6 text-center">
                Tidak ada kasir ditemukan
              </td>
            </tr>
          )}
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