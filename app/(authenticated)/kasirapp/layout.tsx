"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryOutlined } from "@ant-design/icons";
import { IoFastFoodOutline } from "react-icons/io5";
import { Avatar, Dropdown, Button, Divider } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import Cookies

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("guest@example.com"); // Set default email
  const pathname = usePathname();
  const router = useRouter();
  const authenticatedMenu = [
    {
      name: "Menu",
      path: "/kasirapp/menu",
      icon: <IoFastFoodOutline size={20} />,
    },
    {
      name: "Riwayat",
      path: "/kasirapp/riwayat",
      icon: <HistoryOutlined size={20} />,
    },
  ];

  const userRole = "Kasir";
  const avatarUrl =
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/414d9011889067.5625411b2afd2.png";

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
          localStorage.removeItem("userEmail"); // Hapus email dari localStorage
          Cookies.remove("access_token"); // Hapus accessToken dari cookies
          router.push("/login_kasir"); // Redirect ke halaman login
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

    // Check if in browser before accessing localStorage
    if (typeof window !== "undefined") {
      const token = Cookies.get("access_token"); // Ambil access_token dari cookies
      if (!token) {
        router.push("/login_kasir"); // Redirect ke halaman login jika tidak ada token
      } else {
        // Mengambil email dari localStorage atau cookies jika token ada
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      }
    }
  }, [pathname, router]);

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div
        className={`bg-white text-black w-20 h-full fixed top-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 md:block shadow-lg flex flex-col justify-between items-center z-50`}
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
        <ul className="w-full flex flex-col">
          {authenticatedMenu.map((item) => (
            <li
              key={item.name}
              className={`relative flex-grow flex items-center justify-center pt-3 pb-3 hover:bg-[#257691] rounded-lg`}
              style={{ height: "60px" }}
            >
              <Link
                href={item.path}
                onClick={() => setSelectedMenu(item.name)}
                className={`flex items-center text-[#4998b3] hover:text-white ${
                  selectedMenu === item.name ? "font-bold" : ""
                }`}
              >
                <span className="text-lg">{item.icon}</span>
              </Link>
              {selectedMenu === item.name && (
                <div className="absolute right-0 h-full w-1 bg-[#257691]"></div>
              )}
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

      <div className="flex-1 flex flex-col ml-20 ">
        <header className="bg-[#257691] shadow-md top-0 flex justify-between items-center text-white z-50 md:px-8 md:py-6">
          <h1 className="text-xl font-semibold ml-4">{selectedMenu}</h1>
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
  