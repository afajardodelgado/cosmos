import React, { useState } from 'react';
import { SRECRecord } from '../../types/srecTypes';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  record: SRECRecord | null;
  onClose: () => void;
}

type ExportFormat = 'pdf' | 'excel' | 'csv';
type DocumentType = 'certificate' | 'report' | 'compliance' | 'transaction';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, record, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>(['certificate']);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !record) return null;

  const documentOptions = [
    {
      id: 'certificate' as DocumentType,
      name: 'Official SREC Certificate',
      description: 'Generated certificate with QR verification code',
      icon: '📄',
      supportedFormats: ['pdf'] as ExportFormat[]
    },
    {
      id: 'report' as DocumentType,
      name: 'Generation Report',
      description: 'Detailed energy generation and facility information',
      icon: '📊',
      supportedFormats: ['pdf', 'excel', 'csv'] as ExportFormat[]
    },
    {
      id: 'compliance' as DocumentType,
      name: 'Compliance Documentation',
      description: 'Regulatory filing and compliance verification',
      icon: '✅',
      supportedFormats: ['pdf', 'excel'] as ExportFormat[]
    },
    {
      id: 'transaction' as DocumentType,
      name: 'Transaction History',
      description: 'Complete transaction and pricing history',
      icon: '💰',
      supportedFormats: ['excel', 'csv'] as ExportFormat[]
    }
  ];

  const formatOptions = [
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF',
      description: 'Portable Document Format - ideal for official documents',
      icon: '📄'
    },
    {
      id: 'excel' as ExportFormat,
      name: 'Excel',
      description: 'Microsoft Excel format - perfect for data analysis',
      icon: '📊'
    },
    {
      id: 'csv' as ExportFormat,
      name: 'CSV',
      description: 'Comma-separated values - universal data format',
      icon: '📋'
    }
  ];

  const getAvailableFormats = (): ExportFormat[] => {
    if (selectedDocuments.length === 0) return [];
    
    const allFormats = selectedDocuments.map(docType => {
      const doc = documentOptions.find(d => d.id === docType);
      return doc?.supportedFormats || [];
    });

    return allFormats.reduce((common, formats) => 
      common.filter(format => formats.includes(format))
    );
  };

  const handleDocumentToggle = (documentType: DocumentType) => {
    setSelectedDocuments(prev => {
      const newSelection = prev.includes(documentType)
        ? prev.filter(d => d !== documentType)
        : [...prev, documentType];

      // Update format if current format is not supported by new selection
      const availableFormats = getAvailableFormatsForSelection(newSelection);
      if (!availableFormats.includes(selectedFormat) && availableFormats.length > 0) {
        setSelectedFormat(availableFormats[0]);
      }

      return newSelection;
    });
  };

  const getAvailableFormatsForSelection = (documents: DocumentType[]): ExportFormat[] => {
    if (documents.length === 0) return [];
    
    const allFormats = documents.map(docType => {
      const doc = documentOptions.find(d => d.id === docType);
      return doc?.supportedFormats || [];
    });

    return allFormats.reduce((common, formats) => 
      common.filter(format => formats.includes(format))
    );
  };

  const handleExport = async () => {
    if (selectedDocuments.length === 0) return;

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const docNames = selectedDocuments.join('-');
      const filename = `SREC_${record.certificateId}_${docNames}_${timestamp}.${selectedFormat}`;
      
      // Create and trigger download
      const content = generateMockFileContent(record, selectedDocuments, selectedFormat);
      const blob = new Blob([content], { 
        type: getMimeType(selectedFormat)
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateMockFileContent = (record: SRECRecord, documents: DocumentType[], format: ExportFormat): string => {
    const timestamp = new Date().toLocaleString();
    
    if (format === 'csv') {
      let csv = 'Field,Value\n';
      csv += `Certificate ID,${record.certificateId}\n`;
      csv += `Status,${record.status}\n`;
      csv += `Facility,${record.facilityName}\n`;
      csv += `Generation,${record.mwhGenerated} MWh\n`;
      csv += `Market Price,$${record.marketPrice}\n`;
      csv += `Generated Date,${new Date(record.generationDate).toLocaleDateString()}\n`;
      csv += `Export Date,${timestamp}\n`;
      return csv;
    }

    // For PDF/Excel, return a simple text representation
    return `SREC Export Report
Generated: ${timestamp}

Certificate ID: ${record.certificateId}
Status: ${record.status}
Facility: ${record.facilityName}
Location: ${record.facilityLocation}
State: ${record.state}
Vintage: ${record.vintage}
Generation Amount: ${record.mwhGenerated} MWh
Market Price: $${record.marketPrice}
${record.salePrice ? `Sale Price: $${record.salePrice}` : ''}
${record.buyerName ? `Buyer: ${record.buyerName}` : ''}

Generation Date: ${new Date(record.generationDate).toLocaleDateString()}
Expiration Date: ${new Date(record.expirationDate).toLocaleDateString()}

Documents Included: ${documents.join(', ')}
Export Format: ${format.toUpperCase()}

This is a sample export. In a real implementation, this would generate properly formatted ${format.toUpperCase()} files with complete data and formatting.`;
  };

  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'pdf': return 'application/pdf';
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv': return 'text/csv';
      default: return 'text/plain';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isExporting) {
      onClose();
    }
  };

  const availableFormats = getAvailableFormats();

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="export-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Export SREC Documents</h2>
            <div className="certificate-id-header">
              <span className="certificate-id-label">Certificate ID:</span>
              <span className="certificate-id-value">{record.certificateId}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="export-section">
            <h3 className="section-title">Select Documents</h3>
            <div className="document-grid">
              {documentOptions.map((doc) => (
                <div
                  key={doc.id}
                  className={`document-option ${selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
                  onClick={() => handleDocumentToggle(doc.id)}
                >
                  <div className="document-option-icon">{doc.icon}</div>
                  <div className="document-option-info">
                    <div className="document-option-name">{doc.name}</div>
                    <div className="document-option-description">{doc.description}</div>
                    <div className="document-formats">
                      Formats: {doc.supportedFormats.join(', ').toUpperCase()}
                    </div>
                  </div>
                  <div className="document-option-checkbox">
                    {selectedDocuments.includes(doc.id) && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="export-section">
            <h3 className="section-title">Select Format</h3>
            <div className="format-grid">
              {formatOptions.map((format) => {
                const isAvailable = availableFormats.includes(format.id);
                return (
                  <div
                    key={format.id}
                    className={`format-option ${selectedFormat === format.id ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                    onClick={() => isAvailable && setSelectedFormat(format.id)}
                  >
                    <div className="format-option-icon">{format.icon}</div>
                    <div className="format-option-info">
                      <div className="format-option-name">{format.name}</div>
                      <div className="format-option-description">{format.description}</div>
                    </div>
                    {selectedFormat === format.id && <div className="format-option-selected">●</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="export-preview">
            <h3 className="section-title">Export Preview</h3>
            <div className="preview-info">
              <div className="preview-row">
                <span className="preview-label">Documents:</span>
                <span className="preview-value">
                  {selectedDocuments.length > 0 
                    ? selectedDocuments.map(d => documentOptions.find(doc => doc.id === d)?.name).join(', ')
                    : 'No documents selected'
                  }
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Format:</span>
                <span className="preview-value">{selectedFormat.toUpperCase()}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Estimated Size:</span>
                <span className="preview-value">
                  {selectedFormat === 'pdf' ? '~2.5 MB' : selectedFormat === 'excel' ? '~850 KB' : '~45 KB'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-secondary-btn"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className="modal-primary-btn"
            onClick={handleExport}
            disabled={selectedDocuments.length === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : `Export ${selectedFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;