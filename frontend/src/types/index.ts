export interface Usuario {
  id: number;
  username: string;
  email: string;
  nome: string;
  role: 'ADMIN' | 'USER' | 'MANAGER';
  ativo: boolean;
}

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: number;
  numero: string;
  cliente: Cliente;
  usuario: Usuario;
  itens: ItemVenda[];
  dataVenda: string;
  subtotal: number;
  desconto: number;
  total: number;
  status: 'PENDENTE' | 'CONCLUIDA' | 'CANCELADA';
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}