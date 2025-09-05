import React, { useState } from 'react';
import './EligibilityForm.css';
import { FlowState } from './ConsultationFlow';

interface EligibilityFormProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({ flowState, onUpdate, onNext, onBack }) => {
  const [address, setAddress] = useState(flowState.address || '');
  const [utility, setUtility] = useState(flowState.utility || '');
  const [errors, setErrors] = useState<{ address?: string; utility?: string }>({});

  const validate = () => {
    const e: { address?: string; utility?: string } = {};
    if (!address.trim()) e.address = 'Address is required';
    if (!utility.trim()) e.utility = 'Utility is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    onUpdate({ address, utility });
    onNext();
  };

  return (
    <div className="eligibility-form">
      <form className="eligibility-grid" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <div className="form-field">
          <label className="field-label" htmlFor="address">Address *</label>
          <input
            id="address"
            type="text"
            className={`field-input ${errors.address ? 'error' : ''}`}
            placeholder="Enter a location"
            value={address}
            onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors({ ...errors, address: undefined }); }}
          />
          {errors.address && <div className="field-error">{errors.address}</div>}
          <div className="field-hint">Address must be selected from dropdown options</div>
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="utility">Utility *</label>
          <input
            id="utility"
            type="text"
            className={`field-input ${errors.utility ? 'error' : ''}`}
            placeholder="Enter your utility"
            value={utility}
            onChange={(e) => { setUtility(e.target.value); if (errors.utility) setErrors({ ...errors, utility: undefined }); }}
          />
          {errors.utility && <div className="field-error">{errors.utility}</div>}
        </div>

        <div className="actions">
          <button type="button" className="back-btn" onClick={onBack}>Back</button>
          <button type="submit" className="next-btn">Continue</button>
        </div>
      </form>
    </div>
  );
};

export default EligibilityForm;
