"use client";
import React, { useState, useEffect, useCallback } from "react";
import {Upload,Button,Form,Modal,Input,Select,Card,Pagination,message,Image,Dropdown,Menu,Row,Col,Typography,} from "antd";
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
  kategori: Kategori; // Changed from string to an object of type Kategori
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
  const [categories, setCategories] = useState<
    { id_kategori: string; nama: string }[]
  >([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [filteredProduk, setFilteredProduk] = useState<Produk[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalProduk, setTotalProduk] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToko = localStorage.getItem("id_toko"); // Ambil id_toko dari localStorage
        if (!idToko) {
          throw new Error("ID Toko tidak ditemukan di localStorage.");
        }

        // Fetch kategori
        const categoryResponse = await axios.get(
          `http://localhost:3222/kategori/kategori-by-toko?id_toko=${encodeURIComponent(
            idToko
          )}`
        );

        const categoryData = categoryResponse.data.data;
        if (Array.isArray(categoryData)) {
          const categoriesWithIds = categoryData.map((item: any) => ({
            id_kategori: item.idKategori, // Ubah sesuai dengan struktur data JSON
            nama: item.kategori, // Ubah sesuai dengan struktur data JSON
          }));
          setCategories(categoriesWithIds); // Set data kategori
        }

        // Fetch produk
        const accessToken = Cookies.get("accessToken");
        const id_user = Cookies.get("id_user"); // Ambil id_user dari cookie

        if (!id_user) {
          throw new Error("ID User tidak ditemukan.");
        }

        // Dapatkan data pengguna berdasarkan id_user
        const userResponse = await axios.get(
          `http://localhost:3222/toko/user/${id_user}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const id_toko = userResponse.data.toko.id_toko; // Ambil id_toko dari objek toko

        if (!id_toko) {
          throw new Error("ID Toko tidak ditemukan.");
        }

        // Fetch produk berdasarkan id_toko
        const produkResponse = await axios.get(
          `http://localhost:3222/produk/toko/${id_toko}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const produkData = produkResponse.data;
        if (Array.isArray(produkData)) {
          setProduk(produkData); // Set produk ke state produk
          setFilteredProduk(produkData); // Juga set filteredProduk ke produkData untuk ditampilkan pertama kali
          setTotalProduk(produkData.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const fetchProduk = async (value: any) => {
    try {
      const idToko = localStorage.getItem("id_toko"); // Mengambil id_toko dari localStorage
      const response = await axios.get(
        `http://localhost:3222/produk/search?nama_produk=${value}&id_toko=${idToko}`
      );
      const searchResult = response.data;
      setFilteredProduk(searchResult);
      setTotalProduk(searchResult.length);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const fetchProdukByStatus = async (status: any) => {
    try {
      const idToko = localStorage.getItem("id_toko"); // Mengambil id_toko dari localStorage
      const response = await axios.get(
        `http://localhost:3222/produk/aktif?status=${status}&id_toko=${idToko}` // URL yang dimodifikasi
      );

      const filteredProduk = response.data; // Sesuaikan dengan struktur respons API Anda
      setFilteredProduk(filteredProduk);
      setTotalProduk(filteredProduk.length);
    } catch (error) {
      console.error("Error fetching products by status:", error);
    }
  };

  useEffect(() => {
    fetchProdukByStatus(status); // Memanggil fungsi dengan status yang diberikan
  }, [status]);

  const fetchProdukByStok = async (order: "ASC" | "DESC") => {
    const idToko = localStorage.getItem("id_toko"); // Mengambil id_toko dari localStorage
    const url = `http://localhost:3222/produk/by-stok?sort=${order}&id_toko=${idToko}`;

    try {
      const response = await axios.get(url);
      const sortedProduk = response.data; // Sesuaikan dengan struktur respons API Anda
      setFilteredProduk(sortedProduk);
      setTotalProduk(sortedProduk.length);
    } catch (error) {
      console.error("Error fetching products by stock:", error);
    }
  };

  const fetchProdukByHarga = async (order: "ASC" | "DESC") => {
    const idToko = localStorage.getItem("id_toko"); // Mengambil id_toko dari localStorage
    const url = `http://localhost:3222/produk/by-harga?sort=${order}&id_toko=${idToko}`;

    try {
      const response = await axios.get(url);
      const sortedProduk = response.data; // Sesuaikan dengan struktur respons API Anda
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

  const handleInfoClick = (item: Produk) => {
    setSelectedProductInfo(item);
    setIsInfoModalVisible(true);
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  /**
   * Mengatur produk yang ditampilkan berdasarkan kategori yang dipilih.
   * Jika idKategori adalah "semua", maka semua produk akan ditampilkan.
   * Jika idKategori adalah id kategori yang valid, maka hanya produk yang
   * terkait dengan kategori tersebut yang akan ditampilkan.
   * @param {string} idKategori ID kategori yang dipilih
   */
  const handleFilterByCategory = async (idKategori: any) => {
    const idToko = localStorage.getItem("id_toko");

    if (idKategori === "semua") {
      // Reset selected category
      setSelectedCategory(null);

      // Set all products to be displayed
      setFilteredProduk(produk); // Ambil semua produk dari state produk

      // Set total number of products
      setTotalProduk(produk.length);

      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3222/kategori/by-kategori?id_kategori=${idKategori}&id_toko=${idToko}`
      );
      const filteredData = response.data; // Pastikan data yang diterima benar

      if (filteredData.length === 0) {
        message.warning("Tidak ada produk dalam kategori ini");
      }

      setFilteredProduk(filteredData);
    } catch (error) {
      console.error("Error filtering products by category:", error);
      message.error("Terjadi kesalahan saat memfilter produk");
    }
  };  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Nilai yang diterima dari form:", values);
  
      const id_toko = localStorage.getItem("id_toko"); // Ambil id_toko dari local storage
  
      if (!id_toko) {
        message.error("ID toko tidak ditemukan. Pastikan Anda sudah login.");
        return; // Hentikan eksekusi jika id_toko tidak ada
      }
  
      // Membuat FormData untuk upload file gambar dan data lainnya
      const formData = new FormData();
      formData.append("nama_produk", values.nama_produk);
      formData.append("harga_produk", values.harga_produk);
      formData.append("stok", values.stok);
      formData.append("id_kategori", values.id_kategori);
      formData.append("satuan_produk", values.satuan_produk);
      formData.append("id_toko", id_toko); // Tambahkan id_toko ke FormData
  
      // Pastikan gambar dipilih dan tambahkan ke formData
      const file = Array.isArray(values.gambar_produk)
        ? values.gambar_produk[0]?.originFileObj
        : values.gambar_produk?.originFileObj;
  
      if (file) {
        formData.append("gambar_produk", file); // Tambahkan gambar ke FormData
      } else {
        message.error("Silakan pilih gambar produk.");
        return;
      }
  
      // Mengirim request POST ke backend untuk menambahkan produk
      const response = await axios.post(
        `http://localhost:3222/produk/tambah-produk?id_toko=${id_toko}`,
        formData
      );
  
      // Assuming the new product data is returned in the response
      const newProduct = response.data; // Replace with the actual structure from your API response
      console.log("New product added:", newProduct);
  
      // Update the produk and filteredProduk state to immediately display the new product
      setProduk((prevProducts) => [...prevProducts, newProduct]);
      setFilteredProduk((prevFilteredProducts) => [...prevFilteredProducts, newProduct]);
  
      message.success("Produk berhasil ditambahkan");
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Gagal menambahkan produk");
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detail kesalahan:", error.response.data);
      }
    }
  };
  // Mengupdate produk dalam state produkList setelah update produk berhasil
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
      setProdukList((prevList) => {
        return prevList.map((item) =>
          item.id_produk === selectedProduk.id_produk ? response.data : item
        );
      });

      // Pastikan filteredProduk juga terupdate agar UI langsung menampilkan produk yang baru
      setFilteredProduk((prevFilteredList) => {
        return prevFilteredList.map((item) =>
          item.id_produk === selectedProduk.id_produk ? response.data : item
        );
      });

      // Setelah berhasil update, menampilkan pesan sukses dan reset form
      message.success("Produk berhasil diperbarui");
      setIsEditModalVisible(false);
      setSelectedProduk(null);
      form.resetFields();
    } catch (error) {
      // Handling error untuk Axios
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error updating product:", error.response.data);
        message.error(`Gagal memperbarui produk: ${error.response.data.message}`);
      } else {
        // Handling error umum
        console.error("Unknown error:", error);
        message.error("Gagal memperbarui produk: Data harus diisi!");
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

  // const handleSortOrderChange = ({ key }: { key: string }) => {
  //   const order = key === "harga-asc" ? "ASC" : "DESC";
  //   setSortOrder(order);
  //   fetchProdukByHarga(order);
  // };

  const handleEditClick = (item: Produk) => {
    setSelectedProduk(item);
    form.setFieldsValue(item);
    setIsEditModalVisible(true);
  };

  const handleFilterChange = ({ key }: { key: string }) => {
    setSelectedFilter(key); // Set the selected filter
    switch (key) {
      case "harga-asc":
        fetchProdukByHarga("ASC"); // Call your existing function for ascending price
        setSortOrder("ASC");
        break;
      case "harga-desc":
        fetchProdukByHarga("DESC"); // Call your existing function for descending price
        setSortOrder("DESC");
        break;
      case "stok-asc":
        fetchProdukByStok("ASC"); // Fetch products sorted by lowest stock (changed 'asc' to 'ASC')
        setSortOrder("ASC");
        break;
      case "stok-desc":
        fetchProdukByStok("DESC"); // Fetch products sorted by highest stock (changed 'desc' to 'DESC')
        setSortOrder("DESC");
        break;
      case "status-active":
        fetchProdukByStatus(StatusEnum.ACTIVE); // Fetch active products
        break;
      case "status-inactive":
        fetchProdukByStatus(StatusEnum.INACTIVE); // Fetch inactive products
        break;
      case "reset":
        // Reset the filter to show all products
        setSelectedFilter(null); // Clear selected filter
        setFilteredProduk(produk); // Reset to all products
        setTotalProduk(produk.length); // Set total products count to all
        break;
      // Add more cases for additional filters as needed
      default:
        break;
    }
  };
  
  const menu = (
    <Menu onClick={handleFilterChange}>
      <Menu.Item
        key="harga-asc"
        style={selectedFilter === "harga-asc" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Harga Terendah
      </Menu.Item>
      <Menu.Item
        key="harga-desc"
        style={selectedFilter === "harga-desc" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Harga Tertinggi
      </Menu.Item>
      <Menu.Item
        key="stok-asc"
        style={selectedFilter === "stok-asc" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Stok Terendah
      </Menu.Item>
      <Menu.Item
        key="stok-desc"
        style={selectedFilter === "stok-desc" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Stok Tertinggi
      </Menu.Item>
      <Menu.Item
        key="status-active"
        style={selectedFilter === "status-active" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Status Aktif
      </Menu.Item>
      <Menu.Item
        key="status-inactive"
        style={selectedFilter === "status-inactive" ? { backgroundColor: '#e0f7fa', fontWeight: 'bold' } : {}}
      >
        Status Tidak Aktif
      </Menu.Item>
      <Menu.Item
        key="reset"
        style={{
          color: '#f44336', // Red color for reset
          fontWeight: 'bold',
          backgroundColor: '#fff',
          borderTop: '1px solid #ddd', // Add a small border for separation
        }}
      >
        Reset Filter
      </Menu.Item>
    </Menu>
  );
  
  const { Title, Text } = Typography;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProduk = Array.isArray(filteredProduk)
    ? filteredProduk.slice(startIndex, endIndex)
    : [];

  return (
    <div className="p-4 mr-8 ml-64">
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
              Filter
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
            onChange={handleFilterByCategory}
            style={{ width: 150 }}
          >
            <Select.Option value="semua">Semua</Select.Option>
            {categories.map((category) => (
              <Select.Option
                key={category.id_kategori}
                value={category.id_kategori}
              >
                {category.nama} {/* Pastikan menggunakan category.nama */}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {filteredProduk.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 p-4">
            Produk kosong.
          </div>
        ) : (
          filteredProduk.map((item) => (
            <Card
              key={item.id_produk}
              cover={
                <Image
                  alt={item.nama_produk}
                  src={`http://localhost:3222/produk/image/${item.gambar_produk}`}
                  style={{
                    width: "100%",
                    height: "250px",
                  }}
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
                        color: item.status_produk === "aktif" ? "green" : "red",
                        marginTop: "4px",
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
                name="id_kategori"
                label="Kategori"
                rules={[{ required: true, message: "Silakan pilih kategori!" }]}
              >
                <Select>
                  {categories.map((category) => (
                    <Select.Option
                      key={category.id_kategori}
                      value={category.id_kategori}
                    >
                      {category.nama}
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
              getValueFromEvent={({ fileList }: any) => Array.isArray(fileList) ? fileList : []} // Ensure fileList is an array
              rules={[
                { required: true, message: "Silakan unggah gambar produk!" },
              ]}
            >
              <Upload
                name="gambar_produk"
                listType="picture"
                beforeUpload={() => false}
                showUploadList={{ showRemoveIcon: true }}
                accept="image/*"
                customRequest={({ file, onSuccess }: any) => {
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
                width: "100%",
                height: "250px",
              }}
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
                <td className="border-b border-gray-300 px-4 py-2">
                  Nama Kategori
                </td>
                <td className="border-b border-gray-300 px-4 py-2">
                  {selectedProductInfo.kategori?.nama}{" "}
                  {/* Mengakses nama kategori */}
                </td>
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
