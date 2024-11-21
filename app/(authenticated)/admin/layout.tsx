"use client"; // Menandakan komponen ini sebagai Client Component
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineProfile } from "react-icons/ai";
import { Avatar, Dropdown, Button, Divider, notification, Tooltip } from "antd"; 
import { useRouter, usePathname } from "next/navigation"; 
import Cookies from "js-cookie"; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("user@example.com");
  const [userName, setUserName] = useState<string>("UserName");
  const [userRole, setUserRole] = useState<string>(""); // State untuk role pengguna
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi untuk menampilkan notifikasi
  const openNotification = (message: string) => {
    notification.warning({
      message: message,
      description: "Akses ditolak, lakukan Login terlebih dahulu",
      placement: "topRight",
      duration: 2,
    });
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      openNotification("Token tidak ditemukan");
      setTimeout(() => {
        router.push("/login_admin");
      }, 2500);
    } else {
      const storedEmail = localStorage.getItem("userEmail");
      const storedName = localStorage.getItem("nama");
      const storedRole = localStorage.getItem("nama_role"); // Ambil nama_role dari localStorage

      if (storedEmail) {
        setUserEmail(storedEmail);
      }
      if (storedName) {
        setUserName(storedName);
      }
      if (storedRole) {
        setUserRole(storedRole); // Set role pengguna
      }

      // Pengecekan role pengguna
      if (storedRole !== "Admin") {
        openNotification("Role tidak dikenal"); // Menampilkan notifikasi "Role tidak dikenal"
        setTimeout(() => {
          router.push("/login_admin"); // Jika bukan Admin, arahkan ke login_admin
        }, 2500);
      }

      const activeMenuItem = authenticatedMenu.find((item) => pathname?.startsWith(item.path));
      if (activeMenuItem) {
        setSelectedMenu(activeMenuItem.name);
      }
    }
  }, [pathname, router]);

  const authenticatedMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <AppstoreOutlined /> },
    { name: "Riwayat Transaksi", path: "/admin/riwayat_transaksi", icon: <HistoryOutlined /> },
    { name: "Kategori", path: "/admin/kategori", icon: <AiOutlineProfile /> },
    { name: "Produk", path: "/admin/produk", icon: <IoBagHandleOutline /> },
    { name: "Kasir", path: "/admin/kasir_admin", icon: <SettingOutlined /> },
  ];

  const userInitial = userName.charAt(0).toUpperCase();

  const avatarMenu = (
    <div className="p-6 w-64 bg-white shadow-xl rounded-lg border border-gray-200">
      <div className="text-sm text-gray-500 text-center mb-4">{userRole}</div> {/* Menampilkan role pengguna */}
      <div className="flex justify-center mb-4">
        <Avatar size={80} className="bg-[#3b98b7] shadow-lg" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          {userInitial}
        </Avatar>
      </div>
      <div className="text-lg font-bold text-center text-gray-900 mb-2">{userName}</div>
      <div className="text-sm text-gray-500 text-center mb-6">{userEmail}</div>
      <Divider className="mb-4" />
      <Button
        type="primary"
        danger
        className="w-full rounded-full h-10 font-semibold"
        style={{
          backgroundColor: "#f5222d",
          border: "none",
          boxShadow: "0 4px 6px rgba(245, 34, 45, 0.2)",
        }}
        onClick={() => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userName");
          localStorage.removeItem("id_toko");
          localStorage.removeItem("nama_role"); 
          localStorage.removeItem("nama"); 
          sessionStorage.clear();
          Cookies.remove("accessToken");
          Cookies.remove("id_user");
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
        className={`bg-white text-black w-60 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:block shadow-lg flex flex-col justify-center items-center fixed h-full z-50`}
      >
        <div className="flex justify-center items-center mb-6 mt-4">
          <img src="/images/logoEzpay.png" alt="Sidebar Image" width={80} height={80} />
        </div>
        <ul className="w-full">
          {authenticatedMenu.map((item) => (
            <li key={item.name} className="pt-3 pb-3 pr-4 pl-7 hover:bg-[#257691] mr-3 ml-2 rounded-lg">
              <Link
                href={item.path}
                onClick={() => setSelectedMenu(item.name)}
                className={`flex items-center text-[#4998b3] hover:text-white ${selectedMenu === item.name ? "font-bold" : ""}`}
              >
                <span className="text-sm mr-3">{item.icon}</span> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white sticky top-0 z-10">
          <button className="md:hidden text-white text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <h1 className="text-xl font-semibold ml-72 mb-0">{selectedMenu}</h1>
          <Dropdown overlay={avatarMenu} trigger={["click"]} placement="bottomRight">
            <Tooltip title={userName}>
              <Avatar
                size="large"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                className="bg-[#3b98b7] hover:shadow-xl hover:scale-110"
              >
                {userInitial}
              </Avatar>
            </Tooltip>
          </Dropdown>
        </header>

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
