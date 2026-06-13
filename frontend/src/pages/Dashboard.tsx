import React, { useEffect, useState } from 'react';
import { 
  Package, Users, ShoppingCart, DollarSign, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Award, ChevronRight,
  BarChart3, Calendar, Clock
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
  const [metaMensal] = useState(50000);
  const [percentualMeta, setPercentualMeta] = useState(0);

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
      
      setPercentualMeta((faturamentoTotal / metaMensal) * 100);
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
      change: '+12.5%',
      trend: 'up'
    },
    { 
      title: 'Produtos', 
      value: stats.totalProdutos, 
      icon: Package, 
      change: '+3',
      trend: 'up'
    },
    { 
      title: 'Clientes', 
      value: stats.totalClientes, 
      icon: Users, 
      change: '+8',
      trend: 'up'
    },
    { 
      title: 'Vendas', 
      value: stats.totalVendas, 
      icon: ShoppingCart, 
      change: stats.totalVendas > 0 ? 'Ativo' : 'Inativo',
      trend: stats.totalVendas > 0 ? 'up' : 'down'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500 text-sm mt-1">Visão geral do seu negócio</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="card-stats">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{card.title}</p>
                <p className="stat-value mt-1">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                  )}
                  <span className={`text-xs ${card.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <card.icon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-secondary-900">Atividade Recente</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-secondary-400">Sistema Online</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Sistema operacional</p>
                <p className="text-xs text-secondary-500">Normalmente - 100% de uptime</p>
              </div>
              <span className="badge-success">Online</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Último backup</p>
                <p className="text-xs text-secondary-500">Hoje às 03:00 - Concluído</p>
              </div>
              <span className="badge-success">Sucesso</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">Meta do mês</p>
                <p className="text-xs text-secondary-500">{percentualMeta.toFixed(0)}% alcançado</p>
              </div>
              <div className="w-20 bg-secondary-200 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min(percentualMeta, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas e Insights */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-semibold text-secondary-900">Insights</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-xs text-primary-700 leading-relaxed">
                💡 Cadastre novos produtos para aumentar suas vendas
              </p>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <p className="text-xs text-secondary-600 leading-relaxed">
                📊 Acompanhe seus relatórios mensais
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-xs text-emerald-700 leading-relaxed">
                🎯 Meta mensal: {formatCurrency(metaMensal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;