"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryOutlined } from "@ant-design/icons";
import { IoFastFoodOutline } from "react-icons/io5";
import { Avatar, Dropdown, Button, Divider } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const pathname = usePathname();
  
  const authenticatedMenu = [
    { name: "Menu", path: "/kasirapp/menu", icon: <IoFastFoodOutline /> },
    { name: "Riwayat Transaksi", path: "/kasirapp/riwayat", icon: <HistoryOutlined /> },
  ];

  // Mengambil email pengguna dari localStorage
  const userEmail = localStorage.getItem('userEmail') || "guest@example.com";
  const userRole = "Kasir"; // Anda bisa menyesuaikan ini jika role bisa berbeda

  const avatarUrl = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/414d9011889067.5625411b2afd2.png";

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
          console.log("Logout button clicked");
          localStorage.removeItem('userEmail'); // Hapus email saat logout
        }}
      >
        Keluar
      </Button>
    </div>
  );

  useEffect(() => {
    const activeMenuItem = authenticatedMenu.find((item) =>
      pathname?.startsWith(item.path)
    );
    if (activeMenuItem) {
      setSelectedMenu(activeMenuItem.name);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white text-black w-60 h-full fixed top-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 md:block shadow-lg flex flex-col justify-center items-center z-50`}
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

      {/* Overlay untuk close sidebar di mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col ml-60">
        {/* Header */}
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white relative md:px-8 md:py-6">
          <h1 className="text-xl font-semibold">{selectedMenu}</h1>
          <Dropdown
            overlay={avatarMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              size="large"
              style={{ cursor: "pointer" }}
              src={avatarUrl}
            />
          </Dropdown>
        </header>
        <main className="flex-1 p-6 bg-gray-100 md:p-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
