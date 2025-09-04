import React, { useState } from 'react';
import './EnergyOptimization.css';
import { FlowState } from './ConsultationFlow';
import EnergyOffsetModal from './EnergyOffsetModal';
import BackupPowerModal from './BackupPowerModal';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface EnergyOptimizationProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EnergyOptimization: React.FC<EnergyOptimizationProps> = ({
  flowState,
  onUpdate,
  onNext,
  onBack
}) => {
  const [offsetModalOpen, setOffsetModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [address] = useState('10 Venice Blvd, Venice, CA 90015');
  const [estimate] = useState('4 kW');

  const handleOffsetSelect = (offset: number) => {
    onUpdate({ energyOffset: offset });
  };

  const handleBackupSelect = (hours: number) => {
    onUpdate({ backupHours: hours });
  };

  return (
    <div className="energy-optimization">
      <div className="optimization-layout">
        {/* Left Side - 3D House Visualization */}
        <div className="house-visualization">
          <div className="house-container">
            <div className="house-info">
              <div className="info-tooltip">
                <div className="info-content">
                  Solar Panels convert energy from the sun into clean
                  electricity that you can use to power your home.
                </div>
                <div className="info-tag">Solar Panels</div>
              </div>
            </div>
            
            {/* House 3D Model Placeholder */}
            <div className="house-3d">
              <img src={vppLogo} alt="3D House Model" className="house-model" />
              
              {/* Component Labels */}
              <div className="component-label solar-label">
                <span className="label-dot"></span>
                <span className="label-text">Solar Panels</span>
              </div>
              
              <div className="component-label battery-label">
                <span className="label-dot"></span>
                <span className="label-text">Battery</span>
              </div>
              
              <div className="component-label vpp-label">
                <span className="label-dot"></span>
                <span className="label-text">VPP</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Configuration Panel */}
        <div className="configuration-panel">
          <div className="system-info">
            <h2 className="panel-title">Optimize your energy</h2>
            
            <div className="address-info">
              <div className="address-icon">●</div>
              <span className="address-text">{address}</span>
            </div>
            
            <div className="estimate-info">
              <div className="estimate-icon">●</div>
              <span className="estimate-label">Solar System Estimate</span>
              <span className="estimate-value">{estimate}</span>
            </div>
          </div>
          
          <div className="customization-section">
            <h3 className="section-title">
              Customize your System
              <span className="info-icon">i</span>
            </h3>
            
            <div className="configuration-options">
              <div className="config-option" onClick={() => setOffsetModalOpen(true)}>
                <div className="option-icon">●</div>
                <div className="option-content">
                  <div className="option-label">Energy Offset</div>
                  <div className="option-value">{flowState.energyOffset}%</div>
                </div>
                <div className="option-arrow">&gt;</div>
              </div>
              
              <div className="config-plus">+</div>
              
              <div className="config-option" onClick={() => setBackupModalOpen(true)}>
                <div className="option-icon">●</div>
                <div className="option-content">
                  <div className="option-label">Hours of Backup Power</div>
                  <div className="option-value">{flowState.backupHours} Hrs</div>
                </div>
                <div className="option-arrow">&gt;</div>
              </div>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button className="back-btn" onClick={onBack}>
              Back
            </button>
            <button className="next-btn" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <EnergyOffsetModal
        isOpen={offsetModalOpen}
        selectedOffset={flowState.energyOffset}
        onSelect={handleOffsetSelect}
        onClose={() => setOffsetModalOpen(false)}
      />
      
      <BackupPowerModal
        isOpen={backupModalOpen}
        selectedHours={flowState.backupHours}
        onSelect={handleBackupSelect}
        onClose={() => setBackupModalOpen(false)}
      />
    </div>
  );
};

export default EnergyOptimization;