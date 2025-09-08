import React, { useState, useEffect } from 'react';
import { SRECRecord, SRECStatus } from '../../types/srecTypes';
import { srecDataService } from '../../services/srecDataService';
import './EditRecordModal.css';

interface EditRecordModalProps {
  isOpen: boolean;
  record: SRECRecord | null;
  onClose: () => void;
  onSave: () => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({ isOpen, record, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<SRECRecord>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setFormData({
        status: record.status,
        marketPrice: record.marketPrice,
        salePrice: record.salePrice,
        buyerName: record.buyerName,
        saleDate: record.saleDate,
        notes: record.notes
      });
      setErrors({});
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (formData.marketPrice && formData.marketPrice < 0) {
      newErrors.marketPrice = 'Market price cannot be negative';
    }

    if (formData.salePrice && formData.salePrice < 0) {
      newErrors.salePrice = 'Sale price cannot be negative';
    }

    if (formData.status === 'Sold' || formData.status === 'Settled') {
      if (!formData.salePrice) {
        newErrors.salePrice = 'Sale price is required for sold certificates';
      }
      if (!formData.buyerName) {
        newErrors.buyerName = 'Buyer name is required for sold certificates';
      }
      if (!formData.saleDate) {
        newErrors.saleDate = 'Sale date is required for sold certificates';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the record with the form data
      const updatedRecord = { ...record, ...formData };
      await srecDataService.updateSRECRecord(record.id, updatedRecord);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to update SREC record:', error);
      setErrors({ general: 'Failed to update record. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SRECRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getStatusOptions = (): SRECStatus[] => {
    return ['Generated', 'Verified', 'Listed', 'Sold', 'Settled', 'Retired', 'Expired'];
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="edit-record-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Edit SREC Record</h2>
            <div className="certificate-id-header">
              <span className="certificate-id-label">Certificate ID:</span>
              <span className="certificate-id-value">{record.certificateId}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="modal-content">
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <div className="form-grid">
              <div className="form-section">
                <h3 className="section-title">Status & Pricing</h3>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status *
                  </label>
                  <select
                    id="status"
                    className={`form-select ${errors.status ? 'error' : ''}`}
                    value={formData.status || ''}
                    onChange={(e) => handleChange('status', e.target.value as SRECStatus)}
                  >
                    <option value="">Select Status</option>
                    {getStatusOptions().map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.status && <span className="error-message">{errors.status}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="marketPrice">
                    Market Price ($)
                  </label>
                  <input
                    type="number"
                    id="marketPrice"
                    className={`form-input ${errors.marketPrice ? 'error' : ''}`}
                    value={formData.marketPrice || ''}
                    onChange={(e) => handleChange('marketPrice', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                  {errors.marketPrice && <span className="error-message">{errors.marketPrice}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="salePrice">
                    Sale Price ($)
                    {(formData.status === 'Sold' || formData.status === 'Settled') && ' *'}
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    className={`form-input ${errors.salePrice ? 'error' : ''}`}
                    value={formData.salePrice || ''}
                    onChange={(e) => handleChange('salePrice', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                  {errors.salePrice && <span className="error-message">{errors.salePrice}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Transaction Details</h3>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="buyerName">
                    Buyer Name
                    {(formData.status === 'Sold' || formData.status === 'Settled') && ' *'}
                  </label>
                  <input
                    type="text"
                    id="buyerName"
                    className={`form-input ${errors.buyerName ? 'error' : ''}`}
                    value={formData.buyerName || ''}
                    onChange={(e) => handleChange('buyerName', e.target.value)}
                    placeholder="Enter buyer name"
                  />
                  {errors.buyerName && <span className="error-message">{errors.buyerName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="saleDate">
                    Sale Date
                    {(formData.status === 'Sold' || formData.status === 'Settled') && ' *'}
                  </label>
                  <input
                    type="date"
                    id="saleDate"
                    className={`form-input ${errors.saleDate ? 'error' : ''}`}
                    value={formatDateForInput(formData.saleDate)}
                    onChange={(e) => handleChange('saleDate', e.target.value)}
                  />
                  {errors.saleDate && <span className="error-message">{errors.saleDate}</span>}
                </div>
              </div>

              <div className="form-section full-width">
                <h3 className="section-title">Additional Information</h3>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="notes">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    className="form-textarea"
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Add any additional notes about this SREC..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="readonly-info">
              <h3 className="section-title">Certificate Information (Read Only)</h3>
              <div className="readonly-grid">
                <div className="readonly-item">
                  <span className="readonly-label">Facility:</span>
                  <span className="readonly-value">{record.facilityName}</span>
                </div>
                <div className="readonly-item">
                  <span className="readonly-label">Generation:</span>
                  <span className="readonly-value">
                    {record.mwhGenerated.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} MWh
                  </span>
                </div>
                <div className="readonly-item">
                  <span className="readonly-label">Vintage:</span>
                  <span className="readonly-value">{record.vintage}</span>
                </div>
                <div className="readonly-item">
                  <span className="readonly-label">State:</span>
                  <span className="readonly-value">{record.state}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordModal;