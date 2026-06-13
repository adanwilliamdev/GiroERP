export const validators = {
  isRequired: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  },

  isValidEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isValidCPF: (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
  }
};