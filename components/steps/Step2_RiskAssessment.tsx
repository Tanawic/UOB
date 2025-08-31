
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Label, ReferenceLine } from 'recharts';
import type { UserProfile, RiskProfile } from '../../types';
import { EFFICIENT_FRONTIER_DATA, PORTFOLIO_DEFINITIONS } from '../../constants';
import Card from '../ui/Card';

interface Step2_RiskAssessmentProps {
  onSubmit: (profile: RiskProfile) => void;
  userProfile: UserProfile | null;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-bold text-primary">{`${payload[0].payload.label}`}</p>
        <p className="text-sm text-text-secondary">{`Volatility: ${payload[0].value}%`}</p>
        <p className="text-sm text-text-secondary">{`Expected Returns: ${payload[1].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Step2_RiskAssessment: React.FC<Step2_RiskAssessmentProps> = ({ onSubmit, userProfile }) => {
    const [answers, setAnswers] = useState({ q1: '', q2: '' });
    const [riskScore, setRiskScore] = useState<number | null>(null);

    const calculateRiskScore = () => {
        let score = 0;
        if(answers.q1 === 'buy') score += 4;
        if(answers.q1 === 'hold') score += 2;
        if(answers.q1 === 'sell_some') score += 1;
        
        if(answers.q2 === 'high') score += 4;
        if(answers.q2 === 'medium') score += 2;
        if(answers.q2 === 'low') score += 1;
        
        // Adjust for age and time horizon
        if (userProfile) {
            if (userProfile.age < 35 || userProfile.timeHorizon > 20) score += 2;
            if (userProfile.age > 55 || userProfile.timeHorizon < 10) score -= 1;
        }

        setRiskScore(Math.max(0, Math.min(10, score)));
    };

    const derivedRiskProfile: RiskProfile | null = useMemo(() => {
        if (riskScore === null) return null;
        const portfolioType = Object.keys(PORTFOLIO_DEFINITIONS).find(type => {
            const [min, max] = PORTFOLIO_DEFINITIONS[type].riskScoreRange;
            return riskScore >= min && riskScore <= max;
        }) as 'Conservative' | 'Moderate' | 'Aggressive' || 'Moderate';

        const pointIndex = Math.round((riskScore / 10) * (EFFICIENT_FRONTIER_DATA.length - 1));
        const point = EFFICIENT_FRONTIER_DATA[pointIndex];
        
        return {
            riskScore,
            portfolioType,
            expectedReturn: point.returns,
            volatility: point.volatility
        };
    }, [riskScore]);

    const handleSubmit = () => {
        if(derivedRiskProfile) {
            onSubmit(derivedRiskProfile);
        } else {
            alert("Please complete the risk questionnaire first.");
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Quantitative Risk Assessment</h2>
            <p className="text-text-secondary mb-8">Let's understand your comfort with investment risk through a couple of scenarios.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold mb-2">Scenario 1: Market Downturn</h3>
                        <p className="text-sm text-text-secondary mb-4">The stock market drops 20% in a month. Assuming you have a diversified portfolio, what is your most likely reaction?</p>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q1" value="sell_all" onChange={e => setAnswers({...answers, q1: e.target.value})} className="mr-2"/> Sell everything to prevent further losses.</label>
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q1" value="sell_some" onChange={e => setAnswers({...answers, q1: e.target.value})} className="mr-2"/> Sell some assets.</label>
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q1" value="hold" onChange={e => setAnswers({...answers, q1: e.target.value})} className="mr-2"/> Hold and wait for the market to recover.</label>
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q1" value="buy" onChange={e => setAnswers({...answers, q1: e.target.value})} className="mr-2"/> Buy more, seeing it as a great opportunity.</label>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="font-semibold mb-2">Scenario 2: Risk vs. Return</h3>
                        <p className="text-sm text-text-secondary mb-4">Which of these statements best describes your investment philosophy?</p>
                        <div className="space-y-2">
                             <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q2" value="low" onChange={e => setAnswers({...answers, q2: e.target.value})} className="mr-2"/> I prioritize protecting my initial capital, even if it means lower returns.</label>
                             <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q2" value="medium" onChange={e => setAnswers({...answers, q2: e.target.value})} className="mr-2"/> I'm willing to take on some risk for moderate returns.</label>
                             <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50"><input type="radio" name="q2" value="high" onChange={e => setAnswers({...answers, q2: e.target.value})} className="mr-2"/> I'm comfortable with high volatility for the chance of higher returns.</label>
                        </div>
                    </Card>
                    <button onClick={calculateRiskScore} disabled={!answers.q1 || !answers.q2} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary disabled:bg-gray-300 transition duration-300">
                        Calculate My Risk Profile
                    </button>
                </div>
                
                <Card className="h-[500px]">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Efficient Frontier</h3>
                    <p className="text-sm text-text-secondary mb-4">This chart shows the best possible return for a given level of risk. Your profile is highlighted below.</p>
                    <ResponsiveContainer width="100%" height="85%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="volatility" name="Volatility" unit="%" stroke="#4A5568">
                                <Label value="Volatility (Risk)" offset={-25} position="insideBottom" />
                            </XAxis>
                            <YAxis type="number" dataKey="returns" name="Expected Returns" unit="%" stroke="#4A5568">
                                <Label value="Expected Returns" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <ZAxis type="string" dataKey="label" name="label" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            <Scatter name="Portfolios" data={EFFICIENT_FRONTIER_DATA} fill="#1565C0" shape="circle" />
                             {derivedRiskProfile && (
                                <>
                                 <Scatter name="Your Profile" data={[ { volatility: derivedRiskProfile.volatility, returns: derivedRiskProfile.expectedReturn, label: `Your ${derivedRiskProfile.portfolioType} Profile` } ]} fill="#FFC107" shape="star" size={200} />
                                 <ReferenceLine x={derivedRiskProfile.volatility} stroke="#FFC107" strokeDasharray="3 3" />
                                 <ReferenceLine y={derivedRiskProfile.expectedReturn} stroke="#FFC107" strokeDasharray="3 3" />
                                </>
                             )}
                        </ScatterChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            {derivedRiskProfile && (
                <div className="mt-8 text-center bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-primary">Your Result</h3>
                    <p className="mt-2 text-text-secondary">Based on your answers, you have a <span className="font-bold text-primary">{derivedRiskProfile.portfolioType}</span> risk profile with a score of <span className="font-bold text-primary">{derivedRiskProfile.riskScore}/10</span>.</p>
                    <p className="text-sm text-text-secondary">Expected Return: {derivedRiskProfile.expectedReturn}% | Volatility: {derivedRiskProfile.volatility}%</p>
                     <div className="mt-6 text-right">
                        <button onClick={handleSubmit} className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105">
                           See My Recommendations
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step2_RiskAssessment;
