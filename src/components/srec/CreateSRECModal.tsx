import React, { useEffect, useMemo, useState } from 'react';
import { srecDataService } from '../../services/srecDataService';
import { ResidentialJobStatus } from '../../types/srecTypes';
import './CreateSRECModal.css';

interface CreateSRECModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void; // callback to refresh parent after create
}

const CreateSRECModal: React.FC<CreateSRECModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [installationAddress, setInstallationAddress] = useState('');
  const [jobStatus, setJobStatus] = useState<ResidentialJobStatus>('Before Installation');
  const [ptoDate, setPtoDate] = useState<string>('');
  const [systemSizeKw, setSystemSizeKw] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    // reset form when opening
    setCustomerFirstName('');
    setCustomerLastName('');
    setCustomerEmail('');
    setInstallationAddress('');
    setJobStatus('Before Installation');
    setPtoDate('');
    setSystemSizeKw('');
    setNotes('');
    setError(null);
  }, [isOpen]);

  // On open: ensure modal content starts at top and focus first field.
  // Do NOT scroll the page to the top nor lock background scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      const content = document.querySelector<HTMLDivElement>('.create-record-modal .modal-content');
      if (content) content.scrollTop = 0;
      const first = document.getElementById('firstName') as HTMLInputElement | null;
      if (first) first.focus();
    }, 0);

    // Allow scrolling the underlying page when hovering the dim backdrop
    // by translating wheel events into window scroll.
    const backdrop = document.querySelector('.srec-modal-backdrop');
    const onWheel = (e: any) => {
      // If the event target is inside the modal content, let it handle its own scroll
      const withinModal = (e.target as HTMLElement)?.closest('.create-record-modal');
      if (withinModal) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    };
    if (backdrop) {
      backdrop.addEventListener('wheel', onWheel as EventListener, { passive: false });
      // Note: implementing full touch drag forwarding would require tracking positions; skip for now to avoid complexity.
    }

    return () => {
      clearTimeout(t);
      if (backdrop) backdrop.removeEventListener('wheel', onWheel as EventListener);
    };
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return (
      customerFirstName.trim() !== '' &&
      customerLastName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      installationAddress.trim() !== '' &&
      Number(systemSizeKw) > 0
    );
  }, [customerFirstName, customerLastName, customerEmail, installationAddress, systemSizeKw]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await srecDataService.createResidentialSRECRecord({
        customerFirstName,
        customerLastName,
        customerEmail,
        installationAddress,
        jobStatus,
        ptoDate: ptoDate || undefined,
        systemSizeKw: Number(systemSizeKw),
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create residential SREC. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop srec-modal-backdrop" onClick={handleBackdropClick}>
      <div className="create-record-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Create New SREC</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="modal-content">
            {error && <div className="error-banner">{error}</div>}

            <div className="create-form-grid">
              <div className="form-section">
                <h3 className="section-title">Customer & Site</h3>
                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">Customer First Name *</label>
                    <input id="firstName" className="form-input" value={customerFirstName} onChange={(e) => setCustomerFirstName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Customer Last Name *</label>
                    <input id="lastName" className="form-input" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Customer Email Address *</label>
                  <input id="email" type="email" className="form-input" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">Installation Address *</label>
                  <textarea id="address" className="form-textarea" value={installationAddress} onChange={(e) => setInstallationAddress(e.target.value)} required />
                </div>
                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="jobStatus">Job Status *</label>
                    <select id="jobStatus" className="form-select" value={jobStatus} onChange={(e) => setJobStatus(e.target.value as ResidentialJobStatus)}>
                      <option>Before Installation</option>
                      <option>Installation in Progress</option>
                      <option>Installation Completed</option>
                      <option>PTO Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="ptoDate">PTO Date</label>
                    <input id="ptoDate" type="date" className="form-input" value={ptoDate} onChange={(e) => setPtoDate(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="size">System Size (kW) *</label>
                  <input id="size" type="number" min="0" step="0.01" className="form-input" value={systemSizeKw} onChange={(e) => setSystemSizeKw(e.target.value)} required />
                </div>
              </div>

              <div className="form-section full-width">
                <h3 className="section-title">Notes</h3>
                <div className="form-group">
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Add any additional notes about this SREC..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-secondary-btn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="modal-primary-btn" disabled={!canSubmit || submitting}>
              {submitting ? 'Creating...' : 'Create SREC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSRECModal;
