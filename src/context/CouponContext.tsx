import React, { createContext, useContext, useState } from 'react';

interface Coupon {
  code: string;
  discount: number;
}

interface CouponContextType {
  appliedCoupon: Coupon | null;
  isCouponValid: boolean | null;
  validateAndApplyCoupon: (code: string) => void;
  clearCoupon: () => void;
  calculateDiscountedPrice: (price: number) => number;
}

const validCoupons: Record<string, number> = {
  'teste90': 0.9,  // 90% discount
  'teste10': 0.1,  // 10% discount
  'teste100': 1, // 10% discount (keeping the existing one)
  'desconto10': 0.1, // 10% discount (keeping the existing one)
};

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCouponValid, setIsCouponValid] = useState<boolean | null>(null);

  const validateAndApplyCoupon = (code: string) => {
    const discount = validCoupons[code.toLowerCase()];
    const isValid = discount !== undefined;
    
    setIsCouponValid(isValid);
    if (isValid) {
      setAppliedCoupon({ code, discount });
    } else {
      setAppliedCoupon(null);
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setIsCouponValid(null);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!appliedCoupon) return price;
    return price * (1 - appliedCoupon.discount);
  };

  return (
    <CouponContext.Provider 
      value={{ 
        appliedCoupon, 
        isCouponValid, 
        validateAndApplyCoupon, 
        clearCoupon,
        calculateDiscountedPrice
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
}