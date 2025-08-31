
import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { marked } from 'marked';
import type { UserProfile, RiskProfile } from '../../types';
import { PORTFOLIO_DEFINITIONS } from '../../constants';
import { generateFinancialSummary } from '../../services/geminiService';
import Card from '../ui/Card';

interface Step3_RecommendationsProps {
  userProfile: UserProfile | null;
  riskProfile: RiskProfile | null;
}

const COLORS = ['#0D47A1', '#1565C0', '#1E88E5', '#42A5F5', '#64B5F6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-lg">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Step3_Recommendations: React.FC<Step3_RecommendationsProps> = ({ userProfile, riskProfile }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const allocation = useMemo(() => {
        if (!riskProfile) return null;
        return PORTFOLIO_DEFINITIONS[riskProfile.portfolioType].allocation;
    }, [riskProfile]);

    useEffect(() => {
        if (userProfile && riskProfile && allocation) {
            const fetchSummary = async () => {
                setLoading(true);
                const result = await generateFinancialSummary(userProfile, riskProfile, allocation);
                setSummary(result);
                setLoading(false);
            };
            fetchSummary();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile, riskProfile, allocation]);

    if (!userProfile || !riskProfile || !allocation) {
        return <div className="text-center text-text-secondary">Please complete the previous steps to see your recommendations.</div>;
    }

    const pieData = [
        { name: 'Bonds', value: allocation.core.bonds },
        { name: 'Stable Dividends', value: allocation.core.stableDividends },
        { name: 'Domestic Stocks', value: allocation.tactical.stocks },
        { name: 'Alternative', value: allocation.tactical.alternative },
        { name: 'International', value: allocation.tactical.international },
    ];
    
    const insuranceRecommendation = () => {
        if (userProfile.familySituation.includes('children') || userProfile.familySituation.includes('Parent')) {
            return { name: 'PRUfamily Guard', reason: 'To protect your family\'s income and future in case of unforeseen events.' };
        }
        return { name: 'UOB Healthy Wealth', reason: 'A plan focused on health coverage linked to growing your wealth, ideal for your financial goals.' };
    };
    
    const investmentExamples = [
      { type: 'ETFs', example: 'Vanguard S&P 500 (VOO), Invesco QQQ' },
      { type: 'Bonds', example: 'U.S. Treasury Bonds, Corporate Bond Funds' },
      { type: 'Equities', example: 'Blue-chip stocks like Apple, Microsoft' }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Your Personalized Financial Plan</h2>
            <p className="text-text-secondary mb-8">Here is a tailored strategy based on your profile and risk assessment.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Recommended Asset Allocation</h3>
                        <div style={{ width: '100%', height: 300 }}>
                           <ResponsiveContainer>
                             <PieChart>
                               <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                 {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                               </Pie>
                               <Tooltip content={<CustomTooltip />} />
                               <Legend />
                             </PieChart>
                           </ResponsiveContainer>
                        </div>
                    </Card>
                    <Card>
                       <h3 className="text-lg font-semibold text-text-primary mb-4">Sample Investment Products</h3>
                       <div className="space-y-3">
                        {investmentExamples.map(item => (
                            <div key={item.type}>
                                <p className="font-bold text-secondary">{item.type}</p>
                                <p className="text-sm text-text-secondary">{item.example}</p>
                            </div>
                        ))}
                       </div>
                    </Card>
                    <Card>
                       <h3 className="text-lg font-semibold text-text-primary mb-4">Insurance Recommendation</h3>
                       <div>
                            <p className="font-bold text-secondary">{insuranceRecommendation().name}</p>
                            <p className="text-sm text-text-secondary">{insuranceRecommendation().reason}</p>
                       </div>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08V14H8v-2h3V9.92c0-2.26 1.34-3.42 3.31-3.42.96 0 1.8.12 1.8.12l-.24 1.86c-.36-.06-.82-.12-1.38-.12-1.14 0-1.49.56-1.49 1.58V12h3.02l-.39 2H13.1v4.08z"/></svg>
                            AI-Powered Strategy Summary
                        </h3>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div
                                className="prose prose-blue max-w-none"
                                dangerouslySetInnerHTML={{ __html: marked(summary) }}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Step3_Recommendations;
