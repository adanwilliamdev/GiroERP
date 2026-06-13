import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Shield, User, UserCheck, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '../utils/formatadores';

interface Usuario {
  id: number;
  username: string;
  email: string;
  nome: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  ativo: boolean;
  createdAt: string;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nome: '',
    password: '',
    role: 'USER',
    ativo: true
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      // Dados mockados para demonstração
      const mockUsuarios = [
        { 
          id: 1, 
          username: 'admin', 
          email: 'admin@giroerp.com', 
          nome: 'Administrador', 
          role: 'ADMIN' as const, 
          ativo: true, 
          createdAt: new Date().toISOString() 
        },
        { 
          id: 2, 
          username: 'vendedor1', 
          email: 'vendedor@giroerp.com', 
          nome: 'João Vendedor', 
          role: 'USER' as const, 
          ativo: true, 
          createdAt: new Date().toISOString() 
        },
        { 
          id: 3, 
          username: 'gerente1', 
          email: 'gerente@giroerp.com', 
          nome: 'Maria Gerente', 
          role: 'MANAGER' as const, 
          ativo: true, 
          createdAt: new Date().toISOString() 
        }
      ];
      setUsuarios(mockUsuarios);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedUsuario) {
        toast.success('Usuário atualizado com sucesso!');
      } else {
        toast.success('Usuário criado com sucesso!');
      }
      setModalOpen(false);
      loadUsuarios();
    } catch (error) {
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      toast.success('Usuário excluído com sucesso!');
      loadUsuarios();
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { bg: 'bg-purple-100 text-purple-800', icon: Shield, label: 'Administrador' },
      MANAGER: { bg: 'bg-blue-100 text-blue-800', icon: UserCheck, label: 'Gerente' },
      USER: { bg: 'bg-green-100 text-green-800', icon: User, label: 'Vendedor' }
    };
    const RoleIcon = config[role as keyof typeof config]?.icon || User;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config[role as keyof typeof config]?.bg}`}>
        <RoleIcon size={12} />
        {config[role as keyof typeof config]?.label}
      </span>
    );
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={() => {
            setSelectedUsuario(null);
            setFormData({ username: '', email: '', nome: '', password: '', role: 'USER', ativo: true });
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tabela de usuários */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">@{usuario.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{usuario.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(usuario.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedUsuario(usuario);
                        setFormData({
                          username: usuario.username,
                          email: usuario.email,
                          nome: usuario.nome,
                          password: '',
                          role: usuario.role,
                          ativo: usuario.ativo
                        });
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Usuário */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Usuário *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Nome *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Email *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Senha {!selectedUsuario && '*'}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder={selectedUsuario ? '••••••••' : '********'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Perfil</label>
                <select
                  className="input-field"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="USER">Vendedor</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  className="w-4 h-4"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <label htmlFor="ativo" className="text-sm text-gray-700">Usuário ativo</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} className="btn-primary">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;