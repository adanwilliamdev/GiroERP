import React from 'react';
import { useForm } from 'react-hook-form';
import { Produto } from '../../types';

interface ProdutoFormProps {
  initialData?: Produto | null;
  onSubmit: (data: Partial<Produto>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Produto>>({
    defaultValues: initialData || {
      codigo: '',
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoria: '',
      ativo: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input
            type="text"
            {...register('codigo', { required: 'Código é obrigatório' })}
            className="input-field"
          />
          {errors.codigo && <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            type="text"
            {...register('nome', { required: 'Nome é obrigatório' })}
            className="input-field"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          rows={3}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input
            type="text"
            {...register('categoria')}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
          <input
            type="number"
            step="0.01"
            {...register('preco', { required: 'Preço é obrigatório', min: 0 })}
            className="input-field"
          />
          {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
        <input
          type="number"
          {...register('estoque', { required: 'Estoque é obrigatório', min: 0 })}
          className="input-field"
        />
        {errors.estoque && <p className="text-red-500 text-sm mt-1">{errors.estoque.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('ativo')} className="w-4 h-4" />
        <label className="text-sm text-gray-700">Produto ativo</label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default ProdutoForm;