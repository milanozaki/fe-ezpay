"use client";
import React, { useEffect, useState } from "react";
import { Select, Card, Image, Button, message, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

interface Kategori {
  id_kategori: string;
  nama: string;
}

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  status_produk: string;
  satuan_produk: string;
  kode_produk: string;
  stok: number;
  quantity: number;
  kategori: Kategori; // Menggunakan objek Kategori
  createdAt: Date;
  updatedAt: Date;
}

const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Produk[]>([]);
  const [activeButton, setActiveButton] = useState<string>("Semua");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Produk[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3222/kategori");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const id_toko = localStorage.getItem("id_toko");
      if (!id_toko) {
        console.error("ID Toko tidak ditemukan di localStorage");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3222/produk/toko/${id_toko}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data produk:", data); // Menampilkan data di konsol
        // Pastikan untuk mengambil array produk dengan benar
        setProducts(data); // Jika data adalah array langsung, gunakan ini
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("http://localhost:3222/metode-transaksi");
        const data = await response.json();
        setPaymentMethods(data);
        if (data.length > 0) {
          setPaymentMethod(data[0].id_metode_transaksi);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleCategoryChange = (value: string) => {
    setActiveButton(value);
  };

  const tunaiMethod = paymentMethods.find((method) => method.nama === "Tunai");
  const qrisMethod = paymentMethods.find((method) => method.nama === "QRIS");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const filteredProducts =
    activeButton === "Semua"
      ? products
      : products.filter((produk) => produk.kategori.nama === activeButton);

  const addToCart = (produk: Produk) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id_produk === produk.id_produk
      );

      if (existingProduct && existingProduct.quantity + 1 > produk.stok) {
        message.error(`Stok tidak mencukupi untuk ${produk.nama_produk}`);
        return prevCart;
      }

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id_produk === produk.id_produk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (produk.stok < 1) {
        message.error(`Stok tidak mencukupi untuk ${produk.nama_produk}`);
        return prevCart;
      }

      return [...prevCart, { ...produk, quantity: 1 }];
    });
  };

  const handleProductClick = (produk: Produk) => {
    setSelectedProduct(produk.id_produk);
    addToCart(produk);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const openSuccessNotification = (result: any) => {
    const totalHarga = cart.reduce(
      (total, item) => total + item.harga_produk * item.quantity,
      0
    );

    notification.success({
      message: "Pesanan Berhasil",
      description: `Pesanan Anda telah berhasil dibuat. 
                    ID Pesanan: ${result.id_pesanan} 
                    Metode Transaksi: ${
                      result.metode_transaksi || paymentMethod
                    } 
                    Total Harga: Rp ${formatCurrency(totalHarga)}`, 
      placement: "bottomRight", 
    });
  };

  const removeFromCart = (id_produk: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id_produk !== id_produk)
    );
  };

  const updateQuantity = (id_produk: string, change: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id_produk === id_produk) {
          const newQuantity = item.quantity + change;

          // Update stok produk
          setProducts((prevProducts) => {
            return prevProducts.map((product) => {
              if (product.id_produk === id_produk) {
                return { ...product, stok: product.stok - change }; // Perbarui stok
              }
              return product;
            });
          });

          return { ...item, quantity: newQuantity >= 0 ? newQuantity : 0 }; // Jangan biarkan jumlah kurang dari 0
        }
        return item;
      });

      // Hapus item dari keranjang jika jumlahnya 0
      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSubmit = async () => {
    const token = Cookies.get("accessToken"); // Ambil token dari cookie
    console.log("Token found:", token); // Log token
  
    // Ambil userNama dari localStorage
    const userNama = localStorage.getItem("userName");
  
    const pesananData = {
      detil_produk_pesanan: cart.map((item) => ({
        id_produk: item.id_produk,
        jumlah_produk: item.quantity,
      })),
      metode_transaksi_id: paymentMethod, // UUID dari metode pembayaran
      token, // Ganti dengan token valid
      userNama, // Sertakan userNama di sini
    };
  
    try {
      const response = await fetch("http://localhost:3222/pesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Sertakan token di header
        },
        body: JSON.stringify(pesananData),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menyimpan pesanan");
      }
  
      const result = await response.json();
      openSuccessNotification(result); // Panggil notifikasi sukses di sini
  
      // Update stok produk setelah transaksi berhasil
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartItem = cart.find(
            (item) => item.id_produk === product.id_produk
          );
          if (cartItem) {
            return {
              ...product,
              stok: product.stok - cartItem.quantity, // Kurangi stok produk
            };
          }
          return product;
        })
      );
  
      setCart([]); // Bersihkan keranjang setelah pesanan berhasil
    } catch (error) {
      console.error("Error submitting pesanan:", error);
    }
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.harga_produk * item.quantity,
    0
  );

  return (
    <div className="flex w-full h-full gap-3 max-w-screen overflow-hidden">
      {/* Bagian untuk daftar produk */}
      <div className="w-[70%] h-[calc(100vh-200px)] mr-0 p-0">
        <div className="mb-4">
          <Select
            defaultValue="Semua"
            style={{ width: 200 }}
            onChange={handleCategoryChange}
          >
            <Select.Option value="Semua">Semua</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.nama}>
                {category.nama}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-hidden">
          <div className="h-full overflow-auto scrollbar-hidden touch-scroll">
            <style jsx>{`
              .scrollbar-hidden {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
              }
              .scrollbar-hidden::-webkit-scrollbar {
                display: none; /* Chrome, Safari, and Opera */
              }
              .touch-scroll {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch; /* iOS for smooth scrolling */
              }
            `}</style>

            <div className="grid grid-cols-3 gap-2">
              {products.map((produk) => (
                <Card
                  key={produk.id_produk}
                  className={`shadow-lg hover:shadow-2xl transition-transform duration-300 cursor-pointer ${
                    selectedProduct === produk.id_produk
                      ? "transform scale-105"
                      : ""
                  }`}
                  cover={
                    <Image
                      alt={produk.nama_produk}
                      src={`http://localhost:3222/produk/image/${produk.gambar_produk}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                      preview={false}
                    />
                  }
                  onClick={() => handleProductClick(produk)}
                >
                  <Card.Meta
                    title={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                            maxWidth: "70%",
                          }}
                        >
                          {produk.nama_produk}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <span className="text-gray-400">
                            Stok: {produk.stok}
                          </span>
                          <span style={{ color: "black" }}>
                            Rp {formatCurrency(produk.harga_produk)}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Keranjang */}
      <div className="w-[30%] h-[calc(100vh-175px)] p-4 flex flex-col justify-between">
        <h2 className="text-lg font-bold mb-4">Pesanan ({cart.length})</h2>
        <div className="flex-grow overflow-auto scrollbar-hidden touch-scroll">
          <style jsx>{`
            .scrollbar-hidden {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
            .scrollbar-hidden::-webkit-scrollbar {
              display: none; /* Chrome, Safari, and Opera */
            }
            .touch-scroll {
              overflow-y: auto;
              -webkit-overflow-scrolling: touch; /* iOS for smooth scrolling */
            }
          `}</style>
          {cart.length === 0 ? (
            <p>Keranjang Anda kosong</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="mb-4">
                  <div className="border rounded-lg p-4 shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{item.nama_produk}</h3>
                        <p>Harga: Rp {formatCurrency(item.harga_produk)}</p>
                        <p>Jumlah: {item.quantity}</p>
                      </div>
                      <Image
                        alt={item.nama_produk}
                        src={`http://localhost:3222/produk/image/${item.gambar_produk}`}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        preview={false}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <button
                          onClick={() => updateQuantity(item.id_produk, -1)}
                          className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id_produk, 1)}
                          className="px-2 py-1 bg-blue-500 text-white rounded-md"
                        >
                          +
                        </button>
                      </div>
                      <Button
                        type="primary"
                        danger
                        onClick={() => removeFromCart(item.id_produk)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">
            Total: Rp {formatCurrency(totalHarga)}
          </h3>

          {/* Metode Pembayaran */}
          <div className="mb-4">
            <Select
              value={paymentMethod}
              onChange={setPaymentMethod}
              style={{ width: "100%" }}
              placeholder="Pilih metode pembayaran"
            >
              {paymentMethods.map((method) => (
                <Select.Option
                  key={method.id_metode_transaksi}
                  value={method.id_metode_transaksi}
                >
                  {method.nama}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex justify-between gap-2">
          <button
              className="w-1/6 px-2 py-1 bg-red-500 text-white rounded-md"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              <DeleteOutlined />
            </button>
            <button
              className="w-5/6 px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={handleSubmit}
              disabled={cart.length === 0}
            >
              Bayar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
