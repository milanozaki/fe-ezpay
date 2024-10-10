// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   // Mengambil token dari cookies secara manual dengan menggunakan headers
//   const token = req.cookies.get('accessToken');

//   const { pathname } = req.nextUrl;

//   console.log('Token: ', token); // Cek apakah token terbaca dengan benar

//   // Halaman yang dilindungi
//   if (
//     pathname.startsWith('/admin/dashboard') || 
//     pathname.startsWith('/admin/riwayat-transaksi') || 
//     pathname.startsWith('/admin/kategori') || 
//     pathname.startsWith('/admin/produk') ||
//     pathname.startsWith('/admin/kasir_admin')
//   ) {
//     // Jika tidak ada token, arahkan ke halaman login_admin
//     if (!token) {
//       console.log('No token found, redirecting to login_admin');
//       return NextResponse.redirect(new URL('/login_admin', req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/admin/dashboard',
//     '/admin/riwayat-transaksi',
//     '/admin/kategori',
//     '/admin/produk',
//     '/admin/kasir_admin',
//   ],
// };
