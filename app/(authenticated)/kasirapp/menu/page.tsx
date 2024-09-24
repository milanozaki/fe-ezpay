"use client"; // Menandakan ini adalah komponen client-side
import React, { useEffect, useState } from "react";
import { AiOutlineDoubleRight, AiOutlineDoubleLeft, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"; // Import ikon dari react-icons
import { Card, Button, Image } from "antd"; // Import komponen dari Ant Design

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  stok: number;
  quantity: number; // Tambahkan properti untuk jumlah produk dalam keranjang
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
  const [paymentMethod, setPaymentMethod] = useState<string>("Tunai"); // State untuk metode pembayaran

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
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id_produk === produk.id_produk);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id_produk === produk.id_produk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...produk, quantity: 1 }];
      }
    });
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

  // Menghitung total harga produk dalam keranjang
  const totalHarga = cart.reduce((total, item) => total + item.harga_produk * item.quantity, 0);

  // Fungsi untuk handle pembayaran (tambahkan logika sesuai kebutuhan Anda)
  const handlePayment = () => {
    // Implementasikan logika pembayaran di sini
    alert(`Pembayaran dengan metode ${paymentMethod} untuk total Rp ${totalHarga}`);
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

        {/* Daftar Produk dalam grid 3 kolom menggunakan Card Ant Design */}
        <div className="grid grid-cols-3 gap-4 mx-4">
          {filteredProducts.map((produk: Produk) => (
            <Card
              key={produk.id_produk}
              className="shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              cover={
                <Image
                  alt={produk.nama_produk}
                  src={`http://localhost:3222/gambar_produk/${produk.gambar_produk}`}
                  className="card-image h-40"
                  preview={false}
                  fallback="/path/to/placeholder-image.png" // Ganti dengan path gambar placeholder yang valid
                />
              }
              onClick={() => addToCart(produk)}
            >
              <Card.Meta
                title={produk.nama_produk}
                description={
                  <span style={{ color: "black" }}>
                    Rp {produk.harga_produk}
                  </span>
                }
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar Cart di sebelah kanan */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-md flex flex-col h-screen">
        <h2 className="text-xl font-bold text-center bg-[#3B8394] text-white p-2 rounded-md mb-4">Pesanan ({cart.length})</h2>
        <div className="flex-grow max-h-[calc(100vh-150px)] overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Keranjang kosong</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="border-b pb-2 mb-2 flex flex-col items-start">
                <div className="flex justify-between w-full">
                  <span className="font-semibold">{item.nama_produk}</span>
                  <span className="ml-4">Rp {item.harga_produk}</span>
                </div>
                <div className="flex items-center mt-1">
                  <button
                    className="mx-2 border border-gray-400 rounded px-2"
                    onClick={() => {
                      if (item.quantity > 1) {
                        setCart((prevCart) =>
                          prevCart.map((prod) =>
                            prod.id_produk === item.id_produk
                              ? { ...prod, quantity: prod.quantity - 1 }
                              : prod
                          )
                        );
                      } else {
                        setCart((prevCart) =>
                          prevCart.filter((_, i) => i !== index)
                        );
                      }
                    }}
                  >
                    <AiOutlineMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="mx-2 border border-gray-400 rounded px-2"
                    onClick={() => {
                      setCart((prevCart) =>
                        prevCart.map((prod) =>
                          prod.id_produk === item.id_produk
                            ? { ...prod, quantity: prod.quantity + 1 }
                            : prod
                        )
                      );
                    }}
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pilihan Metode Pembayaran */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-semibold">Metode Pembayaran:</label>
          <select
            className="border rounded-md p-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Tunai">Tunai</option>
            <option value="QRIS">QRIS</option>
          </select>
        </div>

        {/* Total Harga */}
        <div className="text-lg font-semibold">Total: Rp {totalHarga}</div>

        {/* Tombol Bayar */}
        <Button
          type="primary"
          onClick={handlePayment}
          className="mt-4"
          disabled={cart.length === 0}
        >
          Bayar
        </Button>
      </div>
    </div>
  );
};

export default MenuPage;
