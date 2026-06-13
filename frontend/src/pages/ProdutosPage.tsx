import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { produtoService } from '../services/produto.service';
import { Produto } from '../types';
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
    setLoading(true);
    try {
      const response = await produtoService.findAll(page);
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <button onClick={() => { setSelectedProduto(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estoque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ações</th>
              </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{produto.codigo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{produto.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{produto.categoria}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">R$ {produto.preco.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{produto.estoque}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelectedProduto(produto); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800 mr-3"><Pencil size={18} /></button>
                    <button onClick={() => { setProdutoToDelete(produto.id); setConfirmOpen(true); }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

      <ProdutoModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedProduto(null); }} onSave={handleSave} produto={selectedProduto} />
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Confirmar exclusão" message="Tem certeza que deseja excluir este produto?" />
    </div>
  );
};

export default ProdutosPage;