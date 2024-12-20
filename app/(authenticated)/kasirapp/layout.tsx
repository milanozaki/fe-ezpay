"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryOutlined } from "@ant-design/icons";
import { IoFastFoodOutline } from "react-icons/io5";
import { Avatar, Dropdown, Button, Divider, Tooltip, notification } from "antd"; // Import notification
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import Cookies

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("guest@example.com"); // Set default email
  const [userName, setUserName] = useState<string>("Nama Pengguna"); // Set default name
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

  const userRole = "Kasir"; // Misalkan role pengguna tetap sama

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase(); // Mengambil inisial dari nama
  };

  const avatarMenu = (
    <div className="p-6 w-64 bg-white shadow-xl rounded-lg border border-gray-200">
      {/* Peran Pengguna */}
      <div className="text-sm text-gray-500 text-center mb-4">{userRole}</div>

      {/* Avatar dengan bayangan halus */}
      <div className="flex justify-center mb-4">
        <Avatar
          size={80}
          className="bg-[#3b98b7] shadow-lg"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          {getInitials(userName)}
        </Avatar>
      </div>

      {/* Nama Pengguna */}
      <div className="text-lg font-bold text-center text-gray-900 mb-2">{userName}</div>

      {/* Email Pengguna */}
      <div className="text-sm text-gray-500 text-center mb-6">{userEmail}</div>

      {/* Garis Pembatas */}
      <Divider className="mb-4" />

      {/* Tombol Keluar dengan desain lebih halus */}
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
          localStorage.removeItem("nama");
          localStorage.removeItem("id_toko");
          localStorage.removeItem("nama_role");
          sessionStorage.clear();
          Cookies.remove("accessToken");
          Cookies.remove("id_user");
          router.push("/login_kasir");
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
      const token = Cookies.get("accessToken"); // Ambil access_token dari cookies
      if (!token) {
        // Tampilkan notifikasi sebelum redirect ke login_kasir
        notification.error({
          message: 'Akses Ditolak',
          description: 'Token akses tidak ditemukan. Anda akan diarahkan ke halaman login.',
          placement: 'topRight',
        });
        setTimeout(() => {
          router.push("/login_kasir"); // Redirect ke halaman login jika tidak ada token
        }, 2000); // Delay 2 detik sebelum redirect
      } else {
        // Mengambil email, nama, dan nama_role dari localStorage jika token ada
        const storedEmail = localStorage.getItem("userEmail");
        const storedName = localStorage.getItem("nama");
        const storedRole = localStorage.getItem("nama_role");

        if (storedEmail) {
          setUserEmail(storedEmail);
        }
        if (storedName) {
          setUserName(storedName);
        }

        // Mengecek role pengguna, jika bukan Kasir, arahkan ke login_kasir
        if (storedRole !== "Kasir") {
          // Tampilkan notifikasi sebelum redirect ke login_kasir
          notification.error({
            message: 'Akses Ditolak',
            description: 'Peran Anda tidak sesuai. Anda akan diarahkan ke halaman login.',
            placement: 'topRight',
          });
          setTimeout(() => {
            router.push("/login_kasir");
          }, 2000); // Delay 2 detik sebelum redirect
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
          <img
            src="/images/logoEzpay.png"
            alt="Sidebar Image"
            className="w-20 h-20"
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
          <Dropdown overlay={avatarMenu} trigger={["click"]} placement="bottomRight">
            {/* Avatar dengan efek hover */}
            <Tooltip title={userName}>
              <Avatar
                size="large"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                className="bg-[#3b98b7] hover:shadow-xl hover:scale-110"
              >
                {getInitials(userName)}
              </Avatar>
            </Tooltip>
          </Dropdown>
        </header>
        <div className="flex-1 p-6 bg-gray-100 md:p-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
