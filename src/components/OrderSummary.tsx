import React from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import type { UserData, Plan } from '../types';

interface OrderSummaryProps {
  userData: UserData;
  plan: Plan;
  onEdit: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function OrderSummary({ userData, plan, onEdit, onContinue, onBack }: OrderSummaryProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-[#2C2C2E] rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-white mb-4">Detalhes do Plano</h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Plano</p>
            <p className="text-sm sm:text-base text-white font-medium">{plan.name}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Preço</p>
            <p className="text-sm sm:text-base text-white font-medium">
              R$ {plan.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-medium text-white">Informações Pessoais</h3>
          <button
            onClick={onEdit}
            className="flex items-center text-xs sm:text-sm text-red-500 hover:text-red-400"
          >
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Editar
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Nome</p>
            <p className="text-sm sm:text-base text-white">{userData.fullName}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Email</p>
            <p className="text-sm sm:text-base text-white break-all">{userData.email}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">Telefone</p>
            <p className="text-sm sm:text-base text-white">{userData.phone}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">CPF</p>
            <p className="text-sm sm:text-base text-white">{userData.cpf}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center py-2.5 sm:py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#2C2C2E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
        <button
          onClick={onContinue}
          className="flex-1 flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Continuar para o Pagamento
        </button>
      </div>
    </div>
  );
}