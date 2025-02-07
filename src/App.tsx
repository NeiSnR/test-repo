import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Barcode } from 'lucide-react';
import { CheckoutSteps } from './components/CheckoutSteps';
import { UserDataForm } from './components/UserDataForm';
import { PaymentMethods } from './components/PaymentMethods';
import { WhatsAppSupport } from './components/WhatsAppSupport';
import { CheckoutSummary } from './components/CheckoutSummary';
import { getPlanConfig, ENABLE_EMPTY_STATE } from './config/plan';
import type { UserData, PaymentMethod, CheckoutStep } from './types';

function EmptyState() {
  return (
    <div className="min-h-screen bg-[#111113] text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <img
          src="https://proteam.com.br/wp-content/uploads/2025/01/LOGO_RED_WHITE-OPTMZD.png"
          alt="PRO Team"
          className="h-12 w-auto mx-auto mb-8"
        />
        <h1 className="text-2xl font-bold">Selecione um plano antes de realizar o pagamento</h1>
        <p className="text-gray-400">
          Por favor, escolha um de nossos planos disponíveis para prosseguir com o pagamento.
        </p>
        <a
          href="https://proteam.com.br"
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
        >
          Ver Planos Disponíveis
        </a>
      </div>
    </div>
  );
}

function App() {
  const [plan, setPlan] = useState(getPlanConfig());
  const [step, setStep] = useState<CheckoutStep>('user-data');
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedInstallments, setSelectedInstallments] = useState(plan?.maxInstallments || 1);
  const [lastCardInstallments, setLastCardInstallments] = useState(plan?.maxInstallments || 1);

  useEffect(() => {
    // Atualiza o plano quando a URL mudar
    const handleUrlChange = () => {
      const newPlan = getPlanConfig();
      setPlan(newPlan);
      setSelectedInstallments(newPlan?.maxInstallments || 1);
      setLastCardInstallments(newPlan?.maxInstallments || 1);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Check if we're at the root path or if the plan is invalid
  if (ENABLE_EMPTY_STATE && (!plan || window.location.pathname === '/')) {
    return <EmptyState />;
  }

  // If plan is null and empty state is disabled, don't render anything
  // This prevents the error while the default plan is being set
  if (!plan) {
    return null;
  }

  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data);
    setStep('payment');
  };

  const handleUserDataChange = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    if (selectedPaymentMethod === 'card') {
      // Store the current number of installments when leaving card payment
      setLastCardInstallments(selectedInstallments);
    }

    setSelectedPaymentMethod(method);
    
    if (method === 'card') {
      // Restore the last selected number of installments for card
      setSelectedInstallments(lastCardInstallments);
    } else {
      // For other payment methods, always set to 1
      setSelectedInstallments(1);
    }
  };

  const handlePaymentComplete = () => {
    setStep('access');
    console.log('Processing payment...', {
      plan: plan.id,
      namePersonal: plan.namePersonal,
      idPersonal: plan.idPersonal
    });
  };

  return (
    <div className="min-h-screen bg-[#111113] text-white flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:py-16 w-full">
        <div className="flex flex-col gap-6 lg:gap-8 justify-center">
          {/* Summary Card - Always on top for mobile, moves to right on desktop */}
          <div className="lg:hidden">
            <CheckoutSummary 
              plan={plan}
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
                      onSelectMethod={handlePaymentMethodChange}
                      onBack={() => setStep('user-data')}
                      onComplete={handlePaymentComplete}
                      plan={plan}
                      selectedInstallments={selectedInstallments}
                      onInstallmentsChange={(installments) => {
                        setSelectedInstallments(installments);
                        if (selectedPaymentMethod === 'card') {
                          setLastCardInstallments(installments);
                        }
                      }}
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
              <CheckoutSummary 
                plan={plan}
                selectedPaymentMethod={selectedPaymentMethod}
                selectedInstallments={selectedInstallments}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with seals and watermark logo */}
      <footer className="w-full py-8 bg-[#111113] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            {/* Seals Section */}
            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* PRO Team Logo */}
                <div className="flex justify-center">
                  <img
                    src="https://proteam.com.br/wp-content/uploads/2025/01/LOGO_RED_WHITE-OPTMZD.png"
                    alt="PRO Team"
                    className="h-8 w-auto object-contain grayscale opacity-75"
                  />
                </div>

                {/* Processador de Pagamento */}
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-sm text-gray-400">Pagamento processado por:</span>
                  <img
                    src="https://proteam.com.br/wp-content/uploads/2025/02/Logo_Asaas_Branca-1.png"
                    alt="Asaas"
                    className="h-4 w-auto -translate-y-[2px] opacity-60"
                  />
                </div>

                {/* Bandeiras e Métodos de Pagamento */}
                <div className="flex justify-center">
                  <div className="flex items-center space-x-3">
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
                    {/* Separador Vertical */}
                    <div className="mx-3 h-5 w-px bg-gray-700" />
                    {/* PIX e Boleto */}
                    <img
                      src="https://logospng.org/download/pix/logo-pix-icone-512.png"
                      alt="PIX"
                      className="h-5 w-auto opacity-50 grayscale"
                    />
                    <Barcode className="h-5 w-5 text-gray-400 opacity-50" />
                  </div>
                </div>

                {/* Selos de Segurança */}
                <div className="flex justify-center">
                  <div className="flex items-center justify-center gap-8 sm:gap-12">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="text-gray-400">SSL Seguro</p>
                        <p className="text-gray-500">Seus dados estão protegidos</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="text-gray-400">Compra Garantida</p>
                        <p className="text-gray-500">Satisfação ou reembolso</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copyright */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">©PRO Team 2025 - Todos os direitos reservados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppSupport />
    </div>
  );
}

export default App;