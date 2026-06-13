import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, CreditCard, Smartphone, Wallet, Banknote, QrCode } from 'lucide-react';
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

interface PagamentoData {
  formaPagamento: string;
  numeroParcelas: number;
  valorEntrada: number;
  valorParcela: number;
  bandeiraCartao: string;
  ultimosDigitos: string;
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
  const [desconto, setDesconto] = useState(0);
  
  // Estado do pagamento
  const [pagamento, setPagamento] = useState<PagamentoData>({
    formaPagamento: 'dinheiro',
    numeroParcelas: 1,
    valorEntrada: 0,
    valorParcela: 0,
    bandeiraCartao: 'visa',
    ultimosDigitos: ''
  });

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
    const subtotal = itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    return subtotal - desconto;
  };

  const calcularParcelas = (numeroParcelas: number) => {
    const total = calcularTotal() - pagamento.valorEntrada;
    return total / numeroParcelas;
  };

  const atualizarPagamento = (field: keyof PagamentoData, value: any) => {
    const novoPagamento = { ...pagamento, [field]: value };
    
    if (field === 'numeroParcelas') {
      novoPagamento.valorParcela = calcularParcelas(value);
    }
    if (field === 'valorEntrada') {
      novoPagamento.valorParcela = calcularParcelas(pagamento.numeroParcelas);
    }
    
    setPagamento(novoPagamento);
  };

  const formasPagamento = [
    { id: 'dinheiro', nome: 'Dinheiro', icon: Banknote, parcelas: false, cartao: false },
    { id: 'pix', nome: 'PIX', icon: QrCode, parcelas: false, cartao: false },
    { id: 'credito', nome: 'Cartão de Crédito', icon: CreditCard, parcelas: true, cartao: true },
    { id: 'debito', nome: 'Cartão de Débito', icon: CreditCard, parcelas: false, cartao: true },
    { id: 'transferencia', nome: 'Transferência', icon: Wallet, parcelas: false, cartao: false },
  ];

  const bandeiras = [
    { id: 'visa', nome: 'Visa', cor: 'bg-blue-600' },
    { id: 'mastercard', nome: 'Mastercard', cor: 'bg-red-600' },
    { id: 'elo', nome: 'Elo', cor: 'bg-orange-600' },
    { id: 'hipercard', nome: 'Hipercard', cor: 'bg-purple-600' },
  ];

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
      const vendaData = {
        clienteId: Number(selectedCliente),
        itens: itens.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade
        })),
        desconto: desconto,
        formaPagamento: pagamento.formaPagamento,
        numeroParcelas: pagamento.numeroParcelas,
        valorEntrada: pagamento.valorEntrada,
        valorParcela: pagamento.valorParcela,
        bandeiraCartao: pagamento.bandeiraCartao,
        ultimosDigitos: pagamento.ultimosDigitos
      };
      
      await vendaService.create(vendaData);
      toast.success('Venda realizada com sucesso!');
      navigate('/vendas');
    } catch (error: any) {
      console.error('Erro ao criar venda:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar venda');
    } finally {
      setLoading(false);
    }
  };

  const total = calcularTotal();
  const parcela = pagamento.numeroParcelas > 0 ? total / pagamento.numeroParcelas : 0;

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Venda</h1>
          <p className="text-gray-500 mt-1">Preencha os dados da venda e forma de pagamento</p>
        </div>
        <button onClick={() => navigate('/vendas')} className="btn-secondary">
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados da Venda</h2>
          <div>
            <label className="input-label">Cliente *</label>
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

        {/* Produtos */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens da Venda</h2>
          
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
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.produtoNome}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantidade} x {formatCurrency(item.precoUnitario)} = {formatCurrency(item.precoUnitario * item.quantidade)}
                  </p>
                </div>
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {itens.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Nenhum item adicionado. Selecione um produto acima.
            </div>
          )}
        </div>

        {/* Desconto */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Desconto</h2>
            <div className="w-48">
              <input
                type="number"
                value={desconto}
                onChange={(e) => setDesconto(Number(e.target.value))}
                className="input-field text-right"
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {formasPagamento.map((forma) => {
              const Icon = forma.icon;
              return (
                <button
                  key={forma.id}
                  type="button"
                  onClick={() => atualizarPagamento('formaPagamento', forma.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    pagamento.formaPagamento === forma.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${
                    pagamento.formaPagamento === forma.id ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs text-center ${
                    pagamento.formaPagamento === forma.id ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    {forma.nome}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Cartão de Crédito - Parcelas */}
          {pagamento.formaPagamento === 'credito' && (
            <div className="border-t pt-4 mt-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Bandeira do Cartão</label>
                  <div className="flex gap-2">
                    {bandeiras.map((bandeira) => (
                      <button
                        key={bandeira.id}
                        type="button"
                        onClick={() => atualizarPagamento('bandeiraCartao', bandeira.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          pagamento.bandeiraCartao === bandeira.id
                            ? `${bandeira.cor} text-white`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {bandeira.nome}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Últimos 4 dígitos</label>
                  <input
                    type="text"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="input-field"
                    placeholder="****"
                    value={pagamento.ultimosDigitos}
                    onChange={(e) => atualizarPagamento('ultimosDigitos', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="input-label">Número de Parcelas</label>
                  <select
                    className="input-field"
                    value={pagamento.numeroParcelas}
                    onChange={(e) => atualizarPagamento('numeroParcelas', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <option key={n} value={n}>{n}x sem juros</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Valor da Parcela</label>
                  <input
                    type="text"
                    className="input-field bg-gray-50"
                    value={formatCurrency(parcela)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cartão de Débito */}
          {pagamento.formaPagamento === 'debito' && (
            <div className="border-t pt-4 mt-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Bandeira do Cartão</label>
                  <div className="flex gap-2">
                    {bandeiras.map((bandeira) => (
                      <button
                        key={bandeira.id}
                        type="button"
                        onClick={() => atualizarPagamento('bandeiraCartao', bandeira.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          pagamento.bandeiraCartao === bandeira.id
                            ? `${bandeira.cor} text-white`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {bandeira.nome}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Últimos 4 dígitos</label>
                  <input
                    type="text"
                    maxLength={4}
                    className="input-field"
                    placeholder="****"
                    value={pagamento.ultimosDigitos}
                    onChange={(e) => atualizarPagamento('ultimosDigitos', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumo do Pagamento */}
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0))}</span>
            </div>
            {desconto > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Desconto:</span>
                <span className="text-red-600">-{formatCurrency(desconto)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</span>
            </div>
            {pagamento.formaPagamento === 'credito' && pagamento.numeroParcelas > 1 && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-500">
                  {pagamento.numeroParcelas}x de {formatCurrency(parcela)}
                </p>
              </div>
            )}
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