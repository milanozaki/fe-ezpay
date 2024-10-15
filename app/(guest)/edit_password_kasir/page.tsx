'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EditPasswordPage = () => {
  const [email, setEmail] = useState(''); // State untuk email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get('id'); // Mengambil ID dari query params

  // Ambil email dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail'); 
    if (savedEmail) setEmail(savedEmail); // Setel email jika ada di localStorage

    if (!userId) {
      router.push('/login_kasir'); // Redirect jika userId tidak ada
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3222/users/edit-password/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengubah password');
      }

      router.push('/login_kasir'); // Redirect ke halaman login kasir setelah berhasil
    } catch (err) {
      setError('Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Ubah Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              readOnly // Pastikan input email tidak bisa diubah
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPasswordPage;
