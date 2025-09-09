import React, { useState } from 'react';
import { SRECInvoice } from '../../types/srecTypes';
import './InvoiceModals.css';

interface InvoiceSendModalProps {
  isOpen: boolean;
  invoice: SRECInvoice | null;
  onClose: () => void;
  onSend?: (email: { to: string; subject: string; message: string }) => void;
}

const InvoiceSendModal: React.FC<InvoiceSendModalProps> = ({ isOpen, invoice, onClose, onSend }) => {
  const [to, setTo] = useState(invoice?.customerEmail || '');
  const [subject, setSubject] = useState(`Invoice ${invoice?.invoiceNumber || ''}`);
  const [message, setMessage] = useState(
    invoice
      ? `Hello ${invoice.customerName},\n\nPlease find your SREC invoice ${invoice.invoiceNumber}.\nTotal Due: $${invoice.totalAmount}\n\nThank you,\nEnergy Services Team`
      : ''
  );

  React.useEffect(() => {
    if (invoice && isOpen) {
      setTo(invoice.customerEmail);
      setSubject(`Invoice ${invoice.invoiceNumber}`);
      setMessage(`Hello ${invoice.customerName},\n\nPlease find your SREC invoice ${invoice.invoiceNumber}.\nTotal Due: $${invoice.totalAmount}\n\nThank you,\nEnergy Services Team`);
    }
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleSend = () => {
    onSend?.({ to, subject, message });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Send Invoice</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-content">
          <div className="send-grid">
            <div className="send-row">
              <label style={{ width: 80, color: '#ccc' }}>To</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="send-row">
              <label style={{ width: 80, color: '#ccc' }}>Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="send-row" style={{ alignItems: 'flex-start' }}>
              <label style={{ width: 80, color: '#ccc', paddingTop: 10 }}>Message</label>
              <textarea style={{ flex: 1, minHeight: 140, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff' }} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-secondary-btn" onClick={onClose}>Cancel</button>
          <button className="modal-primary-btn" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSendModal;
