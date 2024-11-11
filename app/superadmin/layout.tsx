'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Button, Divider, message } from 'antd'; // Import Ant Design components
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import { cookies } from 'next/dist/client/components/headers';
import Cookies from 'js-cookie';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>("user@example.com");
  const [avatarBgColor, setAvatarBgColor] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inbox', path: '/superadmin/inbox', icon: <InboxOutlined /> },
    { name: 'Daftar Toko', path: '/superadmin/daftar_toko', icon: <UserOutlined /> },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setAvatarBgColor(randomColor);
  }, []);

  useEffect(() => {
    if (pathname) {
      const activeMenuItem = menuItems.find(item => pathname.includes(item.path));
      if (activeMenuItem) {
        setSelectedMenu(activeMenuItem.name);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const access_token = Cookies.get('access_token'); // Get token from storage

    if (!access_token) {
      message.warning("Access token tidak ada, Anda akan diarahkan ke halaman login.");
      setTimeout(() => {
        router.push('/login_superadmin');
      }, 1500); // Delay to allow alert to show
    }
  }, []);

  const avatarMenu = (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center">
        <Avatar size={64} style={{ backgroundColor: avatarBgColor, color: '#fff' }}>
          {userEmail ? userEmail[0].toUpperCase() : ''}
        </Avatar>
      </div>
      <div className="mt-2 font-bold text-center">{userEmail}</div>
      <div className="text-gray-500 text-center">Superadmin</div>
      <Divider className="mt-3" />
      <Button
        type="primary"
        danger
        className="w-full -mt-4"
        onClick={() => {
          localStorage.removeItem("userEmail");
          Cookies.remove("access_token"); // Remove token on logout
          router.push("/login_superadmin");
        }}
      >
        Keluar
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
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
                onClick={() => setSelectedMenu(item.name)}
                className={`flex items-center text-[#4998b3] hover:text-white ${selectedMenu === item.name ? 'font-bold' : ''}`}
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
        <header className="bg-[#257691] shadow-md p-4 flex justify-between items-center text-white relative md:px-8 md:py-6">
          <h1 className="text-xl font-semibold">{selectedMenu}</h1>
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
