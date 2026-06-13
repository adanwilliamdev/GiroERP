import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { clienteService } from '../services/cliente.service';
import { Cliente, PageResponse } from '../types';
import ClienteModal from '../components/Clientes/ClienteModal';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadClientes();
  }, [page]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const response = await clienteService.findAll(page);
      setClientes(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (cliente: Partial<Cliente>) => {
    try {
      if (selectedCliente) {
        await clienteService.update(selectedCliente.id, cliente);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clienteService.create(cliente);
        toast.success('Cliente criado com sucesso!');
      }
      setModalOpen(false);
      setSelectedCliente(null);
      loadClientes();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async () => {
    if (clienteToDelete) {
      try {
        await clienteService.delete(clienteToDelete);
        toast.success('Cliente excluído com sucesso!');
        loadClientes();
      } catch (error) {
        toast.error('Erro ao excluir cliente');
      } finally {
        setConfirmOpen(false);
        setClienteToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => {
            setSelectedCliente(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="card">
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
                <tr key={cliente.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cpfCnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cidade}/{cliente.estado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => {
                      setSelectedCliente(cliente);
                      setModalOpen(true);
                    }} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => {
                      setClienteToDelete(cliente.id);
                      setConfirmOpen(true);
                    }} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">Página {page + 1} de {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      <ClienteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCliente(null);
        }}
        onSave={handleSave}
        cliente={selectedCliente}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este cliente?"
      />
    </div>
  );
};

export default ClientesPage;