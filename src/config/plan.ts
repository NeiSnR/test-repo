export interface PlanConfig {
  id: string;
  name: string;
  price: number;
  maxInstallments: number;
  pixDiscountPercentage: number; // New field for PIX discount
}

export const planConfig: PlanConfig = {
  id: 'pro-monthly',
  name: 'Projeto - 180D',
  price: 947.00,
  maxInstallments: 6,
  pixDiscountPercentage: 10 // % discount for PIX payments
};