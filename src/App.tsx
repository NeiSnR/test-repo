import React, { useState } from 'react';
import { Lock, CheckCircle2, Barcode } from 'lucide-react';
import { CheckoutSteps } from './components/CheckoutSteps';
import { UserDataForm } from './components/UserDataForm';
import { PaymentMethods } from './components/PaymentMethods';
import { WhatsAppSupport } from './components/WhatsAppSupport';
import { CheckoutSummary } from './components/CheckoutSummary';
import { planConfig } from './config/plan';
import type { UserData, PaymentMethod, CheckoutStep } from './types';

function App() {
  const [step, setStep] = useState<CheckoutStep>('user-data');
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedInstallments, setSelectedInstallments] = useState(1);

  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data);
    setStep('payment');
  };

  const handleUserDataChange = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handlePaymentComplete = () => {
    setStep('access');
    console.log('Processing payment...');
  };

  // Extract the seals section from CheckoutSummary
  const SealsSection = () => (
    <div className="bg-[#111113] rounded-lg p-4 sm:p-6">
      <div className="space-y-6">
        {/* Processador de Pagamento */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">Pagamento processado por:</span>
          <img
            src="https://proteam.com.br/wp-content/uploads/2025/02/Logo_Asaas_Branca-1.png"
            alt="Asaas"
            className="h-4 w-auto -translate-y-[2px] opacity-60"
          />
        </div>

        {/* Selos de Segurança */}
        <div className="flex justify-start gap-6">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <div className="text-xs">
              <p className="text-gray-400">SSL Seguro</p>
              <p className="text-gray-500">Seus dados estão protegidos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
            <div className="text-xs">
              <p className="text-gray-400">Compra Garantida</p>
              <p className="text-gray-500">Satisfação ou reembolso</p>
            </div>
          </div>
        </div>

        {/* Bandeiras e Métodos de Pagamento */}
        <div className="pt-2 flex items-start">
          <div className="flex items-start space-x-3">
            <img
              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/visa.svg"
              alt="Visa"
              className="h-5 w-auto opacity-50 grayscale"
            />
            <img
              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/mastercard.svg"
              alt="Mastercard"
              className="h-5 w-auto opacity-50 grayscale"
            />
            <img
              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/amex.svg"
              alt="American Express"
              className="h-5 w-auto opacity-50 grayscale"
            />
            <img
              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/elo.svg"
              alt="Elo"
              className="h-5 w-auto opacity-50 grayscale"
            />
            <img
              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/hipercard.svg"
              alt="Hipercard"
              className="h-5 w-auto opacity-50 grayscale"
            />
          </div>
          
          {/* Separador Vertical */}
          <div className="mx-3 h-5 w-px bg-gray-700" />
          
          {/* PIX e Boleto */}
          <div className="flex items-start space-x-3">
            <img
              src="https://logospng.org/download/pix/logo-pix-icone-512.png"
              alt="PIX"
              className="h-5 w-auto opacity-50 grayscale"
            />
            <Barcode className="h-5 w-5 text-gray-400 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111113] text-white flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:py-16 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">Finalize Sua Compra</h1>
        
        <div className="flex flex-col gap-6 lg:gap-8 justify-center">
          {/* Summary Card - Always on top for mobile, moves to right on desktop */}
          <div className="lg:hidden">
            <CheckoutSummary 
              plan={planConfig}
              selectedPaymentMethod={selectedPaymentMethod}
              selectedInstallments={selectedInstallments}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-[#1C1C1E] rounded-lg shadow-xl overflow-hidden">
                <CheckoutSteps currentStep={step} />
                
                <div className="p-4 sm:p-6">
                  {step === 'user-data' && (
                    <UserDataForm
                      userData={userData}
                      onSubmit={handleUserDataSubmit}
                      onChange={handleUserDataChange}
                    />
                  )}

                  {step === 'payment' && (
                    <PaymentMethods
                      selectedMethod={selectedPaymentMethod}
                      onSelectMethod={setSelectedPaymentMethod}
                      onBack={() => setStep('user-data')}
                      onComplete={handlePaymentComplete}
                      plan={planConfig}
                      selectedInstallments={selectedInstallments}
                      onInstallmentsChange={setSelectedInstallments}
                    />
                  )}

                  {step === 'access' && (
                    <div className="text-center py-8">
                      <h2 className="text-xl font-semibold mb-4">Processando seu pagamento</h2>
                      <p className="text-gray-400">
                        Em breve você receberá as instruções de acesso no seu email.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Card - Hidden on mobile, shows on desktop */}
            <div className="hidden lg:block lg:w-80 xl:w-96">
              <div className="space-y-3">
                <CheckoutSummary 
                  plan={planConfig}
                  selectedPaymentMethod={selectedPaymentMethod}
                  selectedInstallments={selectedInstallments}
                />
                {/* Seals section on desktop */}
                <SealsSection />
              </div>
            </div>
          </div>

          {/* Seals section on mobile and tablet */}
          <div className="lg:hidden">
            <SealsSection />
          </div>
        </div>
      </div>

      {/* Footer with watermark logo */}
      <footer className="w-full py-4 text-center flex flex-col items-center space-y-2">
        <img
          src="https://proteam.com.br/wp-content/uploads/2025/01/LOGO_RED_WHITE-OPTMZD.png"
          alt="PRO Team Watermark"
          className="h-8 w-auto object-contain grayscale opacity-75" // Increased opacity from 50 to 75
        />
        <p className="text-sm text-gray-500">©PRO Team 2025 - Todos os direitos reservados</p>
      </footer>

      <WhatsAppSupport />
    </div>
  );
}

export default App;