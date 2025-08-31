
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { UserProfile, RiskProfile } from '../../types';
import { PORTFOLIO_DEFINITIONS } from '../../constants';
import Card from '../ui/Card';

interface Step4_MonitoringProps {
    userProfile: UserProfile | null;
    riskProfile: RiskProfile | null;
}

const generateHistoricalData = (volatility: number, returns: number, years: number) => {
    let value = 100000;
    const data = [{ year: 'Start', value }];
    for (let i = 1; i <= years; i++) {
        const randomFactor = (Math.random() - 0.5) * volatility / 100;
        const growthFactor = returns / 100;
        value *= (1 + growthFactor + randomFactor);
        data.push({ year: `Year ${i}`, value: Math.round(value) });
    }
    return data;
};

const Step4_Monitoring: React.FC<Step4_MonitoringProps> = ({ userProfile, riskProfile }) => {
    const [isRebalanced, setIsRebalanced] = useState(false);

    const historicalData = useMemo(() => {
        if (!riskProfile) return [];
        return generateHistoricalData(riskProfile.volatility, riskProfile.expectedReturn, userProfile?.timeHorizon || 10);
    }, [riskProfile, userProfile]);
    
    const allocation = useMemo(() => {
        if (!riskProfile) return null;
        return PORTFOLIO_DEFINITIONS[riskProfile.portfolioType].allocation;
    }, [riskProfile]);

    if (!userProfile || !riskProfile || !allocation) {
        return <div className="text-center text-text-secondary">Please complete the previous steps to see your monitoring dashboard.</div>;
    }
    
    const currentValue = historicalData[historicalData.length - 1]?.value || 100000;
    const initialValue = historicalData[0]?.value || 100000;
    const totalReturn = currentValue - initialValue;
    const totalReturnPercent = (totalReturn / initialValue) * 100;

    return (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Portfolio Monitoring</h2>
            <p className="text-text-secondary mb-8">This is a simulation of your portfolio's performance over your time horizon.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <Card className="text-center">
                    <h4 className="text-text-secondary font-semibold">Current Value</h4>
                    <p className="text-3xl font-bold text-primary">${currentValue.toLocaleString()}</p>
                </Card>
                 <Card className="text-center">
                    <h4 className="text-text-secondary font-semibold">Total Return</h4>
                    <p className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>${totalReturn.toLocaleString()}</p>
                </Card>
                 <Card className="text-center">
                    <h4 className="text-text-secondary font-semibold">Return %</h4>
                    <p className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalReturnPercent.toFixed(2)}%</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Simulated Performance</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Area type="monotone" dataKey="value" stroke="#0D47A1" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="mt-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Portfolio Rebalancing</h3>
                        <p className="text-text-secondary text-sm">Periodically rebalancing helps maintain your desired risk level.</p>
                    </div>
                    <button 
                        onClick={() => setIsRebalanced(true)} 
                        disabled={isRebalanced}
                        className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                    >
                        {isRebalanced ? 'Rebalanced!' : 'Rebalance Now'}
                    </button>
                </div>
                {isRebalanced && <p className="mt-4 text-green-600 font-semibold">Your portfolio has been successfully rebalanced to its target allocation!</p>}
            </Card>
        </div>
    );
};

export default Step4_Monitoring;
