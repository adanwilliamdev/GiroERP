import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendaService } from '../../services/venda.service';
import { produtoService } from '../../services/produto.service';
import { clienteService } from '../../services/cliente.service';
import { Produto, Cliente } from '../../types';
import { formatCurrency } from '../../utils/formatadores';

interface ItemVenda {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  produtoNome?: string;
}

const NovaVendaPage: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesRes, produtosRes] = await Promise.all([
        clienteService.findAll(0, 100),
        produtoService.findAll(0, 100)
      ]);
      setClientes(clientesRes.content);
      setProdutos(produtosRes.content);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
  };

  const addItem = () => {
    if (!selectedProduto) {
      toast.error('Selecione um produto');
      return;
    }
    const produto = produtos.find(p => p.id === Number(selectedProduto));
    if (!produto) return;

    setItens([...itens, {
      produtoId: produto.id,
      quantidade: quantidade,
      precoUnitario: produto.preco,
      produtoNome: produto.nome
    }]);
    setSelectedProduto('');
    setQuantidade(1);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCliente) {
      toast.error('Selecione um cliente');
      return;
    }
    if (itens.length === 0) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

    setLoading(true);
    try {
      await vendaService.create({
        clienteId: Number(selectedCliente),
        itens: itens.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade
        }))
      });
      toast.success('Venda realizada com sucesso!');
      navigate('/vendas');
    } catch (error: any) {
      console.error('Erro ao criar venda:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar venda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nova Venda</h1>
        <button onClick={() => navigate('/vendas')} className="btn-secondary">
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados da Venda</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.cpfCnpj}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens da Venda</h2>
          
          <div className="flex gap-3 mb-4">
            <select
              value={selectedProduto}
              onChange={(e) => setSelectedProduto(e.target.value)}
              className="input-field flex-1"
            >
              <option value="">Selecione um produto</option>
              {produtos.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - {formatCurrency(produto.preco)} (Estoque: {produto.estoque})
                </option>
              ))}
            </select>
            
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="1"
              className="input-field w-24"
              placeholder="Qtd"
            />
            
            <button type="button" onClick={addItem} className="btn-primary">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {itens.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex-1">
                  <p className="font-medium">{item.produtoNome}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantidade} x {formatCurrency(item.precoUnitario)} = {formatCurrency(item.precoUnitario * item.quantidade)}
                  </p>
                </div>
                <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {itens.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum item adicionado. Selecione um produto acima.
            </div>
          )}

          <div className="text-right mt-4 pt-4 border-t">
            <p className="text-lg font-bold">
              Total: {formatCurrency(calcularTotal())}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/vendas')} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading || itens.length === 0 || !selectedCliente}>
            {loading ? 'Processando...' : 'Finalizar Venda'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaVendaPage;