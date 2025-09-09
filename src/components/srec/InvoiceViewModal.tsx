import React from 'react';
import { SRECInvoice } from '../../types/srecTypes';
import './InvoiceModals.css';

interface InvoiceViewModalProps {
  isOpen: boolean;
  invoice: SRECInvoice | null;
  onClose: () => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ isOpen, invoice, onClose }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Invoice Details</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-content">
          <div className="view-sections">
            <div className="view-card">
              <h4>Invoice</h4>
              <div className="view-row"><span className="view-label">Number</span><span className="view-value">{invoice.invoiceNumber}</span></div>
              <div className="view-row"><span className="view-label">Status</span><span className="view-value">{invoice.status}</span></div>
              <div className="view-row"><span className="view-label">Issue Date</span><span className="view-value">{formatDate(invoice.issueDate)}</span></div>
              <div className="view-row"><span className="view-label">Due Date</span><span className="view-value">{formatDate(invoice.dueDate)}</span></div>
            </div>
            <div className="view-card">
              <h4>Customer</h4>
              <div className="view-row"><span className="view-label">Name</span><span className="view-value">{invoice.customerName}</span></div>
              <div className="view-row"><span className="view-label">Email</span><span className="view-value">{invoice.customerEmail}</span></div>
              <div className="view-row"><span className="view-label">Address</span><span className="view-value">{invoice.customerAddress}</span></div>
            </div>
            <div className="view-card">
              <h4>Amounts</h4>
              <div className="view-row"><span className="view-label">SRECs</span><span className="view-value">{invoice.totalSRECs}</span></div>
              <div className="view-row"><span className="view-label">Price/SREC</span><span className="view-value">{formatCurrency(invoice.pricePerSREC)}</span></div>
              <div className="view-row"><span className="view-label">Subtotal</span><span className="view-value">{formatCurrency(invoice.subtotal)}</span></div>
              <div className="view-row"><span className="view-label">Fees</span><span className="view-value">{formatCurrency(invoice.brokerageFee + invoice.processingFee)}</span></div>
              <div className="view-row"><span className="view-label">Taxes</span><span className="view-value">{formatCurrency(invoice.taxes)}</span></div>
              <div className="view-row"><span className="view-label">Total</span><span className="view-value">{formatCurrency(invoice.totalAmount)}</span></div>
            </div>
          </div>
          {invoice.notes && (
            <div className="view-card" style={{ marginTop: 16 }}>
              <h4>Notes</h4>
              <div className="view-row"><span className="view-value">{invoice.notes}</span></div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
