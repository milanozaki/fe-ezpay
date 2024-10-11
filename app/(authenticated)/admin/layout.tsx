"use client"; // Menandakan komponen ini sebagai Client Component
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HistoryOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineProfile } from "react-icons/ai";
import { Avatar, Dropdown, Button, Divider, notification } from "antd"; // Mengimpor notification dari Ant Design
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("user@example.com");

  const pathname = usePathname();
  const router = useRouter();

  // Fungsi untuk menampilkan notifikasi
  const openNotification = () => {
    notification.warning({
      message: "Akses Ditolak",
      description: "Anda tidak memiliki token. Silakan login kembali.",
      placement: "topRight", // Posisi notifikasi
      duration: 2, // Notifikasi akan hilang dalam 2 detik
    });
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      openNotification(); // Panggil fungsi notifikasi jika token tidak ada

      // Redirect ke halaman login setelah notifikasi muncul
      setTimeout(() => {
        router.push("/login_admin");
      }, 2500); // Tunggu 2.5 detik sebelum redirect
    } else {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }

      const activeMenuItem = authenticatedMenu.find((item) =>
        pathname?.startsWith(item.path)
      );
      if (activeMenuItem) {
        setSelectedMenu(activeMenuItem.name);
      }
    }
  }, [pathname, router]);

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
  const userRole = "Admin";

  const avatarMenu = (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center">
        <Avatar size={64} src={avatarUrl} />
      </div>
      <div className="mt-2 font-bold text-center">{userEmail}</div>
      <div className="text-gray-500 text-center">{userRole}</div>

      <Divider className="mt-3" />
      <Button
        type="primary"
        danger
        className="w-full -mt-4"
        onClick={() => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("authToken");
          localStorage.removeItem("pemilikToko");
          localStorage.removeItem("tokoDto");
          sessionStorage.clear();
          Cookies.remove("accessToken");

          router.push("/login_admin");
        }}
      >
        Keluar
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`bg-white text-black w-60 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } 
        md:translate-x-0 transition-transform duration-300 md:block shadow-lg flex flex-col justify-center items-center 
        fixed h-full z-50`}
      >
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
                onClick={() => setSelectedMenu(item.name)}
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
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white sticky top-0 z-10">
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold ml-72 mb-0">{selectedMenu}</h1>
          <Dropdown
            overlay={avatarMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar size="large" style={{ cursor: "pointer" }} src={avatarUrl} />
          </Dropdown>
        </header>

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
