// src/components/Common/EstoqueAlerta.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, X, ChevronDown, ChevronUp } from 'lucide-react';
import { produtoService } from '../../services/produto.service';
import { Produto } from '../../types';
import { formatCurrency } from '../../utils/formatadores';

export const EstoqueAlerta: React.FC = () => {
  const [produtosBaixos, setProdutosBaixos] = useState<Produto[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const response = await produtoService.findAll(0, 100);
      const baixos = response.content.filter(p => p.estoque <= 5 && p.estoque > 0);
      setProdutosBaixos(baixos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || produtosBaixos.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <span className="font-semibold text-yellow-800">
              ⚠️ Alerta de Estoque Baixo
            </span>
            <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
              {produtosBaixos.length} produtos
            </span>
          </div>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expanded && (
          <div className="border-t border-yellow-200 p-4">
            <div className="space-y-2">
              {produtosBaixos.map((produto) => (
                <div key={produto.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="text-gray-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">{produto.nome}</p>
                      <p className="text-xs text-gray-500">Código: {produto.codigo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      Estoque: {produto.estoque} unidades
                    </p>
                    <p className="text-xs text-gray-500">
                      Mínimo recomendado: {produto.estoqueMinimo || 5}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};