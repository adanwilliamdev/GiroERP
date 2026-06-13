import React from 'react';
import { X } from 'lucide-react';
import { Venda } from '../types';
import { formatCurrency, formatDateTime } from '../../utils/formatadores';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  venda: Venda | null;
}

const VendaModal: React.FC<VendaModalProps> = ({ isOpen, onClose, venda }) => {
  if (!isOpen || !venda) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detalhes da Venda</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">Número da Venda</p>
              <p className="font-medium">{venda.numero}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data</p>
              <p className="font-medium">{formatDateTime(venda.dataVenda)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{venda.cliente?.nome || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                venda.status === 'CONCLUIDA' ? 'bg-green-100 text-green-800' :
                venda.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {venda.status === 'CONCLUIDA' ? 'Concluída' : venda.status === 'CANCELADA' ? 'Cancelada' : 'Pendente'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Itens</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Produto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qtd</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Preço</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {venda.itens?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.produto?.nome}</td>
                      <td className="px-4 py-2 text-sm">{item.quantidade}</td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(item.precoUnitario)}</td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Subtotal:</td>
                    <td className="px-4 py-2">{formatCurrency(venda.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Desconto:</td>
                    <td className="px-4 py-2">{formatCurrency(venda.desconto || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-bold">Total:</td>
                    <td className="px-4 py-2 font-bold">{formatCurrency(venda.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendaModal;