import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Produto } from '../../types';
import { formatCurrency } from '../../utils/formatadores';

interface ProdutoListProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

const ProdutoList: React.FC<ProdutoListProps> = ({ produtos, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((produto) => (
            <tr key={produto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.codigo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(produto.preco)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.estoque}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(produto)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Pencil size={18} />
                </button>
                <button onClick={() => onDelete(produto.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
       </table>
      {produtos.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhum produto cadastrado</div>
      )}
    </div>
  );
};

export default ProdutoList;