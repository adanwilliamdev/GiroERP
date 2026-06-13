import React from 'react';
import { useForm } from 'react-hook-form';
import { Cliente } from '../../types';

interface ClienteFormProps {
  initialData?: Cliente | null;
  onSubmit: (data: Partial<Cliente>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Cliente>>({
    defaultValues: initialData || {
      nome: '',
      cpfCnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      ativo: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            type="text"
            {...register('nome', { required: 'Nome é obrigatório' })}
            className="input-field"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
          <input
            type="text"
            {...register('cpfCnpj')}
            className="input-field"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { pattern: /^\S+@\S+$/i })}
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Email inválido</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="text"
            {...register('telefone')}
            className="input-field"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <input
          type="text"
          {...register('endereco')}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input type="text" {...register('cidade')} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <input type="text" {...register('estado')} className="input-field" maxLength={2} placeholder="SP" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <input type="text" {...register('cep')} className="input-field" placeholder="00000-000" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('ativo')} className="w-4 h-4" />
        <label className="text-sm text-gray-700">Cliente ativo</label>
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

export default ClienteForm;