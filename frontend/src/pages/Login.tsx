import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TrendingUp, Lock, Mail } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      login(response.token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-secondary-800 to-secondary-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center"></div>
      
      <div className="relative glass rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slide-down">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            GiroERP
          </h1>
          <p className="text-gray-400 mt-2">Sistema de Gestão Empresarial</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              {...register('username', { required: 'Usuário é obrigatório' })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Usuário"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              {...register('password', { required: 'Senha é obrigatória' })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Senha"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Credenciais de teste:</p>
          <p className="font-mono text-gray-300 mt-1">admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;