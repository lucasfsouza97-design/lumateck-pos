
import { Product, Customer, Transaction, UserRole, User } from './types';

export const COLORS = {
  primary: '#1E3A8A', 
  secondary: '#6D28D9', 
};

export const MOCK_USER: User = {
  id: '1',
  name: 'Administrador',
  role: UserRole.ADMIN,
  email: 'admin@lumateck.com.br'
};

export const CATEGORIES = [
  'Capinhas', 'Películas', 'Cabos', 'Carregadores', 'Fones', 'Smartphones', 'Assistência Técnica', 'Outros'
];

// Listas inicializadas vazias para uso real
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_CUSTOMERS: Customer[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
