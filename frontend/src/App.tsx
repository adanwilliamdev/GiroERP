import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProdutosPage from './pages/ProdutosPage';
import ClientesPage from './pages/ClientesPage';
import VendasPage from './pages/VendasPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import NovaVendaPage from './pages/Venda/NovaVendaPage';
import UsuariosPage from './pages/UsuariosPage';
import FluxoCaixaPage from './pages/FluxoCaixaPage';
import BackupPage from './pages/BackupPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="vendas" element={<VendasPage />} />
        <Route path="vendas/nova" element={<NovaVendaPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="financeiro" element={<FluxoCaixaPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="backup" element={<BackupPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;