import React, { useState } from 'react';
import { SRECInvoice } from '../../types/srecTypes';
import './InvoiceModals.css';

interface InvoiceEditModalProps {
  isOpen: boolean;
  invoice: SRECInvoice | null;
  onClose: () => void;
  onSave?: (updated: Partial<SRECInvoice>) => void;
}

const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({ isOpen, invoice, onClose, onSave }) => {
  const [form, setForm] = useState({
    customerName: invoice?.customerName || '',
    customerEmail: invoice?.customerEmail || '',
    customerAddress: invoice?.customerAddress || '',
    dueDate: invoice?.dueDate || new Date().toISOString(),
    notes: invoice?.notes || ''
  });

  React.useEffect(() => {
    if (invoice) {
      setForm({
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerAddress: invoice.customerAddress,
        dueDate: invoice.dueDate,
        notes: invoice.notes || ''
      });
    }
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleChange = (field: keyof typeof form, value: string) => setForm({ ...form, [field]: value });

  const handleSave = () => {
    onSave?.(form);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Invoice</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Customer Name</label>
              <input value={form.customerName} onChange={(e) => handleChange('customerName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <input value={form.customerEmail} onChange={(e) => handleChange('customerEmail', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Billing Address</label>
              <textarea value={form.customerAddress} onChange={(e) => handleChange('customerAddress', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={new Date(form.dueDate).toISOString().split('T')[0]} onChange={(e) => handleChange('dueDate', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-secondary-btn" onClick={onClose}>Cancel</button>
          <button className="modal-primary-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;
