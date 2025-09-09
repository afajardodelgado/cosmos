import React, { useEffect, useState, useCallback } from 'react';
import './SRECInvoicing.css';
import { srecDataService } from '../../services/srecDataService';
import { 
  SRECInvoice, 
  InvoiceSearchFilters, 
  PaginationInfo,
  InvoiceStatus 
} from '../../types/srecTypes';
import InvoiceViewModal from './InvoiceViewModal';
import InvoiceEditModal from './InvoiceEditModal';
import InvoiceSendModal from './InvoiceSendModal';
import InvoiceExportModal from './InvoiceExportModal';

const SRECInvoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<SRECInvoice[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SRECInvoice | null>(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const loadInvoicesCallback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: InvoiceSearchFilters = {};
      if (searchTerm.trim()) filters.searchTerm = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      
      const result = await srecDataService.getInvoices(
        filters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      setInvoices(result.invoices);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadInvoicesCallback();
  }, [loadInvoicesCallback]);

  // Ensure the create modal opens with content at the very top and focus on first field
  useEffect(() => {
    // When opening: lock background scroll and jump to top
    if (showCreateModal) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = (document.documentElement as HTMLElement).style.overflow;
      document.body.style.overflow = 'hidden';
      (document.documentElement as HTMLElement).style.overflow = 'hidden';
      try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}

      const t = setTimeout(() => {
        const content = document.querySelector<HTMLDivElement>('.create-invoice-modal .modal-content');
        if (content) content.scrollTop = 0;
        const firstInput = document.querySelector<HTMLInputElement>('.create-invoice-modal .invoice-form input, .create-invoice-modal .invoice-form textarea, .create-invoice-modal .invoice-form select');
        if (firstInput) firstInput.focus();
      }, 0);

      return () => {
        clearTimeout(t);
        document.body.style.overflow = prevBodyOverflow;
        (document.documentElement as HTMLElement).style.overflow = prevHtmlOverflow;
      };
    }
  }, [showCreateModal]);


  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(i => i.id));
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClass = (status: InvoiceStatus): string => {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Sent': return 'status-sent';
      case 'Paid': return 'status-paid';
      case 'Overdue': return 'status-overdue';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const isOverdue = (dueDate: string, status: InvoiceStatus): boolean => {
    if (status === 'Paid' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => handlePageChange(1)} className="pagination-btn">
          First
        </button>
      );
    }

    if (pagination.currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(pagination.currentPage - 1)} className="pagination-btn">
          Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${pagination.currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (pagination.currentPage < pagination.totalPages) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(pagination.currentPage + 1)} className="pagination-btn">
          Next
        </button>
      );
    }

    if (endPage < pagination.totalPages) {
      pages.push(
        <button key="last" onClick={() => handlePageChange(pagination.totalPages)} className="pagination-btn">
          Last
        </button>
      );
    }

    return pages;
  };

  const getTotalStats = () => {
    return {
      totalInvoices: pagination.totalRecords,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidAmount: invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
      overdueAmount: invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.totalAmount, 0),
      pendingCount: invoices.filter(i => i.status === 'Sent').length
    };
  };

  if (loading) {
    return (
      <div className="srec-loading">
        <div className="srec-loading-spinner"></div>
        <p>Loading SREC invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="srec-error">
        <p>{error}</p>
        <button onClick={loadInvoicesCallback} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="srec-invoicing">
      <div className="invoicing-header">
        <h2 className="invoicing-title">SREC Invoicing & Payments</h2>
        <div className="invoicing-actions">
          <button 
            className="create-invoice-btn"
            onClick={() => { setShowCreateModal(true); try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {} }}
          >
            Create Invoice +
          </button>
          {selectedInvoices.length > 0 && (
            <button className="bulk-action-btn">
              Bulk Actions ({selectedInvoices.length})
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="invoice-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalInvoices}</div>
            <div className="stat-label">Total Invoices</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
            <div className="stat-label">Total Billed</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.paidAmount)}</div>
            <div className="stat-label">Paid Amount</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.overdueAmount)}</div>
            <div className="stat-label">Overdue Amount</div>
          </div>
        </div>
      </div>

      <div className="invoicing-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by Invoice #, Customer Name, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>

        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="invoices-table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                  onChange={handleSelectAll}
                  className="table-checkbox"
                />
              </th>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>SRECs</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className={`${selectedInvoices.includes(invoice.id) ? 'selected' : ''} ${isOverdue(invoice.dueDate, invoice.status) ? 'overdue-row' : ''}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={() => handleSelectInvoice(invoice.id)}
                    className="table-checkbox"
                  />
                </td>
                <td className="invoice-number">
                  <div className="invoice-info">
                    <div className="invoice-primary">{invoice.invoiceNumber}</div>
                    <div className="invoice-secondary">ID: {invoice.id}</div>
                  </div>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{invoice.customerName}</div>
                    <div className="customer-email">{invoice.customerEmail}</div>
                  </div>
                </td>
                <td className="srec-count">
                  <div className="srec-summary">
                    <div className="srec-total">{invoice.totalSRECs} SRECs</div>
                    <div className="srec-price">@{formatCurrency(invoice.pricePerSREC)}</div>
                  </div>
                </td>
                <td className="invoice-amount">
                  <div className="amount-breakdown">
                    <div className="total-amount">{formatCurrency(invoice.totalAmount)}</div>
                    <div className="subtotal">Sub: {formatCurrency(invoice.subtotal)}</div>
                  </div>
                </td>
                <td>
                  <span className={`invoice-status ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  {isOverdue(invoice.dueDate, invoice.status) && (
                    <div className="overdue-badge">OVERDUE</div>
                  )}
                </td>
                <td className="issue-date">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="due-date">
                  <div className={isOverdue(invoice.dueDate, invoice.status) ? 'overdue' : ''}>
                    {formatDate(invoice.dueDate)}
                  </div>
                </td>
                <td className="actions-column">
                  <div className="action-buttons">
                    <button
                      className="action-btn view-btn"
                      title="View Invoice"
                      onClick={() => { setSelectedInvoice(invoice); setShowView(true); }}
                    >
                      View
                    </button>
                    <button
                      className="action-btn edit-btn"
                      title="Edit Invoice"
                      onClick={() => { setSelectedInvoice(invoice); setShowEdit(true); }}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn send-btn"
                      title="Send Invoice"
                      onClick={() => { setSelectedInvoice(invoice); setShowSend(true); }}
                    >
                      Send
                    </button>
                    <button
                      className="action-btn download-btn"
                      title="Download / Export"
                      onClick={() => { setSelectedInvoice(invoice); setShowExport(true); }}
                    >
                      Export
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No invoices found matching your criteria.</p>
          <button 
            className="create-invoice-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Invoice
          </button>
        </div>
      )}

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of {pagination.totalRecords} invoices
        </div>
        <div className="pagination-controls">
          {renderPagination()}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="create-invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New SREC Invoice</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="invoice-form">
                <div className="form-section">
                  <h4>Customer Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <input type="text" placeholder="Enter customer name" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="customer@example.com" className="form-input" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Billing Address</label>
                    <textarea placeholder="Enter billing address" className="form-textarea"></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h4>SREC Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Number of SRECs</label>
                      <input type="number" placeholder="0" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Price per SREC</label>
                      <input type="number" placeholder="0.00" step="0.01" className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Payment Terms</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Payment Terms</label>
                      <select className="form-select">
                        <option>Net 30</option>
                        <option>Net 15</option>
                        <option>Due on Receipt</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary">
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <InvoiceViewModal
        isOpen={showView}
        invoice={selectedInvoice}
        onClose={() => setShowView(false)}
      />
      <InvoiceEditModal
        isOpen={showEdit}
        invoice={selectedInvoice}
        onClose={() => setShowEdit(false)}
        onSave={(updates) => {
          if (!selectedInvoice) return;
          // Optimistic update in UI only for now
          setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, ...updates } as SRECInvoice : inv));
        }}
      />
      <InvoiceSendModal
        isOpen={showSend}
        invoice={selectedInvoice}
        onClose={() => setShowSend(false)}
        onSend={() => {
          // Optionally set status to Sent
          if (selectedInvoice) {
            setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'Sent' } : inv));
          }
        }}
      />
      <InvoiceExportModal
        isOpen={showExport}
        invoice={selectedInvoice}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
};

export default SRECInvoicing;