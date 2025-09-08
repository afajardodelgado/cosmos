import React, { useState } from 'react';
import { SRECRecord } from '../../types/srecTypes';
import './ViewDetailsModal.css';

interface ViewDetailsModalProps {
  isOpen: boolean;
  record: SRECRecord | null;
  onClose: () => void;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, record, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !record) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Generated': return '#1976d2';
      case 'Verified': return '#388e3c';
      case 'Listed': return '#f57c00';
      case 'Sold': return '#2e7d32';
      case 'Settled': return '#7b1fa2';
      case 'Retired': return '#616161';
      case 'Expired': return '#c62828';
      default: return '#666';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="view-details-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">SREC Certificate Details</h2>
            <div className="certificate-id-header">
              <span className="certificate-id-label">Certificate ID:</span>
              <span className="certificate-id-value">{record.certificateId}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button
            className={`modal-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            History
          </button>
          <button
            className={`modal-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => handleTabChange('documents')}
          >
            Documents
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="details-grid">
                <div className="details-section">
                  <h3 className="section-title">Certificate Information</h3>
                  <div className="details-row">
                    <span className="detail-label">Certificate ID:</span>
                    <span className="detail-value">{record.certificateId}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Registry ID:</span>
                    <span className="detail-value">{record.registryId}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Vintage:</span>
                    <span className="detail-value">{record.vintage}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Status:</span>
                    <span 
                      className="detail-value status-badge" 
                      style={{ color: getStatusColor(record.status) }}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="details-section">
                  <h3 className="section-title">Generation Details</h3>
                  <div className="details-row">
                    <span className="detail-label">Generation Amount:</span>
                    <span className="detail-value highlight">
                      {record.mwhGenerated.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} MWh
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Generation Date:</span>
                    <span className="detail-value">{formatDate(record.generationDate)}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Generation Period:</span>
                    <span className="detail-value">
                      {formatDate(record.generationPeriodStart)} - {formatDate(record.generationPeriodEnd)}
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Expiration Date:</span>
                    <span className="detail-value">{formatDate(record.expirationDate)}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3 className="section-title">Facility Information</h3>
                  <div className="details-row">
                    <span className="detail-label">Facility Name:</span>
                    <span className="detail-value">{record.facilityName}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Facility ID:</span>
                    <span className="detail-value">{record.facilityId}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{record.facilityLocation}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{record.state}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3 className="section-title">Market Information</h3>
                  <div className="details-row">
                    <span className="detail-label">Market Price:</span>
                    <span className="detail-value">{formatCurrency(record.marketPrice)}</span>
                  </div>
                  {record.salePrice && (
                    <div className="details-row">
                      <span className="detail-label">Sale Price:</span>
                      <span className="detail-value highlight">{formatCurrency(record.salePrice)}</span>
                    </div>
                  )}
                  {record.buyerName && (
                    <>
                      <div className="details-row">
                        <span className="detail-label">Buyer:</span>
                        <span className="detail-value">{record.buyerName}</span>
                      </div>
                      {record.saleDate && (
                        <div className="details-row">
                          <span className="detail-label">Sale Date:</span>
                          <span className="detail-value">{formatDate(record.saleDate)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {record.notes && (
                <div className="notes-section">
                  <h3 className="section-title">Notes</h3>
                  <div className="notes-content">
                    {record.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker created"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Certificate Created</div>
                    <div className="timeline-date">{formatDate(record.createdDate)}</div>
                    <div className="timeline-description">SREC certificate was generated from facility energy production</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker updated"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Last Updated</div>
                    <div className="timeline-date">{formatDate(record.updatedDate)}</div>
                    <div className="timeline-description">Certificate status or information was modified</div>
                  </div>
                </div>

                {record.saleDate && (
                  <div className="timeline-item">
                    <div className="timeline-marker sold"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Certificate Sold</div>
                      <div className="timeline-date">{formatDate(record.saleDate)}</div>
                      <div className="timeline-description">
                        Sold to {record.buyerName} for {formatCurrency(record.salePrice!)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-tab">
              <div className="documents-list">
                <div className="document-item">
                  <div className="document-icon">📄</div>
                  <div className="document-info">
                    <div className="document-name">Official SREC Certificate</div>
                    <div className="document-description">Generated certificate with QR verification code</div>
                  </div>
                  <button className="document-action-btn">Download PDF</button>
                </div>
                
                <div className="document-item">
                  <div className="document-icon">📊</div>
                  <div className="document-info">
                    <div className="document-name">Generation Report</div>
                    <div className="document-description">Detailed energy generation and facility information</div>
                  </div>
                  <button className="document-action-btn">Download Excel</button>
                </div>
                
                <div className="document-item">
                  <div className="document-icon">✅</div>
                  <div className="document-info">
                    <div className="document-name">Compliance Documentation</div>
                    <div className="document-description">Regulatory filing and compliance verification</div>
                  </div>
                  <button className="document-action-btn">Download PDF</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-secondary-btn" onClick={onClose}>
            Close
          </button>
          <button className="modal-primary-btn">
            Export All Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;