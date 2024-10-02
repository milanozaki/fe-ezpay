"use client"; // Menandakan komponen ini sebagai Client Component
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Link dari next/link
import {
  HistoryOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineProfile } from "react-icons/ai";
import { Avatar, Dropdown, Button, Divider } from "antd"; // Import Avatar, Dropdown, Button, dan Divider dari Ant Design
import { useRouter, usePathname } from "next/navigation"; // Import useRouter dan usePathname dari next/navigation
import Image from "next/image"; // Import Image dari next/image

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Default sidebar tertutup di mobile
  const [selectedMenu, setSelectedMenu] = useState<string>(""); // State untuk menyimpan item yang dipilih
  const [userEmail, setUserEmail] = useState<string>("user@example.com"); // State untuk email pengguna
  const pathname = usePathname(); // Mendapatkan path saat ini

  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    // Mengambil email dari localStorage setelah komponen di-mount
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }

    // Set selectedMenu berdasarkan URL saat ini
    const activeMenuItem = authenticatedMenu.find(item => pathname?.startsWith(item.path));
    if (activeMenuItem) {
      setSelectedMenu(activeMenuItem.name);
    }
  }, [pathname]);

  const authenticatedMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <AppstoreOutlined /> },
    {
      name: "Riwayat Transaksi",
      path: "/admin/riwayat_transaksi",
      icon: <HistoryOutlined />,
    },
    { name: "Kategori", path: "/admin/kategori", icon: <AiOutlineProfile /> },
    { name: "Produk", path: "/admin/produk", icon: <IoBagHandleOutline /> },
    { name: "Kasir", path: "/admin/kasir_admin", icon: <SettingOutlined /> },
  ];

  const avatarUrl =
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/414d9011889067.5625411b2afd2.png";
  const userRole = "Admin"; // Role bisa diubah menjadi Kasir atau lainnya sesuai kebutuhan

  // Menu untuk dropdown avatar dengan ukuran persegi panjang dan background
  const avatarMenu = (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      {/* Avatar di tengah */}
      <div className="flex justify-center">
        <Avatar size={64} src={avatarUrl} />
      </div>
      <div className="mt-2 font-bold text-center">{userEmail}</div>
      <div className="text-gray-500 text-center">{userRole}</div>

      {/* Garis pemisah */}
      <Divider className="mt-3" />

      {/* Button Logout */}
      <Button
        type="primary"
        danger
        className="w-full -mt-4"
        onClick={() => {
          localStorage.removeItem("userEmail"); // Hapus email dari localStorage
          router.push("/login_admin"); // Arahkan ke halaman login
        }}
      >
        Keluar
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Tambahkan overflow-hidden untuk menghindari scroll pada container utama */}
      {/* Sidebar */}
        <div className="flex justify-center items-center mb-6 mt-4">
          <Image
            src="/images/logoEzpay.png"
            alt="Sidebar Image"
            width={80}
            height={80}
            priority
          />
        </div>
        <ul className="w-full">
          {authenticatedMenu.map((item) => (
            <li
              key={item.name}
              className="pt-3 pb-3 pr-4 pl-7 hover:bg-[#257691] mr-3 ml-2 rounded-lg"
            >
              <Link
                href={item.path}
                onClick={() => setSelectedMenu(item.name)} // Perbarui state ketika item diklik
                className={`flex items-center text-[#4998b3] hover:text-white ${
                  selectedMenu === item.name ? "font-bold" : ""
                }`}
              >
                <span className="text-sm mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      {/* Overlay untuk close sidebar di mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Tutup sidebar jika overlay diklik
        ></div>
      )}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white sticky top-0 z-10">
          {/* Menambahkan sticky dan top-0 */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar ketika tombol hamburger diklik
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold ml-72 mb-0">{selectedMenu}</h1> {/* Menampilkan item yang dipilih */}
          {/* Avatar di pojok kanan */}
          <Dropdown
            overlay={avatarMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              size="large"
              style={{ cursor: "pointer" }}
              src={avatarUrl} // Ganti dengan URL gambar avatar
            />
          </Dropdown>
        </header>

        {/* Content yang bisa di-scroll */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {/* Tambahkan overflow-y-auto agar konten bisa di-scroll */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
