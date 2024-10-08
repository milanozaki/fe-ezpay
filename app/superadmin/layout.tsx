'use client'; // Menandakan komponen ini sebagai Client Component
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link dari next/link
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Button, Divider } from 'antd'; // Import Avatar, Dropdown, Button, dan Divider dari Ant Design
import Image from 'next/image'; // Import Image dari next/image
import { usePathname } from "next/navigation"; // Import usePathname dari next/navigation

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Default sidebar tertutup di mobile
  const [selectedMenu, setSelectedMenu] = useState<string>(''); // State untuk menyimpan item yang dipilih dengan default ''
  const [userEmail, setUserEmail] = useState<string>("user@example.com"); // State untuk email pengguna
  const [avatarBgColor, setAvatarBgColor] = useState<string>(''); // State untuk menyimpan warna background avatar
  const pathname = usePathname(); // Mendapatkan path saat ini

  const menuItems = [
    { name: 'Inbox', path: '/superadmin/inbox', icon: <InboxOutlined /> },
    { name: 'Daftar Toko', path: '/superadmin/daftar_toko', icon: <UserOutlined /> },
  ];

  // Mengambil email dari localStorage setelah komponen di-mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }

    // Menghasilkan warna acak untuk background avatar setiap kali komponen di-mount
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    setAvatarBgColor(randomColor);
  }, []);

  // Set selectedMenu berdasarkan URL saat ini
  useEffect(() => {
    if (pathname) {
      const activeMenuItem = menuItems.find(item => pathname.includes(item.path));
      if (activeMenuItem) {
        setSelectedMenu(activeMenuItem.name);
      }
    }
  }, [pathname]); // Gunakan pathname alih-alih asPath

  const userRole = 'Superadmin'; // Role bisa diubah sesuai kebutuhan

  // Menu untuk dropdown avatar dengan ukuran persegi panjang dan background
  const avatarMenu = (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      {/* Avatar di tengah */}
      <div className="flex justify-center">
        <Avatar size={64} style={{ backgroundColor: avatarBgColor, color: '#fff' }}>
          {userEmail ? userEmail[0].toUpperCase() : ''}
        </Avatar>
      </div>
      <div className="mt-2 font-bold text-center">{userEmail}</div>
      <div className="text-gray-500 text-center">{userRole}</div>

      {/* Garis pemisah */}
      <Divider className='mt-3' />

      {/* Button Logout */}
      <Button
        type="primary"
        danger
        className="w-full -mt-4"
        onClick={() => {
          localStorage.removeItem("userEmail"); // Hapus email dari localStorage
          window.location.href = "/login_superadmin"; // Arahkan ke halaman login
        }}
      >
        Keluar
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white text-black w-60 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 md:block shadow-lg flex flex-col justify-center items-center 
        fixed md:relative z-50`}
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
          {menuItems.map((item) => (
            <li 
              key={item.name} 
              className="pt-3 pb-3 pr-4 pl-7 hover:bg-[#257691] mr-3 ml-2 rounded-lg"
            >
              <Link 
                href={item.path} 
                onClick={() => setSelectedMenu(item.name)} // Perbarui state ketika item diklik
                className={`flex items-center text-[#4998b3] hover:text-white ${selectedMenu === item.name ? 'font-bold' : ''}`}
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
          onClick={() => setIsSidebarOpen(false)} // Tutup sidebar jika overlay diklik
        ></div>
      )}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white relative md:px-8 md:py-6">
          <h1 className="text-xl font-semibold">{selectedMenu}</h1> {/* Menampilkan item yang dipilih */}
          {/* Avatar di pojok kanan */}
          <Dropdown overlay={avatarMenu} trigger={['click']} placement="bottomRight">
            <Avatar
              size="large"
              style={{ cursor: 'pointer', backgroundColor: avatarBgColor, color: '#fff' }}
            >
              {userEmail ? userEmail[0].toUpperCase() : ''}
            </Avatar>
          </Dropdown>
        </header>
        <main className="flex-1 p-6 bg-gray-100 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
