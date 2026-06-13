import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vendaService } from '../services/venda.service';
import { formatCurrency, formatDateTime } from '../utils/formatadores';

const VendasPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendas();
  }, []);

  const loadVendas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Carregando vendas...');
      const response = await vendaService.findAll(0, 100);
      console.log('Resposta:', response);
      // Garantir que response.content seja um array
      setVendas(Array.isArray(response?.content) ? response.content : []);
    } catch (error: any) {
      console.error('Erro ao carregar vendas:', error);
      setError(error.response?.data?.message || 'Erro ao carregar vendas');
      toast.error('Erro ao carregar vendas');
      setVendas([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button onClick={loadVendas} className="btn-primary">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendas</h1>
        <button
          onClick={() => navigate('/vendas/nova')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      <div className="card">
        {vendas.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda cadastrada</h3>
            <p className="text-gray-500 mb-4">Clique em "Nova Venda" para começar.</p>
            <button onClick={() => navigate('/vendas/nova')} className="btn-primary">
              Nova Venda
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venda.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.clienteNome || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venda.dataVenda ? formatDateTime(venda.dataVenda) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venda.total ? formatCurrency(venda.total) : formatCurrency(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        venda.status === 'CONCLUIDA' ? 'bg-green-100 text-green-800' :
                        venda.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {venda.status === 'CONCLUIDA' ? 'Concluída' : venda.status === 'CANCELADA' ? 'Cancelada' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendasPage;