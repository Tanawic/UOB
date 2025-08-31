
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { UserProfile, RiskProfile } from '../../types';
import { HISTORICAL_EVENTS } from '../../constants';
import Card from '../ui/Card';

interface Step5_EducationProps {
  userProfile: UserProfile | null;
  riskProfile: RiskProfile | null;
}

const educationContent = [
    {
        title: "Modern Portfolio Theory (MPT)",
        content: "MPT, developed by Harry Markowitz, is a framework for assembling a portfolio of assets such that the expected return is maximized for a given level of risk. It emphasizes that risk and return are best viewed in a portfolio context rather than on a standalone asset basis."
    },
    {
        title: "Diversification",
        content: "This is the practice of spreading your investments around so that your exposure to any one type of asset is limited. This practice is designed to help reduce the volatility of your portfolio over time. A well-diversified portfolio is less likely to be severely affected by a single negative event."
    },
    {
        title: "The Efficient Frontier",
        content: "The efficient frontier represents the set of optimal portfolios that offer the highest expected return for a defined level of risk or the lowest risk for a given level of expected return. Portfolios that lie below the efficient frontier are sub-optimal."
    }
];

const Step5_Education: React.FC<Step5_EducationProps> = ({ userProfile, riskProfile }) => {
    const [selectedEvent, setSelectedEvent] = useState<string>(Object.keys(HISTORICAL_EVENTS)[0]);

    const simulationData = useMemo(() => {
        if (!riskProfile) return [];
        const baseData = HISTORICAL_EVENTS[selectedEvent as keyof typeof HISTORICAL_EVENTS];
        const riskMultiplier = riskProfile.volatility / 15; // 15 is moderate volatility benchmark
        
        return baseData.map((point, index) => {
            const deviation = (point - 100) * riskMultiplier;
            return {
                name: `Period ${index}`,
                Your_Portfolio: 100 + deviation,
                Market_Index: point
            };
        });
    }, [riskProfile, selectedEvent]);
    
    if (!userProfile || !riskProfile) {
        return <div className="text-center text-text-secondary">Please complete the previous steps to access the education center.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Education & Insights</h2>
            <p className="text-text-secondary mb-8">Understanding key financial concepts can empower you to make better decisions.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                     <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Risk Simulation</h3>
                        <p className="text-text-secondary text-sm mb-4">See how your recommended portfolio might have performed during significant historical market events.</p>
                        
                        <select 
                            value={selectedEvent} 
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4 bg-white"
                        >
                            {Object.keys(HISTORICAL_EVENTS).map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>

                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={simulationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Market_Index" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="Your_Portfolio" stroke="#0D47A1" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                     </Card>
                </div>
                <div className="space-y-6">
                    {educationContent.map(item => (
                         <Card key={item.title}>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{item.title}</h3>
                            <p className="text-text-secondary text-sm">{item.content}</p>
                         </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step5_Education;
