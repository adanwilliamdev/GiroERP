import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Search, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="glass sticky top-0 z-40 px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-200"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;