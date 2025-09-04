import React from 'react';
import './ProductSelection.css';
import { FlowState } from './ConsultationFlow';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface ProductSelectionProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  flowState,
  onUpdate,
  onNext
}) => {
  const handleSelection = (hasExisting: boolean) => {
    onUpdate({ hasExistingSolar: hasExisting });
    onNext();
  };

  return (
    <div className="product-selection">
      <div className="selection-content">
        <div className="selection-options">
          <div 
            className={`selection-option ${flowState.hasExistingSolar === false ? 'selected' : ''}`}
            onClick={() => handleSelection(false)}
          >
            <div className="option-icon">
              <img src={vppLogo} alt="New Solar System" />
            </div>
            <div className="option-content">
              <div className="option-badge">●</div>
              <h3 className="option-title">I don't have an existing solar system</h3>
            </div>
          </div>
          
          <div 
            className={`selection-option ${flowState.hasExistingSolar === true ? 'selected' : ''}`}
            onClick={() => handleSelection(true)}
          >
            <div className="option-icon">
              <img src={vppLogo} alt="Existing Solar System" />
            </div>
            <div className="option-content">
              <div className="option-badge">○</div>
              <h3 className="option-title">I have an existing solar system</h3>
            </div>
          </div>
        </div>
        
        <div className="next-section">
          <button 
            className="next-btn"
            disabled={flowState.hasExistingSolar === null}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;