import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Venda, Produto } from '../../types';
import { formatCurrency } from '../../utils/formatadores';

interface VendaFormProps {
  onSubmit: (data: Partial<Venda>) => void;
  onCancel: () => void;
  produtos: Produto[];
  isLoading?: boolean;
}

interface ItemVendaForm {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

const VendaForm: React.FC<VendaFormProps> = ({ onSubmit, onCancel, produtos, isLoading }) => {
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState<ItemVendaForm[]>([]);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const addItem = () => {
    if (!selectedProduto) return;
    const produto = produtos.find(p => p.id === Number(selectedProduto));
    if (!produto) return;

    setItens([...itens, {
      produtoId: produto.id,
      quantidade: quantidade,
      precoUnitario: produto.preco
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clienteId: Number(clienteId),
      itens: itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Selecione um cliente</option>
          {/* Aqui viriam os clientes de uma API */}
        </select>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Itens da Venda</h3>

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
          {itens.map((item, index) => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="font-medium">{produto?.nome}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantidade} x {formatCurrency(item.precoUnitario)} = {formatCurrency(item.precoUnitario * item.quantidade)}
                  </p>
                </div>
                <button type="button" onClick={() => removeItem(index)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-right mt-4 pt-4 border-t">
          <p className="text-lg font-bold">
            Total: {formatCurrency(calcularTotal())}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading || itens.length === 0 || !clienteId}>
          {isLoading ? 'Finalizando...' : 'Finalizar Venda'}
        </button>
      </div>
    </form>
  );
};

export default VendaForm;