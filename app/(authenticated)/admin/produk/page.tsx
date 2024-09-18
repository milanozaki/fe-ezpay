"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  Modal,
  Input,
  Select,
  Card,
  Pagination,
  message,
  Image,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { debounce } from "lodash";

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  status_produk: string;
  satuan_produk: string;
}

const ProdukPage: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<string[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [filteredProduk, setFilteredProduk] = useState<Produk[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalProduk, setTotalProduk] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    // Fetch kategori dan produk
    axios
      .get("http://localhost:3222/kategori")
      .then((response) => {
        const categoryData = response.data.data;
        if (Array.isArray(categoryData)) {
          const categoryNames = categoryData.map((item) => item.nama);
          setCategories(categoryNames);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("http://localhost:3222/produk/all")
      .then((response) => {
        const produkData = response.data.data;
        if (Array.isArray(produkData)) {
          setProduk(produkData);
          setFilteredProduk(produkData);
          setTotalProduk(produkData.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching produk:", error);
      });
  }, []);

  const fetchProduk = async (value: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3222/produk/search?nama_produk=${value}`
      );
      const searchResult = response.data;
      setFilteredProduk(searchResult);
      setTotalProduk(searchResult.length);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const fetchProdukByHarga = async (order: "ASC" | "DESC") => {
    let url = `http://localhost:3222/produk/by-harga?sort=${order}`;

    if (selectedCategory) {
      url += `&kategori=${selectedCategory}`;
    }

    try {
      const response = await axios.get(url);
      const sortedProduk = response.data;
      setFilteredProduk(sortedProduk);
      setTotalProduk(sortedProduk.length);
    } catch (error) {
      console.error("Error fetching products by price:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchProduk(value);
    }, 250),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleFilterByCategory = async (namaKategori: string) => {
    if (namaKategori === "semua") {
      setSelectedCategory(null);
      setFilteredProduk(produk);
      setTotalProduk(produk.length);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3222/kategori/produk/${namaKategori}`
        );
        const filteredData = response.data;
        if (filteredData.length === 0) {
          message.error("Tidak ada produk tersedia di kategori ini");
        }
        setSelectedCategory(namaKategori);
        setFilteredProduk(filteredData);
        setTotalProduk(filteredData.length);
      } catch (error) {
        console.error("Error filtering products by category:", error);
      }
    }
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values);
      setIsAddModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortOrderChange = ({ key }: { key: string }) => {
    const order = key === "harga-asc" ? "ASC" : "DESC";
    setSortOrder(order);
    fetchProdukByHarga(order);
  };

  const menu = (
    <Menu onClick={handleSortOrderChange}>
      <Menu.Item key="harga-asc">Harga Terendah</Menu.Item>
      <Menu.Item key="harga-desc">Harga Tertinggi</Menu.Item>
    </Menu>
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProduk = Array.isArray(filteredProduk)
    ? filteredProduk.slice(startIndex, endIndex)
    : [];

  return (
    <div className="p-4 mr-20 ml-64">
      <div className="flex justify-between items-center mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClick}
          style={{
            backgroundColor: "#3B8394",
            color: "#fff",
            borderRadius: "12px",
          }}
        >
          Tambah
        </Button>

        <div className="flex items-center">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<FilterOutlined />} style={{ marginRight: 5 }}>
              {sortOrder === null
                ? "Filter"
                : sortOrder === "ASC"
                ? "Harga Terendah"
                : "Harga Tertinggi"}
            </Button>
          </Dropdown>

          <Input
            placeholder="Cari..."
            prefix={<SearchOutlined />}
            style={{ width: 250, marginRight: 5 }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            defaultValue="semua"
            style={{ width: 150, marginRight: 5 }}
            onChange={(value) => handleFilterByCategory(value)}
          >
            <Select.Option value="semua">Semua</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {paginatedProduk.length === 0 ? (
          <div className="text-center text-gray-500">Produk tidak ada</div>
        ) : (
          paginatedProduk.map((item) => (
            <Card
              key={item.id_produk}
              cover={<Image alt={item.nama_produk} src={item.gambar_produk} />}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => console.log(`Edit ${item.nama_produk}`)}
                />,
              ]}
            >
              <Card.Meta
                title={item.nama_produk}
                description={`${item.harga_produk} USD`}
              />
            </Card>
          ))
        )}
      </div>

      {totalProduk > pageSize && (
        <Pagination
          current={currentPage}
          total={totalProduk}
          pageSize={pageSize}
          onChange={handlePageChange}
          className="flex justify-end"
        />
      )}

<Modal
        title="Tambah Produk"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            style={{ backgroundColor: "#fff", color: "#3B8394" }}
            onClick={handleCancel}
          >
            Batal
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "#3B8394", color: "#fff" }}
            onClick={handleOk}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nama_produk"
            label="Nama Produk"
            rules={[
              { required: true, message: "Silakan masukkan nama produk!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stok"
            label="Stok"
            rules={[
              { required: true, message: "Silakan masukkan stok produk!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="harga_produk"
            label="Harga Produk"
            rules={[
              { required: true, message: "Silakan masukkan harga produk!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="kategori"
            label="Kategori"
            rules={[{ required: true, message: "Silakan pilih kategori!" }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="gambar_produk"
            label="Gambar Produk"
            rules={[
              {
                required: true,
                message: "Silakan masukkan URL gambar produk!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProdukPage;
