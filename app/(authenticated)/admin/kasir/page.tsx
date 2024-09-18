"use client";
import React, { useState, useEffect } from "react";
import { Button, message, Form, Input, Modal, Select } from "antd";
import axios from "axios";

// Define the enum
enum StatusEnum {
  ACTIVE = 'aktif',
  INACTIVE = 'tidak aktif'
}

interface Kasir {
  id_kasir: string;
  nama_kasir: string;
  status: StatusEnum;
}

const KasirPage: React.FC = () => {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch kasir list from API
    axios
      .get("http://localhost:3222/users/kasir")
      .then((response) => {
        setKasirList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching kasir:", error);
      });
  }, []);

  const handleAddKasir = (values: any) => {
    // Make POST request to add a new kasir
    axios
      .post("http://localhost:3222/users/tambah-kasir", values)
      .then((response) => {
        message.success("Kasir berhasil ditambahkan!");
        // Close the modal and reset the form
        setIsModalVisible(false);
        form.resetFields();
        // Optionally refetch the list to include the newly added kasir
        return axios.get("http://localhost:3222/users/kasir");
      })
      .then((response) => {
        setKasirList(response.data.data);
      })
      .catch((error) => {
        console.error("Error adding kasir:", error);
        message.error("Terjadi kesalahan saat menambahkan kasir.");
      });
  };

  const handleEditKasir = (id_kasir: string) => {
    // Implement the logic to edit a kasir
    message.success(
      `Fitur edit kasir dengan ID ${id_kasir} akan ditambahkan nanti!`
    );
  };

  return (
    <div className="p-4 mr-20 ml-64">
      <div className="flex justify-between items-center mb-4">
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
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
            <th className="py-3 px-16 text-left font-semibold">Status</th>
            <th className="py-3 px-6 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {kasirList.map((kasir, index) => (
            <tr key={kasir.id_kasir}>
              <td className="py-3 px-6 text-left w-16">{index + 1}</td>
              <td className="py-3 px-20 text-left">{kasir.nama_kasir}</td>
              <td
                className={`py-3 px-16 text-left ${
                  kasir.status === StatusEnum.ACTIVE ? "text-green-600" : ""
                }`}
              >
                {kasir.status}
              </td>
              <td className="py-3 px-6 text-left">
                <Button
                  type="primary"
                  onClick={() => handleEditKasir(kasir.id_kasir)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Kasir */}
      <Modal
        title="Tambah Kasir"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddKasir}
        >
          <Form.Item
            name="nama"
            label="Nama"
            rules={[{ required: true, message: 'Nama kasir harus diisi!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Email kasir harus diisi!' }, { type: 'email', message: 'Email tidak valid!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status kasir harus diisi!' }]}
          >
            <Select>
              {Object.entries(StatusEnum).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tambah
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KasirPage;
