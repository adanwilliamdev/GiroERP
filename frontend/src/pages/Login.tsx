import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, Lock, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="relative max-w-md w-full mx-4">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-200 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative bg-white rounded-2xl shadow-soft p-8 animate-scale">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">GiroERP</h1>
            <p className="text-gray-500 mt-2">Sistema de Gestão Empresarial</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                {...register('username', { required: 'Usuário é obrigatório' })}
                className="input-field pl-10"
                placeholder="Usuário"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                {...register('password', { required: 'Senha é obrigatória' })}
                className="input-field pl-10"
                placeholder="Senha"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Credenciais de teste: <span className="font-mono text-gray-700">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;