export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  pixDiscountPercentage: number;
}

export type PaymentMethod = 'pix' | 'boleto' | 'card';

export type CheckoutStep = 'user-data' | 'payment' | 'access';