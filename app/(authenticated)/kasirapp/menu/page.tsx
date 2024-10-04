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
  const [paymentMethod, setPaymentMethod] = useState<string>("Tunai");
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

    fetchCategories();
    fetchProducts();
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
    const existingProduct = cart.find(
      (item) => item.id_produk === produk.id_produk
    );
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id_produk === produk.id_produk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...produk, quantity: 1 }]);
    }
  };

  const handleProductClick = (produk: Produk) => {
    setSelectedProduct(produk.id_produk); // Tandai produk sebagai yang dipilih
    addToCart(produk); // Tambahkan ke keranjang
    setTimeout(() => setSelectedProduct(null), 300); // Hapus efek setelah beberapa waktu
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
    // Hapus semua item dari cart
    setCart([]); 
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
      <div className="w-[25%] h-[calc(100vh-175px)] p-4 bg-blue-100 flex flex-col justify-between">
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
                  <div className="flex justify-between items-center">
                    {/* Nama produk */}
                    <span className="text-xs">{item.nama_produk}</span>
  
                    {/* Kontrol kuantitas */}
                    <div className="flex items-center">
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
                    <span className="mr-4">
                      Rp {formatCurrency(item.harga_produk)}
                    </span>
  
                    {/* Tombol hapus */}
                    <Button
                      type="link"
                      onClick={() => removeFromCart(item.id_produk)}
                      className="text-red-500"
                      icon={<DeleteOutlined />}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <div className="mt-4 font-bold">
          Total: Rp {formatCurrency(totalHarga)}
        </div>
  
        <div className="mt-4">
          <Button
            type={paymentMethod === "Tunai" ? "primary" : "default"}
            onClick={() => setPaymentMethod("Tunai")}
          >
            Tunai
          </Button>
          <Button
            type={paymentMethod === "Qris" ? "primary" : "default"}
            onClick={() => setPaymentMethod("Qris")}
            className="ml-2"
          >
            Qris
          </Button>
        </div>
        <div className="flex mt-4 gap-2">
          <Button
          className="w-[60px] h-[40px] bg-white border-none"
          onClick={handleClearCart}
          icon={<DeleteOutlined />}
          title="Hapus semua produk"
        />
        <Button className="w-[calc(120%-80px)] h-[40px] bg-blue-500 text-white">
          Bayar
        </Button>
        
      </div>
      </div>
    </div>
  );
  };

export default MenuPage;
