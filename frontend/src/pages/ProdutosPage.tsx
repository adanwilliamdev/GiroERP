import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { produtoService } from '../services/produto.service';
import { Produto, PageResponse } from '../types';
import ProdutoModal from '../components/Produtos/ProdutoModal';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const ProdutosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadProdutos();
  }, [page]);

  const loadProdutos = async () => {
    try {
      const response: PageResponse<Produto> = await produtoService.findAll(page);
      setProdutos(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (produto: Partial<Produto>) => {
    try {
      if (selectedProduto) {
        await produtoService.update(selectedProduto.id, produto);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await produtoService.create(produto);
        toast.success('Produto criado com sucesso!');
      }
      setModalOpen(false);
      setSelectedProduto(null);
      loadProdutos();
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDelete = async () => {
    if (produtoToDelete) {
      try {
        await produtoService.delete(produtoToDelete);
        toast.success('Produto excluído com sucesso!');
        loadProdutos();
      } catch (error) {
        toast.error('Erro ao excluir produto');
      } finally {
        setConfirmOpen(false);
        setProdutoToDelete(null);
      }
    }
  };

  const openEditModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setProdutoToDelete(id);
    setConfirmOpen(true);
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
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => {
            setSelectedProduto(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="card">
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
                <tr key={produto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.estoque}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(produto)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(produto.id)}
                      className="text-red-600 hover:text-red-900"
                    >
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
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {page + 1} de {totalPages}
            </span>
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

      <ProdutoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduto(null);
        }}
        onSave={handleSave}
        produto={selectedProduto}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este produto?"
      />
    </div>
  );
};

export default ProdutosPage;