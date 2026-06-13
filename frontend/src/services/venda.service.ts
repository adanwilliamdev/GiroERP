import api from './api';
import { Venda, PageResponse } from '../types';

export const vendaService = {
  async create(venda: any): Promise<Venda> {
    console.log('Criando venda:', venda);
    const response = await api.post<Venda>('/vendas', venda);
    return response.data;
  },

  async findAll(page = 0, size = 10): Promise<PageResponse<Venda>> {
    console.log('Buscando vendas...');
    const response = await api.get('/vendas', {
      params: { page, size }
    });
    console.log('Resposta da API:', response.data);
    
    // Garantir que retorne no formato PageResponse
    return {
      content: Array.isArray(response.data) ? response.data : (response.data?.content || []),
      totalElements: response.data?.totalElements || response.data?.length || 0,
      totalPages: response.data?.totalPages || 1,
      size: size,
      number: page
    };
  },

  async findById(id: number): Promise<Venda> {
    const response = await api.get<Venda>(`/vendas/${id}`);
    return response.data;
  },

  async updateStatus(id: number, status: string): Promise<Venda> {
    const response = await api.put<Venda>(`/vendas/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};