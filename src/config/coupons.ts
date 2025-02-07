export interface Coupon {
  code: string;
  discount: number;
}

export const validCoupons: Record<string, number> = {
  'teste10': 0.0,  // "0.1" = 10% discount
};