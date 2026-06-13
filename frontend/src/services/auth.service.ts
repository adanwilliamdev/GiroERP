import api from './api';
import { LoginRequest, LoginResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token saved to localStorage');
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};