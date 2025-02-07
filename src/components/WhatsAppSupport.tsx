import React from 'react';
import { getPlanConfig } from '../config/plan';

export function WhatsAppSupport() {
  const plan = getPlanConfig();
  
  return (
    <a
      href={`https://wa.me/${plan.phonePersonal}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
    >
      <img 
        src="https://proteam.com.br/wp-content/uploads/2025/02/whatsapp-512.png" 
        alt="WhatsApp"
        className="w-5 h-5 sm:w-6 sm:h-6"
      />
    </a>
  );
}