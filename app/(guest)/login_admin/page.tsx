"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notification } from "antd"; // Import notifikasi dari Ant Design

type NotificationType = "success" | "error";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk membuka notifikasi
  const openNotification = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 2,
    });
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="));
    if (token) {
      // Jika token ditemukan di cookies, tidak melakukan redirect otomatis
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:3222/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 401) {
          openNotification("error", "Login Gagal", "Email atau password salah.");
        } else {
          throw new Error("Login gagal");
        }
      } else {
        const expiresIn = 1; // Days
        const date = new Date();
        date.setTime(date.getTime() + expiresIn * 24 * 60 * 60 * 1000);
        
        // Simpan accessToken ke cookie dengan masa berlaku 1 hari
        document.cookie = `accessToken=${data.access_token}; expires=${date.toUTCString()}; path=/`;
  
        // Simpan email ke cookie dengan masa berlaku 1 hari
        document.cookie = `userEmail=${email}; expires=${date.toUTCString()}; path=/`;
  
        openNotification("success", "Login Berhasil", "Anda berhasil masuk.");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      openNotification("error", "Login Gagal", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#5aa5be] px-4 py-8">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[350px] relative">
          <div className="relative z-10 flex justify-center mb-6">
            <img
              src="/images/logoEzpay.png"
              alt="Login Icon"
              width={90}
              height={90}
            />
          </div>

          <h2 className="relative z-10 text-center text-2xl font-semibold text-gray-800 mb-8">
            Selamat Datang!
          </h2>

          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer "
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </div>
            </div>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-[#4a98b1] text-white py-3 px-4 rounded-2xl hover:bg-[#56a6c0] transition-colors"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>

            <div className="text-left mt-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/"); // Arahkan ke localhost:3000
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                Kembali
              </a>
            </div>
          </form>
        </div>
      </div>

      <footer className="text-white text-sm text-center -py-1 mt-5">
        © 2024 Ezpay. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
