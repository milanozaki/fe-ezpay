"use client"; // Menandakan komponen ini sebagai Client Component
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Impor useRouter dari Next.js

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Inisialisasi router
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token); // Set token ke state
    console.log('Access Token:', token); // Cek token di konsol
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
        // Tampilkan pesan error untuk status 401 (kredensial salah)
        if (response.status === 401) {
          setError("Email atau password salah. Silakan coba lagi.");
        }
        // Tampilkan pesan dari backend jika akun tidak aktif
        else if (
          data.message === "Akses ditolak: Akun Anda sedang tidak aktif"
        ) {
          setError("Akun Anda sedang tidak aktif. Hubungi admin.");
        } else {
          throw new Error("Login gagal");
        }
      } else {
        // Simpan access token ke local storage

        // Cek jika password default dan ada redirect URL
        if (data.redirectUrl) {
          router.push(data.redirectUrl); // Redirect ke halaman edit password kasir dengan ID user
        } else {
          localStorage.setItem("userEmail", email);
          router.push("/kasirapp/menu"); // Redirect ke menu kasir jika login sukses
          localStorage.setItem("accessToken", data.accessToken); // Ganti 'accessToken' dengan nama field yang sesuai jika berbeda
        }
      }
    } catch (err) {
      setError("Login gagal. Periksa kredensial Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
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
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              {/* Tautan Kembali */}
              <div className="text-left mt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.back(); // Kembali ke halaman sebelumnya
                  }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Kembali
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

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
