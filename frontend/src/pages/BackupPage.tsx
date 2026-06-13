import React, { useState } from 'react';
import { Database, Download, Upload, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '../utils/formatadores';

interface Backup {
  id: number;
  nome: string;
  data: string;
  tamanho: string;
  status: 'sucesso' | 'falha';
}

const BackupPage: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    { id: 1, nome: 'backup_20240613_010000.sql', data: new Date().toISOString(), tamanho: '2.5 MB', status: 'sucesso' },
    { id: 2, nome: 'backup_20240612_010000.sql', data: new Date(Date.now() - 86400000).toISOString(), tamanho: '2.4 MB', status: 'sucesso' },
    { id: 3, nome: 'backup_20240611_010000.sql', data: new Date(Date.now() - 172800000).toISOString(), tamanho: '2.3 MB', status: 'sucesso' },
  ]);
  const [backupEmAndamento, setBackupEmAndamento] = useState(false);

  const handleBackup = async () => {
    setBackupEmAndamento(true);
    toast.loading('Realizando backup...', { id: 'backup' });
    
    setTimeout(() => {
      toast.success('Backup realizado com sucesso!', { id: 'backup' });
      setBackupEmAndamento(false);
      // Adicionar backup à lista
      const novoBackup = {
        id: backups.length + 1,
        nome: `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.sql`,
        data: new Date().toISOString(),
        tamanho: '2.5 MB',
        status: 'sucesso' as const
      };
      setBackups([novoBackup, ...backups]);
    }, 2000);
  };

  const handleRestore = async (backup: Backup) => {
    if (confirm(`Deseja restaurar o backup ${backup.nome}? Esta ação irá sobrescrever todos os dados atuais.`)) {
      toast.loading('Restaurando backup...', { id: 'restore' });
      setTimeout(() => {
        toast.success('Backup restaurado com sucesso!', { id: 'restore' });
      }, 2000);
    }
  };

  const handleDownload = (backup: Backup) => {
    toast.success(`Download de ${backup.nome} iniciado`);
  };

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
          {backupEmAndamento ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Database size={18} />
          )}
          {backupEmAndamento ? 'Backup em andamento...' : 'Realizar Backup'}
        </button>
      </div>

      {/* Configurações de backup automático */}
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
            <span className="badge-success">Ativo</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="text-primary-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Retenção de Backups</p>
                <p className="text-sm text-gray-500">Manter últimos 30 dias</p>
              </div>
            </div>
            <span className="badge-success">Configurado</span>
          </div>
        </div>
      </div>

      {/* Lista de backups */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backups Realizados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nome do Backup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tamanho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{backup.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(backup.data)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{backup.tamanho}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle size={12} />
                      Sucesso
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(backup)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Restaurar"
                      >
                        <Upload size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(backup)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupPage;