import React, { useEffect, useMemo, useState } from 'react';
import { srecDataService } from '../../services/srecDataService';
import { SRECFacility } from '../../types/srecTypes';
import './CreateSRECModal.css';

interface CreateSRECModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void; // callback to refresh parent after create
}

const CreateSRECModal: React.FC<CreateSRECModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [facilities, setFacilities] = useState<SRECFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facilityId, setFacilityId] = useState('');
  const [generationDate, setGenerationDate] = useState<string>('');
  const [mwhGenerated, setMwhGenerated] = useState<string>('');
  const [marketPrice, setMarketPrice] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const result = await srecDataService.getFacilities();
        if (mounted) setFacilities(result);
      } catch (e) {
        console.error(e);
        if (mounted) setError('Failed to load facilities');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return (
      !!facilityId &&
      !!generationDate &&
      Number(mwhGenerated) > 0 &&
      Number(marketPrice) >= 0
    );
  }, [facilityId, generationDate, mwhGenerated, marketPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await srecDataService.createSRECRecord({
        facilityId,
        generationDate,
        mwhGenerated: Number(mwhGenerated),
        marketPrice: Number(marketPrice),
        notes: notes.trim() ? notes : undefined,
      });
      onCreated();
      onClose();
      // reset simple fields
      setFacilityId('');
      setGenerationDate('');
      setMwhGenerated('');
      setMarketPrice('');
      setNotes('');
    } catch (err) {
      console.error(err);
      setError('Failed to create SREC. Please try again.');
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
    <div className="modal-backdrop" onClick={handleBackdropClick}>
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

            <div className="form-grid">
              <div className="form-section">
                <h3 className="section-title">Facility & Generation</h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="facility">Facility *</label>
                  <select
                    id="facility"
                    className="form-select"
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a facility</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} • {f.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="genDate">Generation Date *</label>
                  <input
                    id="genDate"
                    type="date"
                    className="form-input"
                    value={generationDate}
                    onChange={(e) => setGenerationDate(e.target.value)}
                    required
                  />
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="mwh">MWh Generated *</label>
                    <input
                      id="mwh"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input"
                      value={mwhGenerated}
                      onChange={(e) => setMwhGenerated(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="price">Market Price ($) *</label>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input"
                      value={marketPrice}
                      onChange={(e) => setMarketPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
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
