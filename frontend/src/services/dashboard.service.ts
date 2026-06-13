import api from './api';

export interface DashboardData {
  totalVendasMes: number;
  quantidadeVendasMes: number;
  totalClientes: number;
  totalProdutos: number;
  vendasPorStatus: Array<[string, number]>;
  topProdutos: Array<[number, string, number, number]>;
  ultimasVendas: Array<any>;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/dashboard');
    return response.data;
  },

  async getDailySales(startDate: string, endDate: string): Promise<any[]> {
    const response = await api.get('/relatorios/vendas/daily', {
      params: { startDate, endDate }
    });
    return response.data;
  }
};