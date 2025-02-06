import React from 'react';
import type { CheckoutStep } from '../types';

interface StepProps {
  currentStep: CheckoutStep;
}

export function CheckoutSteps({ currentStep }: StepProps) {
  const steps = [
    { id: 'user-data', label: { mobile: 'Dados', desktop: 'Dados pessoais' } },
    { id: 'payment', label: { mobile: 'Pagamento', desktop: 'Pagamento' } },
    { id: 'access', label: { mobile: 'Acesso', desktop: 'Acesso ao Produto' } },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const getStepColor = (index: number) => {
    if (index < currentStepIndex) return 'bg-white'; // completed
    if (index === currentStepIndex) return 'bg-white'; // current
    return 'border-2 border-gray-600'; // upcoming
  };

  const getTextColor = (index: number) => {
    if (index < currentStepIndex) return 'text-white'; // completed
    if (index === currentStepIndex) return 'text-white'; // current
    return 'text-gray-400'; // upcoming
  };

  const getLineColor = (index: number) => {
    if (index < currentStepIndex) return 'bg-white'; // completed
    return 'bg-gray-700'; // upcoming or current
  };

  return (
    <div className="bg-[#1C1C1E] border-b border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-center">
          <div className="flex items-center justify-between w-full max-w-md">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full ${getStepColor(index)}`}
                  />
                  <span className={`text-xs mt-2 ${getTextColor(index)}`}>
                    <span className="sm:hidden">{step.label.mobile}</span>
                    <span className="hidden sm:inline">{step.label.desktop}</span>
                  </span>
                </div>

                {/* Progress line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`h-[1px] w-24 -translate-y-[13px] ${getLineColor(index)}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}