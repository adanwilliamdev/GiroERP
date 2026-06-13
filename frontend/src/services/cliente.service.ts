import api from './api';
import { Cliente, PageResponse } from '../types';

export const clienteService = {
  async create(cliente: Partial<Cliente>): Promise<Cliente> {
    console.log('Criando cliente no endpoint /clientes', cliente);
    const response = await api.post<Cliente>('/clientes', cliente);
    return response.data;
  },

  async findAll(page = 0, size = 10): Promise<PageResponse<Cliente>> {
    console.log('Buscando clientes no endpoint /clientes');
    const response = await api.get<PageResponse<Cliente>>('/clientes', {
      params: { page, size }
    });
    return response.data;
  },

  async findById(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  }
};