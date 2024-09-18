// import { NextResponse } from 'next/server';

// // Fungsi middleware
// export function middleware(req: any) {
//   const token = req.cookies.get('token'); // Asumsi token disimpan di cookie

//   const { pathname } = req.nextUrl;

//   // Jika user mencoba mengakses halaman yang ada di folder authenticated, periksa apakah ada token
//   if (
//     pathname.startsWith('/dashboard') || 
//     pathname.startsWith('/riwayat-transaksi') || 
//     pathname.startsWith('/kategori') || 
//     pathname.startsWith('/produk')
//   ) {
//     // Jika tidak ada token, arahkan user ke halaman login
//     if (!token) {
//       return NextResponse.redirect(new URL('/login_admin', req.url));
//     }
//   }

//   // Lanjutkan request jika token ada atau halaman yang diakses bukan bagian dari "authenticated"
//   return NextResponse.next();
// }

// // Tentukan jalur mana saja yang akan dikenakan middleware
// export const config = {
//   matcher: ['/dashboard/page.tsx', '/riwayat_transaksi/page.tsx', '/kategori/page.tsx', '/produk/page.tsx'],
// };
