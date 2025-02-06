import React, { useState, useMemo } from 'react';
import { ArrowLeft, CreditCard, QrCode, FileText, Calendar, Clock, Smartphone, ChevronDown } from 'lucide-react';
import type { PaymentMethod } from '../types';
import type { PlanConfig } from '../config/plan';
import { useCoupon } from '../context/CouponContext';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'unknown';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onComplete: () => void;
  plan: PlanConfig;
  selectedInstallments: number;
  onInstallmentsChange: (installments: number) => void;
}

export function PaymentMethods({ 
  selectedMethod, 
  onSelectMethod, 
  onBack, 
  onComplete, 
  plan,
  selectedInstallments,
  onInstallmentsChange,
}: PaymentMethodsProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand>('unknown');
  const { calculateDiscountedPrice } = useCoupon();

  const discountedPrice = calculateDiscountedPrice(plan.price);

  const installmentOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= plan.maxInstallments; i++) {
      const installmentValue = discountedPrice / i;
      options.push({
        value: i,
        label: `${i}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} sem juros`
      });
    }
    return options;
  }, [discountedPrice, plan.maxInstallments]);

  const paymentMethods = [
    { id: 'card' as PaymentMethod, name: 'Cartão', icon: CreditCard },
    { id: 'pix' as PaymentMethod, name: 'PIX', icon: QrCode },
    { id: 'boleto' as PaymentMethod, name: 'Boleto', icon: FileText },
  ];

  const detectCardBrand = (number: string): CardBrand => {
    const cleanNumber = number.replace(/\D/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^(636368|438935|504175|451416|509048|509067|509049|509069|509050|509074|509068|509040|509045|509051|509046|509066|509047|509042|509052|509043|509064|509040)/.test(cleanNumber)) return 'elo';
    if (/^606282/.test(cleanNumber)) return 'hipercard';
    
    return 'unknown';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(value);
      setCardBrand(detectCardBrand(value));
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const getCardBrandIcon = () => {
    if (cardBrand === 'unknown' || !cardNumber) return null;

    return (
      <img
        src={`https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/${cardBrand}.svg`}
        alt={`${cardBrand} logo`}
        className="h-6 w-auto absolute right-3 top-1/2 transform -translate-y-1/2 rounded-md overflow-hidden"
      />
    );
  };

  const handleSwitchToPix = () => {
    onSelectMethod('pix');
  };

  const getPaymentDisplay = () => {
    if (selectedMethod === 'card' && selectedInstallments > 1) {
      const installmentValue = discountedPrice / selectedInstallments;
      return {
        value: installmentValue,
        text: `${selectedInstallments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')}`
      };
    } else if (selectedMethod === 'pix') {
      const pixDiscount = discountedPrice * (1 - plan.pixDiscountPercentage / 100);
      return {
        value: pixDiscount,
        text: `R$ ${pixDiscount.toFixed(2).replace('.', ',')}`
      };
    } else {
      return {
        value: discountedPrice,
        text: `R$ ${discountedPrice.toFixed(2).replace('.', ',')}`
      };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => {
              onSelectMethod(method.id);
              if (method.id !== 'card') {
                onInstallmentsChange(1);
              }
            }}
            className={`flex items-center justify-center p-3 sm:p-4 rounded-lg border ${
              selectedMethod === method.id
                ? 'border-green-500 bg-[#2C2C2E]'
                : 'border-gray-700 bg-[#2C2C2E]'
            }`}
          >
            <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            <span className="ml-2 text-sm sm:text-base text-white">{method.name}</span>
          </button>
        ))}
      </div>

      {selectedMethod === 'pix' && (
        <div className="space-y-4 bg-[#2C2C2E] p-4 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white">
                  {plan.pixDiscountPercentage > 0 
                    ? `${plan.pixDiscountPercentage}% de desconto no PIX`
                    : 'Pagamento via PIX'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Após apertar no botão <strong>Finalizar Pagamento</strong> abaixo, você poderá escanear o QR CODE ou copiar o nosso código.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white">Faça o Pagamento</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Abra o aplicativo do seu banco, escolha a opção PIX copia e cola e cole o código. Ou escaneie o QR Code. Pronto! Após realizado o pagamento, o sistema processará a compra em alguns segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'boleto' && (
        <div className="space-y-4 bg-[#2C2C2E] p-4 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white">Pague até a data de vencimento</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Faça o pagamento dentro do prazo de vencimento em qualquer instituição bancária ou lotérica.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white">Aguarde a compensação</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Pagamentos com boleto levam até 3 dias úteis para serem aprovados.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white">Deseja ter acesso imediato?</h4>
                <p className="text-xs sm:text-sm mt-1">
                  <span className="text-gray-400">Faça o pagamento via PIX </span>
                  <button 
                    onClick={handleSwitchToPix}
                    className="text-green-500 hover:text-green-400"
                  >
                    clicando aqui
                  </button>
                  <span className="text-gray-400">, a compensação é imediata.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="space-y-4 bg-[#2C2C2E] p-4 rounded-lg">
          <div>
            <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
              Número do Cartão
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="w-full rounded-md bg-[#1C1C1E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base pr-12"
                maxLength={19}
                required
              />
              {getCardBrandIcon()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                Validade
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/AA"
                className="w-full rounded-md bg-[#1C1C1E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label htmlFor="cvv" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="000"
                className="w-full rounded-md bg-[#1C1C1E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="installments" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
              Parcelas
            </label>
            <div className="relative">
              <select
                id="installments"
                value={selectedInstallments}
                onChange={(e) => onInstallmentsChange(Number(e.target.value))}
                className="w-full appearance-none rounded-md bg-[#1C1C1E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 pl-3 pr-10 sm:pl-4 sm:pr-12 text-sm sm:text-base"
              >
                {installmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                <ChevronDown className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod && (
        <div className="flex items-center justify-between py-4 border-t border-gray-700">
          <span className="text-sm sm:text-base text-gray-400">Total nesta cobrança:</span>
          <div className="text-right">
            <span className="text-base sm:text-lg font-medium text-white">
              {getPaymentDisplay().text}
            </span>
            {selectedMethod === 'pix' && plan.pixDiscountPercentage > 0 && (
              <div className="text-sm text-green-500">
                {plan.pixDiscountPercentage}% de desconto no PIX
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center py-2.5 sm:py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#2C2C2E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
        <button
          onClick={onComplete}
          disabled={!selectedMethod || (selectedMethod === 'card' && (!cardNumber || !expiryDate || !cvv))}
          className="flex-1 flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar Pagamento
        </button>
      </div>
    </div>
  );
}