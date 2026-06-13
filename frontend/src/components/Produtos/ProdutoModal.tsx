import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Produto } from '../../types';

interface ProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: Partial<Produto>) => void;
  produto?: Produto | null;
}

const ProdutoModal: React.FC<ProdutoModalProps> = ({ isOpen, onClose, onSave, produto }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Produto>>();

  useEffect(() => {
    if (produto) {
      reset(produto);
    } else {
      reset({
        codigo: '',
        nome: '',
        descricao: '',
        preco: 0,
        estoque: 0,
        categoria: '',
        ativo: true
      });
    }
  }, [produto, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {produto ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <input
              type="text"
              {...register('codigo', { required: 'Código é obrigatório' })}
              className="input-field"
            />
            {errors.codigo && <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              {...register('nome', { required: 'Nome é obrigatório' })}
              className="input-field"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <input
              type="text"
              {...register('categoria')}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
              <input
                type="number"
                step="0.01"
                {...register('preco', { required: 'Preço é obrigatório', min: 0 })}
                className="input-field"
              />
              {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input
                type="number"
                {...register('estoque', { required: 'Estoque é obrigatório', min: 0 })}
                className="input-field"
              />
              {errors.estoque && <p className="text-red-500 text-sm mt-1">{errors.estoque.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoModal;