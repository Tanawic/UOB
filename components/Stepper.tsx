
import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  'Profile',
  'Risk Assessment',
  'Recommendations',
  'Portfolio Monitoring',
  'Education Center'
];

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full px-4 sm:px-0">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    isActive ? 'bg-primary text-white scale-110' : isCompleted ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                 <p className={`mt-2 text-sm text-center font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-gray-500'}`}>
                   {STEPS[i]}
                </p>
              </div>
              {stepNumber < totalSteps && (
                <div className={`flex-auto border-t-2 transition-colors duration-300 mx-4 ${isCompleted ? 'border-secondary' : 'border-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
