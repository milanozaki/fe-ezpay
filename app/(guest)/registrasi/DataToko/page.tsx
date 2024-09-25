// 'use client';
// import React, { useState } from 'react';
// import { Input, Button, Upload, message } from 'antd';
// import { useRouter } from 'next/navigation';
// import { UploadOutlined } from '@ant-design/icons';
// import { UploadFile } from 'antd/es/upload/interface';

// const DataToko = () => {
//   const router = useRouter();

//   // State untuk menyimpan nilai input
//   const [namaToko, setNamaToko] = useState('');
//   const [deskripsiToko, setDeskripsiToko] = useState('');
//   const [alamatToko, setAlamatToko] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   // Fungsi untuk memeriksa input dan mengirim data ke API
//   const handleKirim = async () => {
//     if (!namaToko || !deskripsiToko || !alamatToko || fileList.length === 0) {
//       message.error('Data Tidak Boleh Ada Yang Kosong!');
//       return;
//     }

//     // Ambil data pemilik toko dari localStorage
//     const pemilikTokoString = localStorage.getItem('pemilikToko');
//     const adminDto = pemilikTokoString ? JSON.parse(pemilikTokoString) : {};
    
//     // Debugging: Cek data pemilik toko
//     console.log('Data Pemilik Toko:', adminDto);

//     // Buat objek untuk dikirim ke API
//     const dataToSend = {
//       adminDto: {
//         nama: adminDto.nama,
//         email: adminDto.email,
//         no_handphone: adminDto.no_handphone,
//         password: adminDto.password,
//       },
//       tokoDto: {
//         nama_toko: namaToko,
//         alamat_toko: alamatToko,
//         deskripsi_toko: deskripsiToko,
//       },
//     };

//     // Kirim data ke API
//     try {
//       const formData = new FormData();

//       // Tambahkan adminDto dan tokoDto sebagai JSON string
//       formData.append('adminDto', JSON.stringify(dataToSend.adminDto));
//       formData.append('tokoDto', JSON.stringify(dataToSend.tokoDto));

//       // Pastikan fileList[0] ada sebelum menambahkannya
//       if (fileList.length > 0 && fileList[0]?.originFileObj) {
//         formData.append('foto', fileList[0].originFileObj); // Menambahkan foto jika ada
//       } else {
//         message.error('Foto tidak boleh kosong!');
//         return; // Keluar dari fungsi jika tidak ada foto
//       }

//       const response = await fetch('http://localhost:3222/toko/create-with-admin', {
//         method: 'POST',
//         body: formData,
//       });

//       // Periksa respons dari API
//       if (!response.ok) {
//         const errorData = await response.json();
//         const errorMessage = errorData.message || 'Registrasi gagal';
//         message.error(errorMessage);
//         return; // Keluar dari fungsi jika ada kesalahan
//       }

//       // Jika respons berhasil
//       message.success('Registrasi berhasil!');
//       localStorage.removeItem('pemilikToko');
//       router.push('/registrasi/verifikasi');

//     } catch (error: unknown) {
//       console.error('Terjadi kesalahan:', error);
//       if (error instanceof Error) {
//         message.error(error.message);
//       } else {
//         message.error('Terjadi kesalahan yang tidak diketahui');
//       }
//     }
//   };

//   return (
//     <div>
//       <div className='mb-3'>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Nama Toko</label>
//         <Input 
//           placeholder="Nama Toko" 
//           size="large" 
//           value={namaToko} 
//           onChange={(e) => setNamaToko(e.target.value)} 
//         />
//       </div>

//       <div className='mb-3'>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Deskripsi Toko</label>
//         <Input 
//           placeholder="Deskripsi Toko" 
//           size="large" 
//           value={deskripsiToko} 
//           onChange={(e) => setDeskripsiToko(e.target.value)} 
//         />
//       </div>

//       <div className='mb-3'>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Alamat Toko</label>
//         <Input 
//           placeholder="Alamat Toko" 
//           size="large" 
//           value={alamatToko} 
//           onChange={(e) => setAlamatToko(e.target.value)} 
//         />
//       </div>

//       <div className='mb-3'>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Foto Toko</label>
//         <Upload 
//           fileList={fileList} 
//           onChange={({ fileList }) => setFileList(fileList)}
//         >
//           <Button icon={<UploadOutlined />}>Upload Foto</Button>
//         </Upload>
//       </div>

//       <div className="flex justify-between w-full max-w-md mt-6 mb-16">
//         <Button type="default" size="large" onClick={() => router.push('/registrasi/DataPemilikToko')}>Kembali</Button>
//         <Button type="primary" size="large" onClick={handleKirim}>Kirim</Button>
//       </div>
//     </div>
//   );
// };

// export default DataToko;
