import React from 'react';
import './ProgramSelection.css';
import { FlowState } from './ConsultationFlow';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface ProgramSelectionProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProgramSelection: React.FC<ProgramSelectionProps> = ({ flowState, onUpdate, onNext, onBack }) => {
  const toggleProgram = (program: string) => {
    const current = flowState.selectedPrograms || [];
    const updated = current.includes(program)
      ? current.filter(p => p !== program)
      : [...current, program];
    onUpdate({ selectedPrograms: updated });
  };

  const isSelected = (program: string) => (flowState.selectedPrograms || []).includes(program);

  const canContinue = (flowState.selectedPrograms || []).length > 0;

  return (
    <div className="program-selection">
      <div className="programs-grid">
        <div
          className={`program-card ${isSelected('vpp') ? 'selected' : ''}`}
          onClick={() => toggleProgram('vpp')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleProgram('vpp'); } }}
        >
          <div className="card-media">
            <img className="media-image" src={vppLogo} alt="VPP Program" />
          </div>
          <div className="card-content">
            <h3 className="card-title">VPP Program</h3>
            <p className="card-description">
              Enroll your battery to participate in a Virtual Power Plant and earn incentives while supporting the grid.
            </p>
          </div>
          <div className="card-actions">
            <button
              className={`select-btn ${isSelected('vpp') ? 'selected' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleProgram('vpp'); }}
            >
              {isSelected('vpp') ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>

        <div
          className={`program-card ${isSelected('srec') ? 'selected' : ''}`}
          onClick={() => toggleProgram('srec')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleProgram('srec'); } }}
        >
          <div className="card-media">
            <img className="media-image" src={vppLogo} alt="SREC Program" />
          </div>
          <div className="card-content">
            <h3 className="card-title">SREC Program</h3>
            <p className="card-description">
              Get rewarded for the clean energy your solar system generates by selling renewable energy credits.
            </p>
          </div>
          <div className="card-actions">
            <button
              className={`select-btn ${isSelected('srec') ? 'selected' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleProgram('srec'); }}
            >
              {isSelected('srec') ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="next-btn" disabled={!canContinue} onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ProgramSelection;
