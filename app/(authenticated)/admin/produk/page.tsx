"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Upload,
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
  Row,
  Col,
  Typography,
  Table,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { debounce } from "lodash";
import { productRepository } from "#/repository/product";

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga_produk: number;
  gambar_produk: string;
  status_produk: string;
  satuan_produk: string;
  kode_produk: string;
  stok: number;
  createdAt: Date;
  updatedAt: Date;
}

enum StatusEnum {
  ACTIVE = "aktif",
  INACTIVE = "tidak aktif",
}

const ProdukPage: React.FC = () => {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState<Produk | null>(
    null
  );
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<string[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [filteredProduk, setFilteredProduk] = useState<Produk[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalProduk, setTotalProduk] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  // const { data: dataProduct } = productRepository.hooks.useProduct();
  // console.log(dataProduct?.data.length, "dp");
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

  useEffect(() => {
    if (selectedProduk) {
      form.setFieldsValue({
        nama_produk: selectedProduk.nama_produk,
        harga_produk: selectedProduk.harga_produk,
        stok: selectedProduk.stok,
        status_produk: selectedProduk.status_produk,
      });
    }
  }, [selectedProduk, form]);

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

  const handleInfoClick = (item: Produk) => {
    setSelectedProductInfo(item);
    setIsInfoModalVisible(true);
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Tambahkan semua field dari values ke formData
      Object.keys(values).forEach((key) => {
        if (key === "kategori") {
          // Ganti nama kategori menjadi id_kategori
          formData.append("id_kategori", values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      // Menambahkan gambar jika ada
      if (values.gambar_produk && values.gambar_produk.length > 0) {
        formData.append("gambar_produk", values.gambar_produk[0].originFileObj);
      }

      console.log("Form Data being sent:", Array.from(formData.entries())); // Debugging

      // Mengirim permintaan POST untuk menambahkan produk
      await axios.post("http://localhost:3222/produk", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Menentukan tipe konten
        },
      });

      message.success("Produk berhasil ditambahkan"); // Pesan sukses
      setIsAddModalVisible(false); // Menutup modal
      form.resetFields(); // Mereset form
    } catch (error) {
      console.error("Error adding product:", error); // Logging kesalahan
      message.error("Gagal menambahkan produk"); // Pesan kesalahan umum
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detail kesalahan:", error.response.data); // Logging detail kesalahan dari server
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortOrderChange = ({ key }: { key: string }) => {
    const order = key === "harga-asc" ? "ASC" : "DESC";
    setSortOrder(order);
    fetchProdukByHarga(order);
  };

  const handleEditClick = (item: Produk) => {
    setSelectedProduk(item);
    form.setFieldsValue(item);
    setIsEditModalVisible(true);
  };

  const handleUpdateProduk = async () => {
    if (!selectedProduk) return;
    try {
      const values = await form.validateFields();

      // Membuat FormData untuk upload file gambar dan data lainnya
      const formData = new FormData();
      formData.append("nama_produk", values.nama_produk);
      formData.append("harga_produk", values.harga_produk);
      formData.append("stok", values.stok);

      // Pastikan gambar dipilih sebelum menambahkan ke formData
      if (values.gambar_produk && values.gambar_produk.file) {
        formData.append("gambar_produk", values.gambar_produk.file);
      }

      if (values.status_produk) {
        formData.append("status_produk", values.status_produk);
      }

      // Mengirim request PUT ke backend untuk update produk
      const response = await axios.put(
        `http://localhost:3222/produk/${selectedProduk.id_produk}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mengupdate produk dalam state produkList
      setProdukList((prevList) =>
        prevList.map((item) =>
          item.id_produk === selectedProduk.id_produk ? response.data : item
        )
      );

      // Setelah berhasil update, menampilkan pesan sukses dan reset form
      message.success("Produk berhasil diperbarui");
      setIsEditModalVisible(false);
      setSelectedProduk(null);
      form.resetFields();
    } catch (error) {
      // Handling error untuk Axios
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error updating product:", error.response.data);
        message.error(
          `Gagal memperbarui produk: ${error.response.data.message}`
        );
      } else {
        // Handling error umum
        console.error("Unknown error:", error);
        message.error("Gagal memperbarui produk: Data harus diisi!");
      }
    }
  };
  const menu = (
    <Menu onClick={handleSortOrderChange}>
      <Menu.Item key="harga-asc">Harga Terendah</Menu.Item>
      <Menu.Item key="harga-desc">Harga Tertinggi</Menu.Item>
    </Menu>
  );

  const { Title, Text } = Typography;

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
              cover={
                <Image
                  alt={item.nama_produk}
                  src={`http://localhost:3222/produk/image/${item.gambar_produk}`}
                  style={{
                    width: "300px",
                    height: "200px",
                    // objectFit: "cover",
                  }} // Adjusted className for size
                  preview={false}
                />
              }
              actions={[
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-400"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>,
                <Button
                  className="bg-green-600 text-white hover:bg-green-400"
                  icon={<InfoCircleOutlined />}
                  onClick={() => handleInfoClick(item)}
                >
                  Info
                </Button>,
              ]}
            >
              <Card.Meta
                title={item.nama_produk}
                description={
                  <div>
                    <span style={{ color: "black" }}>
                      Rp {formatCurrency(item.harga_produk)}
                    </span>
                    <div
                      style={{
                        color: item.status_produk === "aktif" ? "green" : "red", // Change text color based on status
                        marginTop: "4px", // Optional: Add some margin for spacing
                      }}
                    >
                      {item.status_produk}
                    </div>
                  </div>
                }
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nama_produk"
                label="Nama Produk"
                rules={[
                  { required: true, message: "Silakan masukkan nama produk!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stok"
                label="Stok"
                rules={[
                  { required: true, message: "Silakan masukkan stok produk!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="harga_produk"
                label="Harga"
                rules={[
                  { required: true, message: "Silakan masukkan harga produk!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gambar_produk"
                label="Gambar Produk"
                valuePropName="fileList"
                getValueFromEvent={({ fileList }: any) => fileList}
                rules={[
                  { required: true, message: "Silakan unggah gambar produk!" },
                ]}
              >
                <Upload
                  name="gambar_produk"
                  listType="picture"
                  beforeUpload={() => false} // Prevent automatic upload
                  showUploadList={{ showRemoveIcon: true }}
                  accept="image/*"
                  customRequest={({ file, onSuccess }: any) => {
                    // File will be handled by form submission
                    onSuccess && onSuccess(null, file);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Unggah Gambar</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="satuan_produk"
                label="Satuan"
                rules={[
                  {
                    required: true,
                    message: "Silakan masukkan satuan produk!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Edit Produk"
        visible={isEditModalVisible}
        onOk={handleUpdateProduk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nama_produk"
                label="Nama Produk"
                rules={[{ required: true, message: "Nama produk wajib diisi" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="harga_produk"
                label="Harga Produk"
                rules={[
                  { required: true, message: "Harga produk wajib diisi" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stok"
                label="Stok Produk"
                rules={[{ required: true, message: "Stok produk wajib diisi" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status_produk"
                label="Status Produk"
                rules={[
                  { required: true, message: "Status produk wajib diisi" },
                ]}
              >
                <Select>
                  <Select.Option value={StatusEnum.ACTIVE}>
                    {StatusEnum.ACTIVE}
                  </Select.Option>
                  <Select.Option value={StatusEnum.INACTIVE}>
                    {StatusEnum.INACTIVE}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gambar_produk" label="Gambar Produk">
                <Upload
                  name="gambar_produk"
                  listType="picture"
                  beforeUpload={() => false} // Prevent automatic upload
                  showUploadList={{ showRemoveIcon: true }}
                  accept="image/*"
                  customRequest={({ file, onSuccess }: any) => {
                    // File will be handled by form submission
                    onSuccess && onSuccess(null, file);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Unggah Gambar</Button>
                  <p className="text-red-500 text-xs mt-1">
                    File gambar harus berbentuk JPG, JPEG, PNG
                  </p>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Info Produk"
        visible={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={null}
      >
        {selectedProductInfo && (
          <div className="overflow-x-auto">
            <Image
              alt={selectedProductInfo.nama_produk}
              src={`http://localhost:3222/produk/image/${selectedProductInfo.gambar_produk}`}
              style={{
                width: "200px",
                height: "150px",
                // objectFit: "cover",
              }} // Adjusted className for size
              preview={false}
            />
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-green-600">
                  <th className="border-b-2 border-green-400 px-4 py-2 text-left text-white ">
                    Detail
                  </th>
                  <th className="border-b-2 border-green-400 px-4 py-2 text-left text-white">
                    Info
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">
                    ID Produk
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {selectedProductInfo.id_produk}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">
                    Nama Produk
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {selectedProductInfo.nama_produk}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">Harga</td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    Rp {formatCurrency(selectedProductInfo.harga_produk)}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">Status</td>
                  <td
                    className={`border-b border-gray-300 px-4 py-2 ${
                      selectedProductInfo.status_produk === "aktif"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {selectedProductInfo.status_produk}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">Satuan</td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {selectedProductInfo.satuan_produk}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">
                    Kode Produk
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {selectedProductInfo.kode_produk}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">Stok</td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {selectedProductInfo.stok}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">
                    Dibuat Pada
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {new Date(
                      selectedProductInfo.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 px-4 py-2">
                    Diperbarui Pada
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {new Date(
                      selectedProductInfo.updatedAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProdukPage;
