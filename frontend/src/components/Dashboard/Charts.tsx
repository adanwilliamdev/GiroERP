// src/components/Dashboard/Charts.tsx
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface SalesChartProps {
  data: Array<{ date: string; sales: number; revenue: number }>;
  title?: string;
}

interface TopProductsProps {
  data: Array<{ name: string; sales: number; revenue: number }>;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, title = "Vendas por Período" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-secondary-400">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-secondary-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Legend />
          <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#4f46e5" fill="url(#colorSales)" />
          <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TopProductsChart: React.FC<TopProductsProps> = ({ data }) => {
  const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-secondary-400">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-secondary-700 mb-4">Produtos Mais Vendidos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={100} />
          <Tooltip />
          <Bar dataKey="sales" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Quantidade Vendida" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueDistribution: React.FC<{ data: Array<{ name: string; value: number }> }> = ({ data }) => {
  const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-secondary-400">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-secondary-700 mb-4">Distribuição de Receita</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};