import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartRevenueProps {
  data: Array<{
    date: string;
    revenue: number;
    sales: number;
  }>;
}

const ChartRevenue: React.FC<ChartRevenueProps> = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Receita e Vendas</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              name="Receita (R$)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              name="Vendas"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartRevenue;