import React from 'react';
import { GrTransaction } from 'react-icons/gr';

const TransactionCard = ({ jumlahTransaksi }: { jumlahTransaksi: number }) => {
  return (
    <div className="w-full h-[200px] bg-white p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative animate-pulseScale animate-glow">
      <h2 className="text-xl font-semibold text-center text-white p-3 absolute top-0 left-0 right-0 rounded-t-xl bg-[#0B8494]">
        Transaksi
      </h2>
      <div className="flex items-center justify-center mt-10">
        <div className="bg-blue-50 rounded-3xl w-[90px] h-[90px] flex items-center justify-center mr-12">
          <GrTransaction style={{ fontSize: 60, padding: 10 }} className="text-blue-700" />
        </div>
        <div className="mr-12">
          <p className="text-sm text-gray-500">Total transaksi</p>
          <p className="text-3xl font-bold text-gray-900">{jumlahTransaksi}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;