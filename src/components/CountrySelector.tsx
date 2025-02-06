import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BR, US, PT, ES, FR, IT, DE } from 'country-flag-icons/react/3x2';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const countries: Country[] = [
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: BR },
  { code: 'US', name: 'United States', dialCode: '+1', flag: US },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: PT },
  { code: 'ES', name: 'España', dialCode: '+34', flag: ES },
  { code: 'FR', name: 'France', dialCode: '+33', flag: FR },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: IT },
  { code: 'DE', name: 'Deutschland', dialCode: '+49', flag: DE },
];

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const Flag = selectedCountry.flag;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-[#2C2C2E] rounded-l-md px-2 h-10 sm:h-12 border-r border-gray-700 hover:bg-[#3A3A3C]"
      >
        <Flag className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm" />
        <span className="text-white text-xs sm:text-sm">{selectedCountry.dialCode}</span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 sm:w-56 bg-[#2C2C2E] rounded-md shadow-lg">
          <ul className="py-1">
            {countries.map((country) => {
              const CountryFlag = country.flag;
              return (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3C]"
                  >
                    <CountryFlag className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm mr-2" />
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="text-gray-400">{country.dialCode}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}