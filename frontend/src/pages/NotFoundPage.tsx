import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="flex justify-center mt-4">
            <Search size={64} className="text-gray-400" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Página não encontrada
        </h2>

        <p className="text-gray-500 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={18} />
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;