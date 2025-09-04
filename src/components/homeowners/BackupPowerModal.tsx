import React from 'react';
import './BackupPowerModal.css';

interface BackupPowerModalProps {
  isOpen: boolean;
  selectedHours: number;
  onSelect: (hours: number) => void;
  onClose: () => void;
}

const BackupPowerModal: React.FC<BackupPowerModalProps> = ({
  isOpen,
  selectedHours,
  onSelect,
  onClose
}) => {
  const hoursOptions = [
    {
      hours: 0,
      title: 'I don\'t need to store backup energy to prepare for severe weather.',
      selected: selectedHours === 0
    },
    {
      hours: 8,
      title: 'I want to save power to back up for half a day for severe weather.',
      selected: selectedHours === 8
    },
    {
      hours: 16,
      title: 'I want to save power to back up for 16 hours for severe weather.',
      selected: selectedHours === 16
    },
    {
      hours: 24,
      title: 'I want to save power that I can back up for a day for severe weather.',
      selected: selectedHours === 24
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
          <h3>Hours of Backup Power</h3>
        </div>
        
        <div className="modal-body">
          <div className="hours-options">
            {hoursOptions.map((option) => (
              <div 
                key={option.hours}
                className={`hours-option ${option.selected ? 'selected' : ''}`}
                onClick={() => onSelect(option.hours)}
              >
                <div className="option-radio">
                  <div className={`radio-dot ${option.selected ? 'selected' : ''}`} />
                </div>
                <div className="option-content">
                  <div className="option-hours">{option.hours} Hrs</div>
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

export default BackupPowerModal;