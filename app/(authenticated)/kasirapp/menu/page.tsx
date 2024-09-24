"use client"; // Menandakan ini adalah komponen client-side
import React, { useEffect, useState } from "react";
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from "react-icons/ai"; // Import ikon dari react-icons

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  stok: number;
  kategori: {
    nama: string; // Menambahkan kategori dengan nama
  };
}

const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([]); // State untuk menyimpan data kategori
  const [products, setProducts] = useState<Produk[]>([]); // State untuk menyimpan data produk
  const [activeButton, setActiveButton] = useState<string>("Semua"); // State untuk tombol yang aktif
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading
  const [cart, setCart] = useState<Produk[]>([]); // State untuk menyimpan produk yang dipilih
  const [currentPage, setCurrentPage] = useState<number>(0); // State untuk halaman kategori saat ini

  const categoriesPerPage = 5; // Jumlah kategori per halaman

  // Fetch data kategori dan produk dari API saat komponen di-mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // Mulai loading
        const response = await fetch("http://localhost:3222/kategori"); // Sesuaikan endpoint API Anda
        const data = await response.json();
        setCategories(data.data); // Asumsikan data kategori ada di dalam data.data
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true); // Mulai loading
        const response = await fetch("http://localhost:3222/produk/all"); // Endpoint produk yang baru
        const data = await response.json();
        setProducts(data.data); // Asumsikan data produk ada di dalam data.data
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Fungsi untuk handle tombol yang aktif
  const handleButtonClick = (namaKategori: string) => {
    setActiveButton(namaKategori); // Set tombol yang diklik menjadi aktif
  };

  // Fungsi untuk menampilkan tombol sesuai halaman
  const getPaginatedCategories = () => {
    const startIndex = currentPage * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return categories.slice(startIndex, endIndex);
  };

  // Kondisi untuk menentukan apakah tombol aktif atau tidak
  const getButtonStyle = (namaKategori: string) => {
    return activeButton === namaKategori
      ? "bg-[#3B8394] text-white border-[#3B8394]" // Jika aktif
      : "bg-white text-[#3B8394] border-[#3B8394] hover:bg-[#3B8394] hover:text-white"; // Jika tidak aktif
  };

  // Fungsi untuk menambahkan produk ke dalam cart
  const addToCart = (produk: Produk) => {
    setCart((prevCart) => [...prevCart, produk]);
  };

  // Filter produk berdasarkan kategori yang aktif
  const filteredProducts =
    activeButton === "Semua"
      ? products // Jika kategori 'Semua' dipilih, tampilkan semua produk
      : products.filter((produk) => produk.kategori.nama === activeButton); // Filter produk berdasarkan kategori.nama

  // Fungsi untuk menampilkan halaman kategori berikutnya
  const goToNextPage = () => {
    if ((currentPage + 1) * categoriesPerPage < categories.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk menampilkan halaman kategori sebelumnya
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading jika data sedang diambil
  }

  return (
    <div className="flex w-full">
      {/* Kategori dan Daftar Produk */}
      <div className="w-3/4">
        {/* Kontainer dengan scroll horizontal */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-3xl border-2 transition duration-300 flex items-center justify-center ${getButtonStyle(
              "Semua"
            )}`}
            onClick={() => handleButtonClick("Semua")}
          >
            Semua
          </button>

          {/* Tombol untuk halaman sebelumnya */}
          {currentPage > 0 && (
            <button
              className="px-4 py-2 rounded-3xl border-2 text-[#3B8394] hover:bg-[#3B8394] hover:text-white transition duration-300 flex items-center justify-center"
              onClick={goToPreviousPage}
            >
              <AiOutlineDoubleLeft />
            </button>
          )}

          {/* Render tombol kategori berdasarkan halaman */}
          {getPaginatedCategories().map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-3xl border-2 transition duration-300 flex items-center justify-center ${getButtonStyle(
                category.nama
              )}`}
              onClick={() => handleButtonClick(category.nama)}
            >
              {category.nama} {/* Menampilkan nama kategori */}
            </button>
          ))}

          {/* Tombol untuk halaman berikutnya */}
          {(currentPage + 1) * categoriesPerPage < categories.length && (
            <button
              className="px-4 py-2 rounded-3xl border-2 text-[#3B8394] hover:bg-[#3B8394] hover:text-white transition duration-300 flex items-center justify-center"
              onClick={goToNextPage}
            >
              <AiOutlineDoubleRight />
            </button>
          )}
        </div>

        {/* Daftar Produk dalam grid 3 kolom */}
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((produk: Produk, index: number) => (
            <div key={index} className="border p-4 flex flex-col items-center">
              <img
                src={produk.gambar_produk}
                alt={produk.nama_produk}
                className="w-32 h-32 object-cover mb-2"
              />
              <p className="font-bold">{produk.nama_produk}</p>
              <p>Harga: Rp{produk.harga_produk}</p>
              <p>Stok: {produk.stok}</p>
              <button
                onClick={() => addToCart(produk)}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Cart di pojok kanan */}
      <div className="w-1/4 bg-gray-100 p-4 ml-4 h-full">
        <h2>Keranjang Belanja</h2>
        {cart.length === 0 ? (
          <p>Keranjang kosong</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="border-b py-2">
                {item.nama_produk} - Rp{item.harga_produk}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
