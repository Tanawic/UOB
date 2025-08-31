
import React, { useState } from 'react';
import type { UserProfile, RiskProfile } from './types';
import Stepper from './components/Stepper';
import Step1_Profile from './components/steps/Step1_Profile';
import Step2_RiskAssessment from './components/steps/Step2_RiskAssessment';
import Step3_Recommendations from './components/steps/Step3_Recommendations';
import Step4_Monitoring from './components/steps/Step4_Monitoring';
import Step5_Education from './components/steps/Step5_Education';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    nextStep();
  };

  const handleRiskAssessmentSubmit = (profile: RiskProfile) => {
    setRiskProfile(profile);
    nextStep();
  };
  
  const restart = () => {
      setUserProfile(null);
      setRiskProfile(null);
      setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_Profile onSubmit={handleProfileSubmit} />;
      case 2:
        return <Step2_RiskAssessment onSubmit={handleRiskAssessmentSubmit} userProfile={userProfile} />;
      case 3:
        return <Step3_Recommendations userProfile={userProfile} riskProfile={riskProfile} />;
      case 4:
        return <Step4_Monitoring userProfile={userProfile} riskProfile={riskProfile} />;
      case 5:
        return <Step5_Education userProfile={userProfile} riskProfile={riskProfile} />;
      default:
        return <Step1_Profile onSubmit={handleProfileSubmit} />;
    }
  };
  
  const isFinalStep = userProfile && riskProfile && currentStep >= 3;

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08V14H8v-2h3V9.92c0-2.26 1.34-3.42 3.31-3.42.96 0 1.8.12 1.8.12l-.24 1.86c-.36-.06-.82-.12-1.38-.12-1.14 0-1.49.56-1.49 1.58V12h3.02l-.39 2H13.1v4.08c-3.1.2-5.1-.98-5.1-4.08z" opacity=".3"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-8.08V9.92c0-1.02.35-1.58 1.49-1.58.56 0 1.02.06 1.38.12l.24-1.86s-.84-.12-1.8-.12C12.34 6.5 11 7.66 11 9.92V12H8v2h3v2.08c-3.1-.2-5.1-.98-5.1-4.08S7.9 6 12 6s5.1 2.92 5.1 7c0 3.1-2 4.28-5.1 4.08z"/>
            </svg>
            Quant-Advisor AI
          </h1>
          {isFinalStep && (
             <button onClick={restart} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition duration-300">
                Start Over
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />
          <div className="mt-8">
            {renderStep()}
          </div>
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-300"
            >
              Back
            </button>
            {currentStep < 3 && (
                 <button disabled className="bg-accent text-white font-bold py-2 px-6 rounded-lg opacity-50 cursor-not-allowed">
                     Next
                 </button>
            )}
            {currentStep >= 3 && currentStep < totalSteps && (
                <button
                onClick={nextStep}
                className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition duration-300"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>

       <footer className="text-center py-4 text-text-secondary text-sm">
        <p>This is a financial planning tool for illustrative purposes only. Not financial advice.</p>
        <p>&copy; 2024 Quant-Advisor AI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
