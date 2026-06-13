import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, TrendingUp, Package, Users, Calendar, Printer } from 'lucide-react';
import { SalesChart } from '../components/Dashboard/SalesChart';
import { TopProducts } from '../components/Dashboard/TopProducts';
import { vendaService } from '../services/venda.service';
import { produtoService } from '../services/produto.service';
import { clienteService } from '../services/cliente.service';
import exportService from '../services/export.service';
import { formatCurrency } from '../utils/formatadores';
import toast from 'react-hot-toast';

const RelatoriosPage: React.FC = () => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [periodo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendasRes, produtosRes, clientesRes] = await Promise.all([
        vendaService.findAll(0, 100),
        produtoService.findAll(0, 100),
        clienteService.findAll(0, 100)
      ]);
      
      setVendas(vendasRes.content || []);
      setProdutos(produtosRes.content || []);
      setClientes(clientesRes.content || []);
      
      const salesByDay = processSalesData(vendasRes.content);
      const topProductsData = processTopProducts(vendasRes.content);
      
      setChartData(salesByDay);
      setTopProducts(topProductsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = (vendasData: any[]) => {
    const grouped = vendasData.reduce((acc: any, venda: any) => {
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

  const processTopProducts = (vendasData: any[]) => {
    const productSales: any = {};
    vendasData.forEach((venda: any) => {
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

  const handleExport = async (tipo: 'pdf' | 'excel', relatorio: 'vendas' | 'produtos' | 'clientes') => {
    setExportando(`${tipo}-${relatorio}`);
    try {
      let exportData;
      
      switch(relatorio) {
        case 'vendas':
          exportData = exportService.exportVendas(vendas);
          break;
        case 'produtos':
          exportData = exportService.exportProdutos(produtos);
          break;
        case 'clientes':
          exportData = exportService.exportClientes(clientes);
          break;
      }
      
      if (tipo === 'pdf') {
        exportService.exportToPDF(exportData);
      } else {
        exportService.exportToExcel(exportData);
      }
      
      toast.success(`Relatório de ${relatorio} exportado com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar relatório');
    } finally {
      setExportando(null);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h1>
          <p className="text-gray-500 mt-1">Análise detalhada e exportação de dados</p>
        </div>
      </div>

      {/* Cards de Exportação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Relatório de Vendas</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf', 'vendas')}
                disabled={exportando === 'pdf-vendas'}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Exportar PDF"
              >
                <FileText size={18} />
              </button>
              <button
                onClick={() => handleExport('excel', 'vendas')}
                disabled={exportando === 'excel-vendas'}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Exportar Excel"
              >
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">Exportar lista completa de vendas</p>
          <p className="text-xs text-gray-400 mt-2">{vendas.length} registros</p>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Relatório de Produtos</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf', 'produtos')}
                disabled={exportando === 'pdf-produtos'}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FileText size={18} />
              </button>
              <button
                onClick={() => handleExport('excel', 'produtos')}
                disabled={exportando === 'excel-produtos'}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">Exportar catálogo de produtos</p>
          <p className="text-xs text-gray-400 mt-2">{produtos.length} registros</p>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Relatório de Clientes</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf', 'clientes')}
                disabled={exportando === 'pdf-clientes'}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FileText size={18} />
              </button>
              <button
                onClick={() => handleExport('excel', 'clientes')}
                disabled={exportando === 'excel-clientes'}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">Exportar base de clientes</p>
          <p className="text-xs text-gray-400 mt-2">{clientes.length} registros</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="card">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Vendas por Período</h2>
          <div className="flex gap-2">
            {[
              { key: '7d', label: '7 dias' },
              { key: '30d', label: '30 dias' },
              { key: '90d', label: '90 dias' }
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriodo(p.key as any)}
                className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                  periodo === p.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <SalesChart data={chartData} type="area" />
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Produtos Mais Vendidos</h2>
          <TopProducts data={topProducts} />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumo do Período</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-600">Total de Vendas</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {vendas.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Produtos Vendidos</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {topProducts.reduce((sum: number, p: any) => sum + p.sales, 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-600">Ticket Médio</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {formatCurrency(vendas.reduce((sum, v: any) => sum + (v.total || 0), 0) / (vendas.length || 1))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;