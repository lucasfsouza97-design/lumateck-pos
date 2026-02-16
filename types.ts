
export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  entryDate: string;
}

export interface SaleItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string[];
  status: 'COMPLETA' | 'CANCELADA' | 'ORCAMENTO';
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  email: string;
  address: string;
  birthday: string;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  type: 'PAGAR' | 'RECEBER';
  description: string;
  amount: number;
  dueDate: string;
  status: 'PAGO' | 'PENDENTE';
  category: string;
}
