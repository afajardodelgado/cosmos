import React, { useState } from 'react';
import './ConsultationFlow.css';
import ProductSelection from './ProductSelection';
import ProgramSelection from './ProgramSelection';
import ProgramDetails from './ProgramDetails';
import EligibilityForm from './EligibilityForm';
import ProductCards from './ProductCards';
import EnergyOptimization from './EnergyOptimization';
import QuoteForm from './QuoteForm';

export interface FlowState {
  hasExistingSolar: boolean | null;
  selectedProducts: string[];
  selectedPrograms: string[]; // e.g., ['srec', 'vpp']
  address: string;
  utility: string;
  energyOffset: number;
  backupHours: number;
  userInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

interface ConsultationFlowProps {
  onBack: () => void;
}

const ConsultationFlow: React.FC<ConsultationFlowProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowState, setFlowState] = useState<FlowState>({
    hasExistingSolar: null,
    selectedProducts: [],
    selectedPrograms: [],
    address: '',
    utility: '',
    energyOffset: 85,
    backupHours: 0,
    userInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    }
  });

  const steps = [
    {
      component: ProductSelection,
      title: 'Get a free personalized Consultation'
    },
    {
      component: ProductCards,
      title: 'Choose Your Products'
    },
    {
      component: ProgramSelection,
      title: 'Select Programs to Join'
    },
    {
      component: ProgramDetails,
      title: 'Learn About Programs'
    },
    {
      component: EligibilityForm,
      title: 'Help us find the perfect programs for you'
    },
    {
      component: EnergyOptimization,
      title: 'Optimize your energy'
    },
    {
      component: QuoteForm,
      title: 'Save Your Quote & Get a Personalized Consultation'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleFlowStateUpdate = (updates: Partial<FlowState>) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="consultation-flow">
      <div className="flow-container">
        <h1 className="flow-title">{steps[currentStep].title}</h1>
        
        <CurrentStepComponent
          flowState={flowState}
          onUpdate={handleFlowStateUpdate}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default ConsultationFlow;