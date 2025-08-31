
import type { PortfolioAllocation } from './types';

export const FINANCIAL_GOALS = ['Retirement', 'Wealth Growth', 'Home Purchase', 'Education', 'Capital Preservation'];
export const FAMILY_SITUATIONS = ['Single', 'Married, no children', 'Married, with children', 'Single Parent'];
export const INVESTMENT_PREFERENCES = ['Stocks', 'Bonds', 'Alternative Investments', 'Ethical/Sustainable (ESG)'];

export const EFFICIENT_FRONTIER_DATA = [
  { volatility: 5, returns: 4, label: 'Low Risk' },
  { volatility: 7, returns: 6, label: 'Conservative' },
  { volatility: 9, returns: 7.5, label: 'Balanced' },
  { volatility: 12, returns: 9, label: 'Moderate' },
  { volatility: 15, returns: 11, label: 'Growth' },
  { volatility: 18, returns: 12, label: 'Aggressive' },
  { volatility: 22, returns: 13, label: 'High Risk' },
];

export const PORTFOLIO_DEFINITIONS: { [key: string]: { allocation: PortfolioAllocation, riskScoreRange: [number, number] } } = {
  Conservative: {
    allocation: {
      core: { bonds: 60, stableDividends: 20 },
      tactical: { stocks: 10, alternative: 5, international: 5 }
    },
    riskScoreRange: [0, 3]
  },
  Moderate: {
    allocation: {
      core: { bonds: 40, stableDividends: 10 },
      tactical: { stocks: 30, alternative: 10, international: 10 }
    },
    riskScoreRange: [4, 7]
  },
  Aggressive: {
    allocation: {
      core: { bonds: 10, stableDividends: 5 },
      tactical: { stocks: 50, alternative: 15, international: 20 }
    },
    riskScoreRange: [8, 10]
  }
};

export const HISTORICAL_EVENTS = {
  'Normal Growth (2015-2019)': [100, 105, 115, 120, 135, 145],
  '2008 Financial Crisis': [100, 90, 75, 60, 80, 95],
  '2020 COVID-19 Crash': [100, 110, 80, 105, 120, 140],
  'Tech Boom (Late 90s)': [100, 120, 150, 190, 160, 130]
};
