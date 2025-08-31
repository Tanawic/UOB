
export interface UserProfile {
  age: number;
  income: number;
  financialGoal: string;
  familySituation: string;
  timeHorizon: number;
  investmentPreference: string[];
  existingInvestments: number;
  debts: number;
  emergencySavings: number;
}

export interface RiskProfile {
  riskScore: number;
  portfolioType: 'Conservative' | 'Moderate' | 'Aggressive';
  expectedReturn: number;
  volatility: number;
}

export interface PortfolioAllocation {
  core: {
    bonds: number;
    stableDividends: number;
  };
  tactical: {
    stocks: number;
    alternative: number;
    international: number;
  };
}
