import React from 'react';
import { Eye, XCircle, CheckCircle } from 'lucide-react';
import { Venda } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatadores';

interface VendaListProps {
  vendas: Venda[];
  onView: (venda: Venda) => void;
  onUpdateStatus: (id: number, status: string) => void;
}

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONCLUIDA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800'
};

const VendaList: React.FC<VendaListProps> = ({ vendas, onView, onUpdateStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendas.map((venda) => (
            <tr key={venda.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venda.numero}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.cliente?.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(venda.dataVenda)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(venda.total)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[venda.status as keyof typeof statusColors]}`}>
                  {venda.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onView(venda)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Eye size={18} />
                </button>
                {venda.status === 'PENDENTE' && (
                  <button onClick={() => onUpdateStatus(venda.id, 'CONCLUIDA')} className="text-green-600 hover:text-green-900 mr-3">
                    <CheckCircle size={18} />
                  </button>
                )}
                {venda.status === 'PENDENTE' && (
                  <button onClick={() => onUpdateStatus(venda.id, 'CANCELADA')} className="text-red-600 hover:text-red-900">
                    <XCircle size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vendas.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhuma venda encontrada</div>
      )}
    </div>
  );
};

export default VendaList;