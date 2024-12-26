import React from 'react';

interface Produk {
  id_produk: string;
  nama_produk: string;
  stok: number;
}

interface LowStockCardProps {
  produk: Produk[];
}

const LowStockCard: React.FC<LowStockCardProps> = ({ produk }) => {
  return (
    <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
      <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#50B498]">
        Stok Menipis
      </h2>
      <div className="mt-8">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Nama Produk</th>
              <th className="border-b p-2">Stok</th>
            </tr>
          </thead>
          <tbody>
            {produk.length > 0 ? (
              produk.slice(0, 2).map((item) => (
                <tr key={item.id_produk}>
                  <td className="border-t p-2">{item.nama_produk}</td>
                  <td className="border-t p-2">{item.stok}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="border-t p-2 text-center text-gray-500">
                  Tidak ada produk dengan stok menipis
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockCard;