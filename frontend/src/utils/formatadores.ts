export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(d);
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(d);
};

export const formatCPF = (value: string): string => {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCNPJ = (value: string): string => {
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (value: string): string => {
  return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatCEP = (value: string): string => {
  return value.replace(/(\d{5})(\d{3})/, '$1-$2');
};