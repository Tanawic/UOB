
import { GoogleGenAI } from "@google/genai";
import type { UserProfile, RiskProfile, PortfolioAllocation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFinancialSummary = async (
  userProfile: UserProfile,
  riskProfile: RiskProfile,
  allocation: PortfolioAllocation
): Promise<string> => {
  if (!API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable.";
  }
  
  const prompt = `
    Analyze the following user profile and generate a personalized, encouraging, and easy-to-understand financial plan summary.
    The user is looking for advice on investments and insurance.

    **User Profile:**
    - Age: ${userProfile.age}
    - Annual Income: $${userProfile.income.toLocaleString()}
    - Main Financial Goal: ${userProfile.financialGoal}
    - Family Situation: ${userProfile.familySituation}
    - Investment Time Horizon: ${userProfile.timeHorizon} years
    - Stated Investment Preferences: ${userProfile.investmentPreference.join(', ')}
    - Current Financials:
        - Existing Investments: $${userProfile.existingInvestments.toLocaleString()}
        - Debts: $${userProfile.debts.toLocaleString()}
        - Emergency Savings: $${userProfile.emergencySavings.toLocaleString()}

    **Quantitative Analysis Results:**
    - Risk Profile: ${riskProfile.portfolioType} (Score: ${riskProfile.riskScore}/10)
    - Projected Annual Return: ${riskProfile.expectedReturn}%
    - Projected Volatility (Standard Deviation): ${riskProfile.volatility}%

    **Recommended Investment Allocation:**
    - Core Investments: ${allocation.core.bonds + allocation.core.stableDividends}%
        - Bonds: ${allocation.core.bonds}%
        - Stable Dividend Stocks: ${allocation.core.stableDividends}%
    - Tactical Investments: ${allocation.tactical.stocks + allocation.tactical.alternative + allocation.tactical.international}%
        - Domestic Stocks: ${allocation.tactical.stocks}%
        - Alternative Investments: ${allocation.tactical.alternative}%
        - International Stocks: ${allocation.tactical.international}%

    **Task:**
    Based on all the information above, write a summary in markdown format. Structure it with the following sections:
    1.  **Introduction:** A brief, positive opening statement about their financial journey.
    2.  **Your Investment Strategy:** Explain *why* the recommended portfolio (${riskProfile.portfolioType}) is a good fit for their profile and goals. Briefly explain the role of Core and Tactical investments.
    3.  **Key Investment Product Types:** Suggest examples of products for their allocation (e.g., for Stocks, mention ETFs like VOO; for Bonds, mention government or corporate bond funds).
    4.  **Personalized Insurance Recommendations:** Based on their family situation and age, suggest a type of insurance and a brief reason. For example, if they have children, recommend life insurance like "PRUfamily Guard". If they are single and focused on wealth, recommend a health/investment-linked plan like "UOB Healthy Wealth".
    5.  **Next Steps:** Provide 2-3 actionable, simple next steps.

    Keep the tone professional, but accessible and encouraging. Avoid making absolute guarantees about returns.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "There was an error generating your personalized summary. Please try again later.";
  }
};
