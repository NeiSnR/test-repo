import React from 'react';
import { Shield } from 'lucide-react';
import type { Plan, PaymentMethod } from '../types';
import { CouponInput } from './CouponInput';
import { useCoupon } from '../context/CouponContext';

interface CheckoutSummaryProps {
  plan: Plan;
  selectedPaymentMethod: PaymentMethod | null;
  selectedInstallments: number;
}

export function CheckoutSummary({ plan, selectedPaymentMethod, selectedInstallments }: CheckoutSummaryProps) {
  const { calculateDiscountedPrice } = useCoupon();

  const getPaymentDisplay = () => {
    let finalPrice = calculateDiscountedPrice(plan.price);
    const formattedTotal = finalPrice.toFixed(2).replace('.', ',');
    
    if (selectedPaymentMethod === 'card' && selectedInstallments > 1) {
      const installmentValue = (finalPrice / selectedInstallments).toFixed(2).replace('.', ',');
      return {
        main: `${selectedInstallments}x de R$ ${installmentValue}`,
        sub: `ou R$ ${formattedTotal} à vista`
      };
    } else if (selectedPaymentMethod === 'pix') {
      const pixDiscount = finalPrice * (1 - plan.pixDiscountPercentage / 100);
      return {
        main: `R$ ${pixDiscount.toFixed(2).replace('.', ',')}`,
        sub: plan.pixDiscountPercentage > 0 
          ? `${plan.pixDiscountPercentage}% de desconto no PIX`
          : plan.plan.includes('Consultoria Online - Mensal') || plan.plan.includes('Consultoria Online - Casal')
            ? 'por mês'
            : 'à vista'
      };
    } else {
      return {
        main: `R$ ${formattedTotal}`,
        sub: plan.plan.includes('Consultoria Online - Mensal') || plan.plan.includes('Consultoria Online - Casal')
          ? 'por mês'
          : 'à vista'
      };
    }
  };

  const paymentDisplay = getPaymentDisplay();

  return (
    <div className="bg-[#1C1C1E] rounded-lg p-4 sm:p-6 space-y-6">
      <div className="bg-green-600 text-white p-3 rounded-md flex items-center justify-center space-x-2">
        <Shield className="w-5 h-5" />
        <span className="font-medium">COMPRA 100% SEGURA</span>
      </div>

      <div className="flex items-center space-x-3">
        <img
          src="https://proteam.com.br/wp-content/uploads/2025/02/ICON-BG-BLACK-SMALL.png"
          alt="PRO Team"
          className="w-16 h-16 rounded-lg object-contain bg-black"
        />
        <div>
          <h3 className="font-semibold text-lg text-white">PRO Team</h3>
          <p className="text-gray-400">{plan.plan}</p>
        </div>
      </div>

      <CouponInput />

      <div className="flex items-start justify-between">
        <div className="text-lg text-white mt-1 font-bold">Total</div>
        <div className="text-right">
          <div className="text-2xl text-green-500 font-medium">
            {paymentDisplay.main}
          </div>
          <div className="text-sm text-gray-400">
            {paymentDisplay.sub}
          </div>
        </div>
      </div>
    </div>
  );
}