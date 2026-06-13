import React, { useState } from 'react';
import { Save, Bell, Lock, User, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfiguracoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Lock },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h1>

      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === 'perfil' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" className="input-field" defaultValue="Administrador" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input-field" defaultValue="admin@giroerp.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="text" className="input-field" defaultValue="(11) 99999-9999" />
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Notificações por Email</h3>
                  <p className="text-sm text-gray-500">Receber notificações por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Notificações Push</h3>
                  <p className="text-sm text-gray-500">Receber notificações push no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input type="password" className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'aparencia' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                <select className="input-field">
                  <option>Claro</option>
                  <option>Escuro</option>
                  <option>Sistema</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;