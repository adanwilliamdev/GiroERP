import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800 sticky top-0 z-30 transition-colors duration-200">
      <div className="px-6 py-3 flex justify-end items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg transition-colors"
            title={isDark ? 'Modo claro' : 'Modo escuro'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="relative p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-900 dark:text-white">Administrador</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Admin</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <User size={14} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg transition-colors"
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