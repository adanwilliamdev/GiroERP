import React from 'react';
import { BarChart3 } from 'lucide-react';

const RelatoriosPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Relatórios</h1>

      <div className="card">
        <div className="text-center py-12">
          <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo em desenvolvimento</h3>
          <p className="text-gray-500">Em breve você terá acesso a relatórios gerenciais.</p>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;