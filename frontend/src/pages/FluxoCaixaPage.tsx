import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendaService } from '../services/venda.service';
import { formatCurrency, formatDate } from '../utils/formatadores';

interface Transacao {
  id: number;
  data: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  categoria: string;
  formaPagamento?: string;
}

const FluxoCaixaPage: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes'>('mes');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '',
    tipo: 'entrada' as 'entrada' | 'saida',
    valor: 0,
    categoria: '',
    data: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadTransacoes();
  }, [periodo]);

  const loadTransacoes = async () => {
    setLoading(true);
    try {
      const vendas = await vendaService.findAll(0, 100);
      const transacoesVendas = vendas.content.map(v => ({
        id: v.id,
        data: v.dataVenda,
        descricao: `Venda ${v.numero} - ${v.cliente?.nome || v.clienteNome || 'Cliente'}`,
        tipo: 'entrada' as const,
        valor: v.total,
        categoria: 'Vendas',
        formaPagamento: v.formaPagamento
      }));
      setTransacoes(transacoesVendas);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransacao = () => {
    if (!novaTransacao.descricao || novaTransacao.valor <= 0) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    const nova: Transacao = {
      id: Date.now(),
      data: novaTransacao.data,
      descricao: novaTransacao.descricao,
      tipo: novaTransacao.tipo,
      valor: novaTransacao.valor,
      categoria: novaTransacao.categoria || (novaTransacao.tipo === 'entrada' ? 'Receita' : 'Despesa')
    };

    setTransacoes([nova, ...transacoes]);
    toast.success('Movimentação adicionada com sucesso!');
    setShowForm(false);
    setNovaTransacao({
      descricao: '',
      tipo: 'entrada',
      valor: 0,
      categoria: '',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteTransacao = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
      setTransacoes(transacoes.filter(t => t.id !== id));
      toast.success('Movimentação excluída com sucesso!');
    }
  };

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  const stats = [
    { title: 'Entradas', value: formatCurrency(totalEntradas), color: 'text-green-600', bg: 'bg-green-100', icon: TrendingUp },
    { title: 'Saídas', value: formatCurrency(totalSaidas), color: 'text-red-600', bg: 'bg-red-100', icon: TrendingDown },
    { title: 'Saldo', value: formatCurrency(saldo), color: saldo >= 0 ? 'text-green-600' : 'text-red-600', bg: 'bg-blue-100', icon: DollarSign },
  ];

  const categorias = {
    entrada: ['Vendas', 'Receita', 'Transferência', 'Outros'],
    saida: ['Despesa', 'Fornecedor', 'Funcionário', 'Imposto', 'Aluguel', 'Outros']
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-gray-500 mt-1">Gerencie entradas e saídas do seu negócio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Movimentação
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros de período */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'hoje', label: 'Hoje' },
          { key: 'semana', label: 'Esta Semana' },
          { key: 'mes', label: 'Este Mês' }
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodo(p.key as any)}
            className={`px-4 py-2 rounded-lg transition-all ${
              periodo === p.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Tabela de transações */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Movimentações</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Categoria</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Valor</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transacoes.map((transacao) => (
                <tr key={transacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(transacao.data)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transacao.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{transacao.categoria}</span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {transacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDeleteTransacao(transacao.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {transacoes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Nenhuma movimentação no período
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td colSpan={3} className="px-6 py-3 text-right">Saldo:</td>
                <td className={`px-6 py-3 text-right ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(saldo)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal de Nova Movimentação */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Movimentação</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNovaTransacao({ ...novaTransacao, tipo: 'entrada' })}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      novaTransacao.tipo === 'entrada'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovaTransacao({ ...novaTransacao, tipo: 'saida' })}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      novaTransacao.tipo === 'saida'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Saída
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Data</label>
                <input
                  type="date"
                  className="input-field"
                  value={novaTransacao.data}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, data: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Descrição</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Venda de produto"
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Categoria</label>
                <select
                  className="input-field"
                  value={novaTransacao.categoria}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, categoria: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {categorias[novaTransacao.tipo].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0,00"
                  value={novaTransacao.valor || ''}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleAddTransacao} className="btn-primary">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluxoCaixaPage;