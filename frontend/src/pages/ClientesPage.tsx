import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { clienteService } from '../services/cliente.service';
import { Cliente } from '../types';
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
    } catch (error) {
      toast.error('Erro ao salvar cliente');
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
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gerencie seus clientes</p>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{cliente.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.cidade}/{cliente.estado}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => {
                      setSelectedCliente(cliente);
                      setModalOpen(true);
                    }} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => {
                      setClienteToDelete(cliente.id);
                      setConfirmOpen(true);
                    }} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
            <span className="px-3 py-1">Página {page + 1} de {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="px-3 py-1 border rounded disabled:opacity-50">Próxima</button>
          </div>
        )}
      </div>

      <ClienteModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedCliente(null); }} onSave={handleSave} cliente={selectedCliente} />
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Confirmar exclusão" message="Tem certeza que deseja excluir este cliente?" />
    </div>
  );
};

export default ClientesPage;