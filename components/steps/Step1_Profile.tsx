
import React, { useState } from 'react';
import type { UserProfile } from '../../types';
import { FINANCIAL_GOALS, FAMILY_SITUATIONS, INVESTMENT_PREFERENCES } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';

interface Step1_ProfileProps {
  onSubmit: (profile: UserProfile) => void;
}

const Step1_Profile: React.FC<Step1_ProfileProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
      investmentPreference: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'income' || name === 'timeHorizon' || name === 'existingInvestments' || name === 'debts' || name === 'emergencySavings' ? Number(value) : value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfile(prev => {
        const prefs = prev.investmentPreference || [];
        if(checked) {
            return {...prev, investmentPreference: [...prefs, value]}
        } else {
            return {...prev, investmentPreference: prefs.filter(p => p !== value)}
        }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if(profile.age && profile.income && profile.financialGoal && profile.familySituation && profile.timeHorizon) {
         onSubmit(profile as UserProfile);
    } else {
        alert("Please fill out all required fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-primary mb-6">Tell Us About Yourself</h2>
      <p className="text-text-secondary mb-8">This information helps us tailor the perfect financial strategy for you.</p>

      <div className="space-y-8">
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4 border-b pb-2">Basic Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Age" name="age" type="number" value={profile.age || ''} onChange={handleChange} required />
            <Input label="Annual Income" name="income" type="number" value={profile.income || ''} onChange={handleChange} required icon={<span>$</span>} />
            <Select label="Primary Financial Goal" name="financialGoal" options={FINANCIAL_GOALS} value={profile.financialGoal || ''} onChange={handleChange} required />
            <Select label="Family Situation" name="familySituation" options={FAMILY_SITUATIONS} value={profile.familySituation || ''} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Investment Time Horizon (Years)</label>
              <input type="range" name="timeHorizon" min="1" max="50" value={profile.timeHorizon || 10} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-center font-bold text-primary mt-1">{profile.timeHorizon || 10} years</div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4 border-b pb-2">Investment Preferences</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INVESTMENT_PREFERENCES.map(pref => (
                <label key={pref} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" value={pref} onChange={handleCheckboxChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <span className="text-text-secondary">{pref}</span>
                </label>
              ))}
           </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4 border-b pb-2">Current Financial Situation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Existing Investments" name="existingInvestments" type="number" value={profile.existingInvestments || ''} onChange={handleChange} icon={<span>$</span>}/>
            <Input label="Total Debts" name="debts" type="number" value={profile.debts || ''} onChange={handleChange} icon={<span>$</span>} />
            <Input label="Emergency Savings" name="emergencySavings" type="number" value={profile.emergencySavings || ''} onChange={handleChange} icon={<span>$</span>} />
          </div>
        </Card>
      </div>

      <div className="mt-8 text-right">
        <button type="submit" className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105">
            Proceed to Risk Assessment
        </button>
      </div>
    </form>
  );
};

export default Step1_Profile;
