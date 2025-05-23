import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Stay Details',
    'Room Selection',
    'Guest Information',
    'Payment'
  ];

  return (
    <div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-[#DAA520] transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center"
            style={{ width: `${100 / steps.length}%` }}
          >
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 
              ${index + 1 <= currentStep ? 'bg-[#DAA520] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {index + 1}
            </div>
            <span 
              className={`text-xs text-center 
              ${index + 1 <= currentStep ? 'text-gray-600 font-semibold' : 'text-gray-600'}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;