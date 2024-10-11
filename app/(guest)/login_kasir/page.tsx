"use client"; // Menandakan komponen ini sebagai Client Component
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Impor useRouter dari Next.js
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from 'js-cookie';
import { notification } from 'antd'; // Import notification dari Ant Design

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Inisialisasi router
  const [showPassword, setShowPassword] = useState(false);

  // Cek apakah pengguna sudah memiliki access token saat komponen di-mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Tidak melakukan redirect otomatis jika sudah login
      // Hanya menampilkan pesan atau melakukan logika lain jika diperlukan
      // router.push("/kasirapp/menu"); // Arahkan ke menu kasir jika sudah login
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:3222/auth/login/kasir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Cek jika ada message dari backend
        if (data.message) {
          if (data.message === "Password salah") {
            notification.error({
              message: 'Login Gagal',
              description: 'Password salah. Periksa kembali kredensial Anda.',
              placement: 'topRight',
            });
          } else if (data.message === "Akses ditolak: Akun Anda sedang tidak aktif") {
            notification.warning({
              message: 'Akun Tidak Aktif',
              description: 'Akun Anda sedang tidak aktif. Hubungi admin.',
              placement: 'topRight',
            });
          } else {
            // Pesan error lain
            notification.error({
              message: 'Login Gagal',
              description: data.message || 'Terjadi kesalahan saat login.',
              placement: 'topRight',
            });
          }
        }
      } else {
        // Jika login berhasil
        Cookies.set('access_token', data.access_token, { expires: 7 });
        localStorage.setItem('userEmail', email); // Simpan email pengguna di localStorage
  
        notification.success({
          message: 'Login Berhasil',
          description: 'Anda berhasil login.',
          placement: 'topRight',
        });
  
        if (data.redirectUrl) {
          notification.warning({
            message: 'Perlu Perubahan Password',
            description: 'Anda perlu mengubah password akun terlebih dahulu.',
            placement: 'topRight',
          });
  
          setTimeout(() => {
            router.push(data.redirectUrl); // Redirect ke halaman edit password kasir dengan ID user
          }, 2000); // Setelah 2 detik
        } else {
          router.push("/kasirapp/menu");
        }
      }
    } catch (err) {
      setError("Login gagal. Periksa kredensial Anda dan coba lagi.");
      notification.error({
        message: 'Login Gagal',
        description: 'Terjadi kesalahan saat login.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#5aa5be] px-4 py-8">
      {/* Konten Utama */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Form login */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[350px] relative">
          {/* Gambar ikon */}
          <div className="relative z-10 flex justify-center mb-6">
            <img
              src="/images/logoEzpay.png" // Ganti dengan ikon yang sesuai
              alt="Login Icon"
              width={90}
              height={90}
            />
          </div>

          {/* Judul login */}
          <h2 className="relative z-10 text-center text-2xl font-semibold text-gray-800 mb-8">
            Selamat Datang!
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Input Email */}
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

            {/* Input Password */}
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
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </div>
            </div>
            {/* Tombol Login */}
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

      {/* Footer copyright */}
      <footer className="text-white text-sm text-center -py-1 mt-5">
        © 2024 Ezpay. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
