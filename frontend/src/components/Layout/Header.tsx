import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
      <div className="px-6 py-3 flex justify-end items-center">
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Administrador</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-primary-600" />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span className="text-xs">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;