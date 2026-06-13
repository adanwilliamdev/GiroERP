import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Cliente } from '../../types';

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({ clientes, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF/CNPJ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade/UF</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cpfCnpj}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cidade}/{cliente.estado}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(cliente)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Pencil size={18} />
                </button>
                <button onClick={() => onDelete(cliente.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
       </table>
      {clientes.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhum cliente cadastrado</div>
      )}
    </div>
  );
};

export default ClienteList;