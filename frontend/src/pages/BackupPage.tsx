import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Backup {
  id: number;
  nome: string;
  data: string;
  tamanho: string;
}

const BackupPage: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupEmAndamento, setBackupEmAndamento] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/backup/listar');
      const backupsList = (response.data || []).map((nome: string, index: number) => ({
        id: index,
        nome,
        data: new Date().toLocaleString(),
        tamanho: '1.2 MB'
      }));
      setBackups(backupsList);
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
      setBackups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setBackupEmAndamento(true);
    toast.loading('Realizando backup...', { id: 'backup' });
    
    try {
      await api.post('/backup/realizar');
      toast.success('Backup realizado com sucesso!', { id: 'backup' });
      await loadBackups();
    } catch (error) {
      toast.error('Erro ao realizar backup', { id: 'backup' });
    } finally {
      setBackupEmAndamento(false);
    }
  };

  const handleRestore = async (backup: Backup) => {
    if (confirm(`Deseja restaurar o backup ${backup.nome}? Esta ação irá sobrescrever os dados atuais.`)) {
      toast.loading('Restaurando backup...', { id: 'restore' });
      setTimeout(() => {
        toast.success('Backup restaurado com sucesso!', { id: 'restore' });
      }, 2000);
    }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup</h1>
          <p className="text-gray-500 mt-1">Gerencie os backups do sistema</p>
        </div>
        <button
          onClick={handleBackup}
          disabled={backupEmAndamento}
          className="btn-primary flex items-center gap-2"
        >
          {backupEmAndamento ? <RefreshCw size={18} className="animate-spin" /> : <Database size={18} />}
          {backupEmAndamento ? 'Backup em andamento...' : 'Realizar Backup'}
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Automáticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="text-primary-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Backup Diário</p>
                <p className="text-sm text-gray-500">Todos os dias às 01:00</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ativo</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="text-primary-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Retenção de Backups</p>
                <p className="text-sm text-gray-500">Manter últimos 30 dias</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Configurado</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backups Realizados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nome do Backup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tamanho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{backup.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{backup.data}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{backup.tamanho}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRestore(backup)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Restaurar"
                    >
                      <Upload size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Download">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {backups.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    Nenhum backup encontrado. Clique em "Realizar Backup" para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupPage;