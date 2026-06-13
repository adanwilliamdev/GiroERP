import React from 'react';
import { TrendingUp, Users, Package, ShoppingCart } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {trend !== undefined && (
          <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mês anterior
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

interface StatsCardsProps {
  stats: {
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    totalSales: number;
    revenueTrend?: number;
    customersTrend?: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Faturamento Total"
        value={`R$ ${stats.totalRevenue.toFixed(2)}`}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        trend={stats.revenueTrend}
        color="bg-blue-500"
      />
      <StatCard
        title="Clientes"
        value={stats.totalCustomers}
        icon={<Users className="w-6 h-6 text-white" />}
        trend={stats.customersTrend}
        color="bg-green-500"
      />
      <StatCard
        title="Produtos"
        value={stats.totalProducts}
        icon={<Package className="w-6 h-6 text-white" />}
        color="bg-purple-500"
      />
      <StatCard
        title="Vendas"
        value={stats.totalSales}
        icon={<ShoppingCart className="w-6 h-6 text-white" />}
        color="bg-yellow-500"
      />
    </div>
  );
};

export default StatsCards;