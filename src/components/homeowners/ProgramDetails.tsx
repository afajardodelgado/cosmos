import React, { useMemo, useState } from 'react';
import './ProgramDetails.css';
import { FlowState } from './ConsultationFlow';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface ProgramDetailsProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ flowState, onNext, onBack }) => {
  const availableTabs = useMemo(() => {
    const selected = flowState.selectedPrograms && flowState.selectedPrograms.length > 0
      ? flowState.selectedPrograms
      : ['srec', 'vpp'];
    // Deduplicate and preserve order srec, vpp
    const order: Record<string, number> = { srec: 0, vpp: 1 };
    return Array.from(new Set(selected)).sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
  }, [flowState.selectedPrograms]);

  const [activeTab, setActiveTab] = useState<string>(availableTabs[0]);

  const renderContent = () => {
    if (activeTab === 'vpp') {
      return (
        <div className="program-panel">
          <div className="panel-media"><img src={vppLogo} alt="VPP" /></div>
          <div className="panel-content">
            <h3 className="panel-title">With Energy Storage System, you can start VPP Program</h3>
            <ul className="panel-bullets">
              <li><span className="bullet-title">What is VPP</span> — A Virtual Power Plant (VPP) uses connected batteries to support the grid and pays you for availability and events.</li>
              <li><span className="bullet-title">Additional Revenue</span> — Earn incentives with minimal effort; no impact on your solar warranty.</li>
            </ul>
            <div className="panel-cta">
              <a className="link-cta" href="#vpp-details" onClick={(e)=> e.preventDefault()}>Learn Economics with VPP →</a>
            </div>
          </div>
        </div>
      );
    }

    // SREC fallback
    return (
      <div className="program-panel">
        <div className="panel-media"><img src={vppLogo} alt="SREC" /></div>
        <div className="panel-content">
          <h3 className="panel-title">With Solar Panels, you can start SREC Program</h3>
          <ul className="panel-bullets">
            <li><span className="bullet-title">What is SREC</span> — A Solar Renewable Energy Certificate (SREC) is created for clean energy you produce and can be sold for cash.</li>
            <li><span className="bullet-title">Upfront incentives</span> — Many programs offer one-time incentives based on your system size.</li>
          </ul>
          <div className="panel-cta">
            <a className="link-cta" href="#srec-details" onClick={(e)=> e.preventDefault()}>Get rewarded via SREC →</a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="program-details">
      <div className="tabs">
        {availableTabs.map((t) => (
          <button
            key={t}
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {renderContent()}

      <div className="navigation-buttons">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="next-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ProgramDetails;
