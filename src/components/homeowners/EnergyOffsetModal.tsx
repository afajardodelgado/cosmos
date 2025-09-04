import React from 'react';
import './EnergyOffsetModal.css';

interface EnergyOffsetModalProps {
  isOpen: boolean;
  selectedOffset: number;
  onSelect: (offset: number) => void;
  onClose: () => void;
}

const EnergyOffsetModal: React.FC<EnergyOffsetModalProps> = ({
  isOpen,
  selectedOffset,
  onSelect,
  onClose
}) => {
  const offsetOptions = [
    {
      percentage: 85,
      title: 'I want to mix Solar\'s energy properly',
      selected: selectedOffset === 85
    },
    {
      percentage: 100,
      title: 'I want to use solar energy just as much energy as consumption',
      selected: selectedOffset === 100
    },
    {
      percentage: 115,
      title: 'I want to have more solar energy than consumption',
      selected: selectedOffset === 115
    }
  ];

  const handleSelect = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Energy Offset</h3>
        </div>
        
        <div className="modal-body">
          <div className="offset-options">
            {offsetOptions.map((option) => (
              <div 
                key={option.percentage}
                className={`offset-option ${option.selected ? 'selected' : ''}`}
                onClick={() => onSelect(option.percentage)}
              >
                <div className="option-radio">
                  <div className={`radio-dot ${option.selected ? 'selected' : ''}`} />
                </div>
                <div className="option-content">
                  <div className="option-percentage">{option.percentage}%</div>
                  <div className="option-title">{option.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="select-btn" onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnergyOffsetModal;