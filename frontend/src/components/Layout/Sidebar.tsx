import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  TrendingUp,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-400' },
    { path: '/produtos', icon: Package, label: 'Produtos', color: 'text-emerald-400' },
    { path: '/clientes', icon: Users, label: 'Clientes', color: 'text-purple-400' },
    { path: '/vendas', icon: ShoppingCart, label: 'Vendas', color: 'text-orange-400' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios', color: 'text-cyan-400' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações', color: 'text-gray-400' },
  ];

  return (
    <aside className="sidebar w-72 min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-secondary-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              GiroERP
            </h1>
            <p className="text-secondary-400 text-xs mt-0.5">Sistema de Gestão</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <p className="text-secondary-500 text-xs uppercase tracking-wider px-4 mb-3">Menu Principal</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-3 my-1 rounded-xl text-secondary-300 transition-all duration-300 hover:bg-white/10 hover:text-white hover:translate-x-1 ${
                isActive ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-white border-r-2 border-primary-500 shadow-lg' : ''
              }`
            }
          >
            <item.icon size={20} className={item.color} />
            <span className="flex-1">{item.label}</span>
            {item.label === 'Vendas' && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                Novo
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-secondary-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mx-3 my-1 rounded-xl text-red-400 transition-all duration-300 hover:bg-red-500/10 w-full"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;