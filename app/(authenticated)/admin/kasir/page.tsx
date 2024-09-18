"use client";
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import axios from "axios";

interface Kasir {
  id_kasir: string;
  nama_kasir: string;
  status: string; // Menambahkan status
}

const KasirPage: React.FC = () => {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);

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

  const handleAddKasir = () => {
    // Implement the logic to add a new kasir
    message.success("Fitur tambah kasir akan ditambahkan nanti!");
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
          onClick={handleAddKasir}
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
                  kasir.status === "aktif" ? "text-green-600" : ""
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
    </div>
  );
};

export default KasirPage;
