import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [userName] = React.useState('Administrador');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="px-6 py-3 flex justify-end items-center">
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-secondary-500 hover:text-secondary-700 rounded-lg transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-900">{userName}</p>
              <p className="text-xs text-secondary-500">Administrador</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-primary-600" />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
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