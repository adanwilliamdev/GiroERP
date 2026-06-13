import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity
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
    faturamento: 0,
    crescimento: 12.5
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
        faturamento: faturamentoTotal,
        crescimento: 12.5
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { 
      title: 'Faturamento Total', 
      value: formatCurrency(stats.faturamento), 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-600',
      trend: '+12.5%',
      trendUp: true
    },
    { 
      title: 'Produtos', 
      value: stats.totalProdutos, 
      icon: Package, 
      gradient: 'from-blue-500 to-indigo-600',
      trend: '+3 novos',
      trendUp: true
    },
    { 
      title: 'Clientes', 
      value: stats.totalClientes, 
      icon: Users, 
      gradient: 'from-purple-500 to-pink-600',
      trend: '+8 esta semana',
      trendUp: true
    },
    { 
      title: 'Vendas', 
      value: stats.totalVendas, 
      icon: ShoppingCart, 
      gradient: 'from-orange-500 to-red-600',
      trend: stats.totalVendas > 0 ? 'Ativo' : 'Nenhuma venda',
      trendUp: stats.totalVendas > 0
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="card-gradient group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
                <p className={`text-xs mt-2 flex items-center gap-1 ${card.trendUp ? 'text-green-600' : 'text-gray-500'}`}>
                  {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.trend}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-gradient animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600">Sistema operacional normalmente</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Último backup: hoje às 03:00</p>
            </div>
          </div>
        </div>

        <div className="card-gradient animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dicas Rápidas</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-50 to-transparent">
              <p className="text-sm text-gray-700">💡 Cadastre novos produtos para aumentar suas vendas</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-50 to-transparent">
              <p className="text-sm text-gray-700">📊 Acompanhe seus relatórios mensais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;