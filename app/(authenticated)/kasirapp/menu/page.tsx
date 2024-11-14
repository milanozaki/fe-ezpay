"use client";
import React, { useEffect, useState } from "react";
import { Select, Card, Image, Button, message, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";

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


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const idToko = localStorage.getItem("id_toko");

        if (!idToko) throw new Error("ID Toko tidak ditemukan di localStorage.");

        const response = await axios.get(
          `http://localhost:3222/kategori/kategori-by-toko?id_toko=${encodeURIComponent(idToko)}`
        );

        const data = response.data.data;
        if (Array.isArray(data)) {
          const formattedCategories = data.map((item: any) => ({
            id_kategori: item.idKategori,
            nama: item.kategori,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on category
  const fetchProducts = async (categoryName = "Semua") => {
    try {
      setLoading(true);
      const id_toko = localStorage.getItem("id_toko");
      if (!id_toko) throw new Error("ID Toko tidak ditemukan di localStorage");

      const url =
        categoryName === "Semua"
          ? `http://localhost:3222/produk/toko/${id_toko}`
          : `http://localhost:3222/produk/toko/${id_toko}?category=${encodeURIComponent(categoryName)}`;

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products initially
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (value: string) => {
    setActiveButton(value);
    fetchProducts(value);
  };

  const filteredProducts =
    activeButton === "Semua"
      ? products
      : products.filter((produk) => produk.kategori.nama === activeButton);


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const addToCart = (produk: any) => {
    // Pastikan stok adalah angka dan tidak NaN
    const stock = parseInt(produk.stok, 10);
    if (isNaN(stock) || stock <= 0) {
      message.error(`Stok tidak tersedia untuk ${produk.nama_produk}`);
      return;
    }
  
    setCart((prevCart) => {
      // Temukan produk yang sudah ada di keranjang
      const existingProductInCart = prevCart.find(
        (item) => item.id_produk === produk.id_produk
      );
  
      // Jika produk sudah ada di keranjang, cek apakah stok mencukupi
      if (existingProductInCart) {
        const totalQuantityInCart = existingProductInCart.quantity + 1;
  
        // Perbarui kuantitas produk di keranjang jika stok mencukupi
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id_produk === produk.id_produk
              ? { ...product, stok: product.stok - 1 }
              : product
          )
        );
  
        return prevCart.map((item) =>
          item.id_produk === produk.id_produk
            ? { ...item, quantity: totalQuantityInCart }
            : item
        );
      } else {
        // Tambah produk ke keranjang jika stok cukup
        if (stock > 0) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id_produk === produk.id_produk
                ? { ...product, stok: product.stok - 1 }
                : product
            )
          );
          return [...prevCart, { ...produk, quantity: 1 }];
        } else {
          message.error(`Stok tidak mencukupi untuk ${produk.nama_produk}`);
          return prevCart;
        }
      }
    });
  };
  
  const updateQuantity = (id_produk:any, newQuantity:any) => {
    if (newQuantity === "" || isNaN(newQuantity)) {
        newQuantity = 0;
    } else {
        newQuantity = parseInt(newQuantity, 10); // Convert to integer to remove leading zeros
    }

    setCart((prevCart) => {
        return prevCart.map((item) => {
            if (item.id_produk === id_produk) {
                // Ensure the quantity is valid
                if (newQuantity < 0) {
                    newQuantity = 0;
                }

                // Calculate available stock
                const availableStock = item.stok + item.quantity;
                if (newQuantity > availableStock) {
                    message.error(`Stok tidak mencukupi untuk ${item.nama_produk}`);
                    return item;
                }

                // Update stock and quantity
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id_produk === id_produk
                            ? { ...product, stok: product.stok - (newQuantity - item.quantity) }
                            : product
                    )
                );

                return { ...item, quantity: newQuantity };
            }
            return item;
        });
    });
  };

  const handleProductClick = (produk:any) => {
    setSelectedProduct(produk.id_produk);
    addToCart(produk);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const removeFromCart = (id_produk:any) => {
    setCart((prevCart) => {
      const productToRemove = prevCart.find((item) => item.id_produk === id_produk);
  
      // Kembalikan stok saat produk dihapus dari keranjang
      if (productToRemove) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id_produk === id_produk
              ? { ...product, stok: product.stok + productToRemove.quantity }
              : product
          )
        );
      }
  
      // Hapus produk dari keranjang
      return prevCart.filter((item) => item.id_produk !== id_produk);
    });
  };

  const handleClearCart = () => {
    setCart((prevCart) => {
      // Kembalikan stok untuk setiap item di keranjang
      prevCart.forEach((item) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id_produk === item.id_produk
              ? { ...product, stok: product.stok + item.quantity }
              : product
          )
        );
      });
      return []; // Kosongkan keranjang
    });
  };
  

  const handleSubmit = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("Token tidak ditemukan");
      return;
    }
    console.log("Token found:", token);
  
    const idUser = Cookies.get("id_user");
    if (!idUser) {
      console.error("ID User tidak ditemukan di cookies");
      return;
    }
  
    const idToko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage
    if (!idToko) {
      console.error("ID Toko tidak ditemukan di localStorage");
      return;
    }
  
    const userNama = localStorage.getItem("userName");
  
    const pesananData = {
      detil_produk_pesanan: cart.map((item) => ({
        id_produk: item.id_produk,
        jumlah_produk: item.quantity,
      })),
      metode_transaksi_id: paymentMethod,
      id_user: idUser, // Sertakan id_user dari cookies
      id_toko: idToko, // Sertakan id_toko dari localStorage
    };
  
    console.log("Pesanan data yang akan dikirim:", pesananData); // Log data pesanan
  
    try {
      const response = await fetch("http://localhost:3222/pesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pesananData),
      });
  
      console.log("Response dari server:", response); // Log respons dari server
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData); // Log data kesalahan
        throw new Error(errorData.message || "Gagal menyimpan pesanan");
      }
  
      const result = await response.json();
      openSuccessNotification(result);
  
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartItem = cart.find(
            (item) => item.id_produk === product.id_produk
          );
          if (cartItem) {
            return {
              ...product,
              stok: product.stok - cartItem.quantity,
            };
          }
          return product;
        })
      );
  
      setCart([]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submitting pesanan:", error.message);
        alert(error.message);
      } else {
        console.error("Error submitting pesanan:", error);
        alert("Terjadi kesalahan pada saat mengirim pesanan.");
      }
    }
  };
  

  const totalHarga = cart.reduce(
    (total, item) => total + item.harga_produk * item.quantity,
    0
  );

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
              <Select.Option key={category.id_kategori} value={category.nama}>
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
  
            {/* Cek jika produk tidak ada */}
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">
                Produk pada kategori "{activeButton}" kosong
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filteredProducts.map((produk) => (
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
                          height: "250px",
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
                              Stok: {isNaN(produk.stok) || produk.stok === null ? "0" : produk.stok}
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
            )}
          </div>
        </div>
      </div>
  
      {/* Keranjang */}
      <div className="w-[30%] h-[calc(100vh-175px)] p-4 flex flex-col justify-between">
        <h2 className="text-lg font-bold mb-4">Pesanan ({cart.length})</h2>
        <div className="flex-grow overflow-auto scrollbar-hidden touch-scroll">
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
                        style={{ width: "100px", height: "100px" }}
                        preview={false}
                      />
                    </div>
  
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        {/* Input untuk mengubah jumlah */}
                        <input
                          type="number"
                          min="1"
                          max={item.stok + item.quantity} // Pastikan stok cukup
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id_produk, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded-md text-center"
                        />
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
          <h3 className="font-bold mb-2">Total: Rp {formatCurrency(totalHarga)}</h3>
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
