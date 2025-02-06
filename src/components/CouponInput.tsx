import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { useCoupon } from '../context/CouponContext';

export function CouponInput() {
  const [couponCode, setCouponCode] = useState('');
  const { validateAndApplyCoupon, isCouponValid, appliedCoupon } = useCoupon();

  const getBorderColor = () => {
    if (isCouponValid === true) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    if (isCouponValid === false) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    return 'border-gray-700 focus:border-white focus:ring-white';
  };

  const handleApplyCoupon = () => {
    validateAndApplyCoupon(couponCode);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="coupon" className="block text-sm font-medium text-gray-400">
        Cupom de desconto
      </label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md bg-[#2C2C2E] text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${getBorderColor()}`}
            placeholder="Digite seu cupom"
          />
        </div>
        <button
          onClick={handleApplyCoupon}
          className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-white hover:bg-[#2C2C2E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Aplicar
        </button>
      </div>
      {isCouponValid !== null && (
        <p className={`text-sm ${isCouponValid ? 'text-green-500' : 'text-red-500'}`}>
          {isCouponValid ? (
            appliedCoupon 
              ? `Cupom aplicado com sucesso! (${appliedCoupon.discount * 100}% de desconto)`
              : 'Cupom aplicado com sucesso!'
          ) : 'Cupom inválido'}
        </p>
      )}
    </div>
  );
}