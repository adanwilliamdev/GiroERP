import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Package, Users, Calendar } from 'lucide-react';
import { SalesChart } from '../components/Dashboard/SalesChart';
import { TopProducts } from '../components/Dashboard/TopProducts';
import { vendaService } from '../services/venda.service';
import { produtoService } from '../services/produto.service';
import { formatCurrency } from '../utils/formatadores';

const RelatoriosPage: React.FC = () => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [periodo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const vendas = await vendaService.findAll(0, 100);
      const produtos = await produtoService.findAll(0, 100);
      
      const salesByDay = processSalesData(vendas.content);
      const topProductsData = processTopProducts(vendas.content);
      
      setChartData(salesByDay);
      setTopProducts(topProductsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = (vendas: any[]) => {
    const grouped = vendas.reduce((acc: any, venda: any) => {
      const date = new Date(venda.dataVenda).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = { date, sales: 0, revenue: 0 };
      }
      acc[date].sales++;
      acc[date].revenue += venda.total || 0;
      return acc;
    }, {});
    
    return Object.values(grouped);
  };

  const processTopProducts = (vendas: any[]) => {
    const productSales: any = {};
    vendas.forEach((venda: any) => {
      venda.itens?.forEach((item: any) => {
        const name = item.produto?.nome;
        if (!productSales[name]) {
          productSales[name] = { name, sales: 0, revenue: 0 };
        }
        productSales[name].sales += item.quantidade;
        productSales[name].revenue += item.subtotal;
      });
    });
    
    return Object.values(productSales).sort((a: any, b: any) => b.sales - a.sales).slice(0, 5);
  };

  const exportRelatorio = () => {
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Relatórios Avançados</h1>
          <p className="text-gray-500 dark:text-gray-400">Análise detalhada do seu negócio</p>
        </div>
        <button onClick={exportRelatorio} className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Exportar
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Vendas por Período</h2>
          <div className="flex gap-2">
            {[
              { key: '7d', label: '7 dias' },
              { key: '30d', label: '30 dias' },
              { key: '90d', label: '90 dias' }
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriodo(p.key as any)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  periodo === p.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <SalesChart data={chartData} type="area" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Produtos Mais Vendidos</h2>
          <TopProducts data={topProducts} />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumo do Período</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">Total de Vendas</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {chartData.reduce((sum, d: any) => sum + d.sales, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Package className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">Produtos Vendidos</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {topProducts.reduce((sum: number, p: any) => sum + p.sales, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">Ticket Médio</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {formatCurrency(chartData.reduce((sum, d: any) => sum + d.revenue, 0) / (chartData.length || 1))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;