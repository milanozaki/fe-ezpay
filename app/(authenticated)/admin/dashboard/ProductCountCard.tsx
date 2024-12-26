import React from 'react';
import { CgShoppingBag } from 'react-icons/cg';

const ProductCountCard = ({ produkCount }: { produkCount: number }) => {
  return (
    <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
      <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#31716c]">
        Jumlah Produk
      </h2>
      <div className="flex items-center justify-center mt-10 ">
        <div className="bg-green-100 rounded-3xl w-[90px] h-[90px] flex items-center justify-center mr-12">
          <CgShoppingBag style={{ fontSize: 60, padding: 5 }} className="text-green-700" />
        </div>
        <div className="mr-12">
          <p className="text-sm text-gray-500">Total produk </p>
          <p className="text-3xl font-bold text-gray-900">{produkCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCountCard;