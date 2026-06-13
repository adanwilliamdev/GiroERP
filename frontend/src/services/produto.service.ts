import api from './api';
import { Produto, PageResponse } from '../types';

export const produtoService = {
  async create(produto: Partial<Produto>): Promise<Produto> {
    const response = await api.post<Produto>('/produtos', produto);
    return response.data;
  },

  async findAll(page = 0, size = 10): Promise<PageResponse<Produto>> {
    const response = await api.get<PageResponse<Produto>>('/produtos', {
      params: { page, size }
    });
    return response.data;
  },

  async findById(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  async update(id: number, produto: Partial<Produto>): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, produto);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }
};