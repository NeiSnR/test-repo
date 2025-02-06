import React, { useState } from 'react';
import type { UserData } from '../types';
import { CountrySelector } from './CountrySelector';
import { BR } from 'country-flag-icons/react/3x2';

const defaultCountry = {
  code: 'BR',
  name: 'Brasil',
  dialCode: '+55',
  flag: BR,
};

interface UserDataFormProps {
  userData: UserData;
  onSubmit: (data: UserData) => void;
  onChange: (data: Partial<UserData>) => void;
}

export function UserDataForm({ userData, onSubmit, onChange }: UserDataFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userData);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      let formattedValue = '';
      if (value.length > 0) formattedValue = `(${value.slice(0, 2)}`;
      if (value.length > 2) formattedValue += `) ${value.slice(2, 3)}`;
      if (value.length > 3) formattedValue += ` ${value.slice(3, 7)}`;
      if (value.length > 7) formattedValue += `-${value.slice(7, 11)}`;
      onChange({ phone: `${selectedCountry.dialCode} ${formattedValue}` });
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      let formattedValue = '';
      if (value.length > 0) formattedValue = value.slice(0, 3);
      if (value.length > 3) formattedValue += `.${value.slice(3, 6)}`;
      if (value.length > 6) formattedValue += `.${value.slice(6, 9)}`;
      if (value.length > 9) formattedValue += `-${value.slice(9, 11)}`;
      onChange({ cpf: formattedValue });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-200">
          Nome
        </label>
        <input
          type="text"
          id="fullName"
          value={userData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Digite seu nome"
          className="mt-1 block w-full rounded-md bg-[#2C2C2E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={userData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="seu.email@exemplo.com"
          className="mt-1 block w-full rounded-md bg-[#2C2C2E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-200">
          Telefone
        </label>
        <div className="mt-1 flex">
          <CountrySelector
            selectedCountry={selectedCountry}
            onSelect={(country) => {
              setSelectedCountry(country);
              if (userData.phone) {
                const phoneWithoutCode = userData.phone.split(' ').slice(1).join(' ');
                onChange({ phone: `${country.dialCode} ${phoneWithoutCode}` });
              }
            }}
          />
          <input
            type="tel"
            id="phone"
            value={userData.phone?.split(' ').slice(1).join(' ') || ''}
            onChange={handlePhoneChange}
            placeholder="(99) 9 9999-9999"
            className="flex-1 block rounded-l-none rounded-r-md bg-[#2C2C2E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="cpf" className="block text-xs sm:text-sm font-medium text-gray-200">
          CPF
        </label>
        <input
          type="text"
          id="cpf"
          value={userData.cpf}
          onChange={handleCPFChange}
          placeholder="000.000.000-00"
          maxLength={14}
          className="mt-1 block w-full rounded-md bg-[#2C2C2E] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Continuar
      </button>
    </form>
  );
}