import React from 'react';

interface RevenueCardProps {
  totalHarga: number; // Tipe untuk totalHarga
  period: string; // Tipe untuk period
  setPeriod: (value: string) => void; // Tipe untuk fungsi setPeriod
}

const RevenueCard: React.FC<RevenueCardProps> = ({ totalHarga, period, setPeriod }) => {
  return (
    <div className="w-full h-full bg-gradient-to-r from-[#fc7a4a] to-[#ff6a34] p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl relative flex flex-col animate-pulseScale animate-glow">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-center text-white mb-4">Pendapatan Anda</h2>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)} // Mengubah periode saat dropdown berubah
          className="block w-8/12 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Hari Ini</option>
          <option value="yesterday">Kemarin</option>
          <option value="this_week">Minggu Ini</option>
          <option value="last_week">Minggu Lalu</option>
          <option value="this_month">Bulan Ini</option>
          <option value="last_month">Bulan Lalu</option>
          <option value="last_30_days">30 Hari Terakhir</option>
          <option value="this_quarter">Kuartal Ini</option>
          <option value="last_quarter">Kuartal Lalu</option>
          <option value="this_year">Tahun Ini</option>
          <option value="last_year">Tahun Lalu</option>
        </select>
      </div>

      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-3xl font-bold text-white">Rp {totalHarga.toLocaleString()}</p>
        <p className="text-sm text-white">Total Pendapatan Bulan Ini</p>
      </div>
    </div>
  );
};

export default RevenueCard;