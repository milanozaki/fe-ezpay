import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Daftarkan skala dan elemen yang diperlukan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesChart = ({ monthlySales }: { monthlySales: any }) => {
  const data = {
    labels: monthlySales.map((sale: any) => {
      const date = new Date(`${sale.month}-01`);
      return new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date);
    }),
    datasets: [
      {
        label: "Total Penjualan",
        data: monthlySales.map((sale: any) => sale.total),
        backgroundColor: "rgba(51, 47, 208, 1)",
        borderColor: "rgba(51, 47, 208, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Penjualan Bulanan</h2>
      {monthlySales.length > 0 ? (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Grafik Penjualan Bulanan",
              },
            },
          }}
        />
      ) : (
        <div className="text-center">Loading data...</div>
      )}
    </div>
  );
};

export default MonthlySalesChart;