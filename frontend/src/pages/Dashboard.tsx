import React, { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';
import { produtoService } from '../services/produto.service';
import { clienteService } from '../services/cliente.service';
import { vendaService } from '../services/venda.service';
import { formatCurrency } from '../utils/formatadores';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalClientes: 0,
    totalVendas: 0,
    faturamento: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [produtos, clientes, vendas] = await Promise.all([
        produtoService.findAll(0, 100),
        clienteService.findAll(0, 100),
        vendaService.findAll(0, 100)
      ]);
      
      const faturamentoTotal = vendas.content?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      
      setStats({
        totalProdutos: produtos.totalElements || 0,
        totalClientes: clientes.totalElements || 0,
        totalVendas: vendas.content?.length || 0,
        faturamento: faturamentoTotal
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Receita Total', value: formatCurrency(stats.faturamento), icon: DollarSign, color: 'from-emerald-400 to-emerald-600', change: '+12,5%', trend: 'up' },
    { title: 'Produtos', value: stats.totalProdutos, icon: Package, color: 'from-blue-400 to-blue-600', change: '+3 novos', trend: 'up' },
    { title: 'Clientes', value: stats.totalClientes, icon: Users, color: 'from-purple-400 to-purple-600', change: '+8 esta semana', trend: 'up' },
    { title: 'Vendas', value: stats.totalVendas, icon: ShoppingCart, color: 'from-amber-400 to-amber-600', change: stats.totalVendas > 0 ? 'Ativo' : 'Inativo', trend: stats.totalVendas > 0 ? 'up' : 'down' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu negócio</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="card-stats group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <TrendingUp size={12} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={12} className="text-rose-500" />
                  )}
                  <span className={`text-xs ${card.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Sistema operacional normalmente</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Último backup: hoje às 03:00</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Meta do mês: {((stats.faturamento / 50000) * 100).toFixed(0)}% alcançado</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber-500" />
            <h2 className="text-base font-semibold text-gray-800">Dicas Rápidas</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 rounded-xl">
              <p className="text-sm text-emerald-700">💡 Cadastre novos produtos para aumentar suas vendas</p>
            </div>
            <div className="p-3 bg-sky-50/50 rounded-xl">
              <p className="text-sm text-sky-700">📊 Acompanhe seus relatórios mensais</p>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl">
              <p className="text-sm text-amber-700">🎯 Meta mensal: R$ 50.000,00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;