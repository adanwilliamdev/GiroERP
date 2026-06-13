import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, ShoppingCart, Settings, 
  TrendingUp, LogOut, Database, Shield 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/produtos', icon: Package, label: 'Produtos' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/vendas', icon: ShoppingCart, label: 'Vendas' },
    { path: '/usuarios', icon: Shield, label: 'Usuários' },
    { path: '/backup', icon: Database, label: 'Backup' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="sidebar">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">GiroERP</h1>
            <p className="text-xs text-gray-500">Gestão Empresarial</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            <item.icon size={18} />
            <span className="flex-1 text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-400 transition-all duration-200 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;