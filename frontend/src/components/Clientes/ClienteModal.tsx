import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Cliente } from '../../types';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Partial<Cliente>) => void;
  cliente?: Cliente | null;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ isOpen, onClose, onSave, cliente }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Cliente>>();

  useEffect(() => {
    if (cliente) {
      reset(cliente);
    } else {
      reset({
        nome: '',
        cpfCnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        ativo: true
      });
    }
  }, [cliente, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
              <input
                type="text"
                {...register('cpfCnpj')}
                className="input-field"
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
              <input
                type="text"
                {...register('cidade')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                {...register('estado')}
                className="input-field"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input
                type="text"
                {...register('cep')}
                className="input-field"
              />
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

export default ClienteModal;