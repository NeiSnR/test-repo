// Feature flag for empty state page
export const ENABLE_EMPTY_STATE = false;

// Default configuration when ENABLE_EMPTY_STATE is false
const DEFAULT_PERSONAL = 'teste';
const DEFAULT_PLAN = 'consultoria-online-anual';

export interface PlanConfig {
  id: string;
  namePersonal: string;
  idPersonal: string;
  phonePersonal: string;
  plan: string;
  price: number;
  maxInstallments: number;
  pixDiscountPercentage: number;
}

interface PlanDetails {
  plan: string;
  price: number;
  maxInstallments: number;
  pixDiscountPercentage: number;
}

const personals = {
  kathy: {
    namePersonal: 'Kathy',
    idPersonal: '1234',
    phonePersonal: '5555996707903'
  },
  gilliard: {
    namePersonal: 'Gilliard',
    idPersonal: '5678',
    phonePersonal: '5555996806665'
  },
  teste: {
    namePersonal: 'Teste',
    idPersonal: '8f68ca1d-9605-4063-964f-12a186382a1a',
    phonePersonal: '5555991665515'
  }
};

const plans: Record<string, PlanDetails> = {
  'projeto-60d': {
    plan: 'Projeto - 60D',
    price: 354.00,
    maxInstallments: 2,
    pixDiscountPercentage: 10
  },
  'projeto-90d': {
    plan: 'Projeto - 90D',
    price: 497.00,
    maxInstallments: 3,
    pixDiscountPercentage: 10
  },
  'projeto-180d': {
    plan: 'Projeto - 180D',
    price: 947.00,
    maxInstallments: 6,
    pixDiscountPercentage: 10
  },
  'consultoria-online-mensal': {
    plan: 'Consultoria Online - Mensal',
    price: 197.00,
    maxInstallments: 1,
    pixDiscountPercentage: 0
  },
  'consultoria-online-casal': {
    plan: 'Consultoria Online - Casal',
    price: 297.00,
    maxInstallments: 1,
    pixDiscountPercentage: 0
  },
  'consultoria-online-anual': {
    plan: 'Consultoria Online - Anual',
    price: 1797.00,
    maxInstallments: 12,
    pixDiscountPercentage: 10
  }
};

// Função para extrair informações da URL
function getUrlInfo(): { personal: string; planSlug: string } | null {
  try {
    const url = window.location.pathname;
    const [, personal, planSlug] = url.split('/');
    // Convert both personal and planSlug to lowercase for case-insensitive comparison
    return { 
      personal: personal?.toLowerCase(), 
      planSlug: planSlug?.toLowerCase() 
    };
  } catch {
    return null;
  }
}

// Função para obter a configuração do plano
export function getPlanConfig(): PlanConfig {
  const urlInfo = getUrlInfo();
  
  // If empty state is disabled or URL info is invalid, return default plan
  if (!ENABLE_EMPTY_STATE || !urlInfo) {
    const defaultPersonal = personals[DEFAULT_PERSONAL];
    const defaultPlanDetails = plans[DEFAULT_PLAN];
    
    return {
      ...defaultPersonal,
      ...defaultPlanDetails,
      id: defaultPersonal.idPersonal
    };
  }

  const personal = personals[urlInfo.personal as keyof typeof personals];
  const planDetails = plans[urlInfo.planSlug];

  if (!personal || !planDetails) {
    if (!ENABLE_EMPTY_STATE) {
      const defaultPersonal = personals[DEFAULT_PERSONAL];
      const defaultPlanDetails = plans[DEFAULT_PLAN];
      
      return {
        ...defaultPersonal,
        ...defaultPlanDetails,
        id: defaultPersonal.idPersonal
      };
    }
    return null;
  }

  return {
    ...personal,
    ...planDetails,
    id: personal.idPersonal
  };
}

export const planConfig = getPlanConfig();