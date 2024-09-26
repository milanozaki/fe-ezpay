"use client";

import { useRouter } from "next/navigation"; // Impor useRouter untuk navigasi
import { Result, Button } from "antd"; // Impor Result dan Button dari Ant Design
import { CloseCircleOutlined } from "@ant-design/icons"; // Impor ikon CloseCircleOutlined

const RejectedPage = () => {
  const router = useRouter(); // Inisialisasi useRouter

  const handleBack = () => {
    router.push("/"); // Navigasi ke halaman utama
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Ant Design Result Component */}
      <Result
        status="error"
        icon={<CloseCircleOutlined style={{ color: "red" }} />}
        title="Permintaan pembuatan toko ditolak"
        subTitle="Periksa ulang data yang digunakan dan coba lagi."
        extra={
          <Button type="primary" onClick={handleBack}>
            Kembali ke Halaman Utama
          </Button>
        }
      />
    </div>
  );
};

export default RejectedPage;
