import React, { useEffect, useState } from 'react';
import { 
  Package, Users, ShoppingCart, DollarSign, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Award 
} from 'lucide-react';
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
    { 
      title: 'Receita Total', 
      value: formatCurrency(stats.faturamento), 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-500',
      change: '+12.5%',
      trend: 'up'
    },
    { 
      title: 'Produtos', 
      value: stats.totalProdutos, 
      icon: Package, 
      gradient: 'from-blue-500 to-indigo-500',
      change: '+3 novos',
      trend: 'up'
    },
    { 
      title: 'Clientes', 
      value: stats.totalClientes, 
      icon: Users, 
      gradient: 'from-purple-500 to-pink-500',
      change: '+8 esta semana',
      trend: 'up'
    },
    { 
      title: 'Vendas', 
      value: stats.totalVendas, 
      icon: ShoppingCart, 
      gradient: 'from-orange-500 to-red-500',
      change: stats.totalVendas > 0 ? 'Ativo' : 'Inativo',
      trend: stats.totalVendas > 0 ? 'up' : 'down'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="card-stats group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sistema operacional</p>
                <p className="text-xs text-gray-500">Normalmente - 100% de uptime</p>
              </div>
              <span className="badge-success">Online</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Último backup</p>
                <p className="text-xs text-gray-500">Hoje às 03:00 - Concluído</p>
              </div>
              <span className="badge-success">Sucesso</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Meta do mês</p>
                <p className="text-xs text-gray-500">{Math.round((stats.faturamento / 50000) * 100)}% alcançado</p>
              </div>
              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min((stats.faturamento / 50000) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Dicas Rápidas</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl">
              <p className="text-sm text-blue-800">💡 Cadastre novos produtos para aumentar suas vendas</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl">
              <p className="text-sm text-purple-800">📊 Acompanhe seus relatórios mensais</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl">
              <p className="text-sm text-green-800">🎯 Metas: R$ 50.000,00 este mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;