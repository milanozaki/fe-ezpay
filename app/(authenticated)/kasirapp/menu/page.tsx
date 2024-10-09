"use client";
import React, { useEffect, useState } from "react";
import { Select, Card, Image, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  stok: number;
  quantity: number;
  kategori: {
    nama: string;
  };
}

const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Produk[]>([]);
  const [activeButton, setActiveButton] = useState<string>("Semua");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Produk[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { id: string; nama: string }[]
  >([]);
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
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3222/produk/all");
        const data = await response.json();
        setProducts(data.data);
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
        // Set default payment method to the first method
        if (data.length > 0) {
          setPaymentMethod(data[0].id);
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
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id_produk === produk.id_produk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...produk, quantity: 1 }];
    });
  };

  const handleProductClick = (produk: Produk) => {
    setSelectedProduct(produk.id_produk);
    addToCart(produk);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const removeFromCart = (id_produk: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id_produk !== id_produk)
    );
  };

  const updateQuantity = (id_produk: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id_produk === id_produk
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token'); // Get token from local storage
    if (!token) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      return;
    }
    const pesananData = {
      detil_produk_pesanan: cart.map((item) => ({
        id_produk: item.id_produk,
        jumlah_produk: item.quantity,
      })),
      metode_transaksi_id: paymentMethod, // UUID dari metode pembayaran
      token, // ganti dengan token valid
    };

    try {
      const response = await fetch("http://localhost:3222/pesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the header
        },
        body: JSON.stringify(pesananData),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan pesanan");
      }

      const result = await response.json();
      alert("Pesanan berhasil: " + JSON.stringify(result));
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
    <div className="flex w-full h-full gap-4 max-w-screen overflow-hidden">
      {/* Mengurangi margin kiri */}
      <div className="w-[75%] h-[calc(100vh-200px)] mr-0 p-0">
        {/* Menghilangkan margin di sisi kanan dan padding */}
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
              {filteredProducts.map((produk: Produk) => (
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
                        width: "350px",
                        height: "250px",
                      }}
                      preview={false}
                    />
                  }
                  onClick={() => handleProductClick(produk)}
                >
                  <Card.Meta
                    title={produk.nama_produk}
                    description={
                      <span style={{ color: "black" }}>
                        Rp {formatCurrency(produk.harga_produk)}
                      </span>
                    }
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keranjang */}
      <div className="w-[25%] h-[calc(100vh-175px)] p-4 flex flex-col justify-between">
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
                      {/* Nama produk */}
                      <span className="text-sm-bold text-pretty w-1/4 mr-2">
                        {item.nama_produk}
                      </span>

                      {/* Kontrol kuantitas */}
                      <div className="flex items-center w-1/4 justify-center">
                        <Button
                          className="border-none bg-transparent"
                          onClick={() => updateQuantity(item.id_produk, -1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          className="border-none bg-transparent"
                          onClick={() => updateQuantity(item.id_produk, 1)}
                        >
                          +
                        </Button>
                      </div>

                      {/* Harga produk */}
                      <span className="ml-1 mr-4 w-1/5 text-center">
                        Rp {formatCurrency(item.harga_produk)}
                      </span>

                      {/* Tombol hapus */}
                      <Button
                        type="link"
                        onClick={() => removeFromCart(item.id_produk)}
                        className="text-red-500 justify-end"
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <hr className="mb-4" />
          <div className="flex justify-between">
            <span>Total Harga:</span>
            <span className="font-bold">Rp {formatCurrency(totalHarga)}</span>
          </div>
          <Select
            value={paymentMethod}
            style={{ width: "100%" }}
            onChange={(value) => setPaymentMethod(value)}
          >
            {paymentMethods.map((method) => (
              <Select.Option key={method.id} value={method.id}>
                {method.nama}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={cart.length === 0}
          >
            Bayar
          </Button>
          <Button
            type="default"
            className="mt-4 w-full"
            onClick={handleClearCart}
            disabled={cart.length === 0}
          >
            Kosongkan Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
