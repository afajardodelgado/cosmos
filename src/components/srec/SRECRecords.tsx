import React, { useEffect, useState, useCallback } from 'react';
import './SRECRecords.css';
import { srecDataService } from '../../services/srecDataService';
import { 
  SRECRecord, 
  SRECSearchFilters, 
  PaginationInfo,
  SRECStatus 
} from '../../types/srecTypes';
import ViewDetailsModal from './ViewDetailsModal';
import EditRecordModal from './EditRecordModal';
import ExportModal from './ExportModal';
import CreateSRECModal from './CreateSRECModal';

const SRECRecords: React.FC = () => {
  const [records, setRecords] = useState<SRECRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SRECStatus | ''>('');
  const [stateFilter, setStateFilter] = useState('');
  const [vintageFilter, setVintageFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SRECRecord | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: SRECSearchFilters = {};
      if (searchTerm.trim()) filters.searchTerm = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      if (stateFilter) filters.state = stateFilter;
      if (vintageFilter) filters.vintage = vintageFilter;
      
      const result = await srecDataService.getSRECRecords(
        filters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      setRecords(result.records);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load SREC records:', err);
      setError('Failed to load SREC records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, stateFilter, vintageFilter, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusUpdate = async (recordId: string, newStatus: SRECStatus) => {
    try {
      await srecDataService.updateSRECStatus(recordId, newStatus);
      await loadRecords();
      alert(`SREC status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update SREC status:', err);
      alert('Failed to update SREC status. Please try again.');
    }
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map(r => r.id));
    }
  };

  const handleViewDetails = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setViewModalOpen(true);
    }
  };

  const handleEditRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setEditModalOpen(true);
    }
  };

  const handleExportRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setExportModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setExportModalOpen(false);
    setSelectedRecord(null);
  };

  const handleSaveRecord = async () => {
    await loadRecords();
  };

  const handleOpenCreate = () => setCreateModalOpen(true);
  const handleCloseCreate = () => setCreateModalOpen(false);
  const handleCreated = async () => {
    // After creating, go to first page to see the newest record
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    await loadRecords();
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

  const getStatusClass = (status: SRECStatus): string => {
    switch (status) {
      case 'Generated': return 'status-generated';
      case 'Verified': return 'status-verified';
      case 'Listed': return 'status-listed';
      case 'Sold': return 'status-sold';
      case 'Settled': return 'status-settled';
      case 'Retired': return 'status-retired';
      case 'Expired': return 'status-expired';
      default: return 'status-default';
    }
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

  if (loading) {
    return (
      <div className="srec-loading">
        <div className="srec-loading-spinner"></div>
        <p>Loading SREC records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="srec-error">
        <p>{error}</p>
        <button onClick={loadRecords} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="srec-records">
      <div className="records-header">
        <h2 className="records-title">SREC Records Management</h2>
        <div className="records-actions">
          <button className="create-record-btn" onClick={handleOpenCreate}>
            Create New SREC +
          </button>
          {selectedRecords.length > 0 && (
            <button className="bulk-action-btn">
              Bulk Actions ({selectedRecords.length})
            </button>
          )}
        </div>
      </div>

      <div className="records-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by Certificate ID, Facility, Location..."
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
            onChange={(e) => setStatusFilter(e.target.value as SRECStatus | '')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Generated">Generated</option>
            <option value="Verified">Verified</option>
            <option value="Listed">Listed</option>
            <option value="Sold">Sold</option>
            <option value="Settled">Settled</option>
            <option value="Retired">Retired</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All States</option>
            <option value="NJ">New Jersey</option>
            <option value="PA">Pennsylvania</option>
            <option value="MD">Maryland</option>
            <option value="DC">Washington DC</option>
            <option value="DE">Delaware</option>
            <option value="OH">Ohio</option>
            <option value="MA">Massachusetts</option>
            <option value="CA">California</option>
            <option value="AZ">Arizona</option>
            <option value="NV">Nevada</option>
          </select>

          <select
            value={vintageFilter}
            onChange={(e) => setVintageFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Vintages</option>
            <option value="2024-Q1">2024-Q1</option>
            <option value="2024-Q2">2024-Q2</option>
            <option value="2024-Q3">2024-Q3</option>
            <option value="2024-Q4">2024-Q4</option>
            <option value="2023-Q4">2023-Q4</option>
          </select>
        </div>
      </div>

      <div className="records-summary">
        <div className="summary-stats">
          <span className="stat-item">
            <strong>{pagination.totalRecords}</strong> Total Records
          </span>
          <span className="stat-item">
            <strong>{records.filter(r => r.status === 'Generated').length}</strong> Generated
          </span>
          <span className="stat-item">
            <strong>{records.filter(r => r.status === 'Verified').length}</strong> Verified
          </span>
          <span className="stat-item">
            <strong>{records.filter(r => ['Sold', 'Settled'].includes(r.status)).length}</strong> Sold
          </span>
        </div>
      </div>

      <div className="records-table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedRecords.length === records.length && records.length > 0}
                  onChange={handleSelectAll}
                  className="table-checkbox"
                />
              </th>
              <th>Certificate ID</th>
              <th>Facility</th>
              <th>State</th>
              <th>Vintage</th>
              <th>Generation (MWh)</th>
              <th>Market Price</th>
              <th>Status</th>
              <th>Generation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className={selectedRecords.includes(record.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record.id)}
                    onChange={() => handleSelectRecord(record.id)}
                    className="table-checkbox"
                  />
                </td>
                <td className="certificate-id">
                  <div className="certificate-info">
                    <div className="certificate-primary">{record.certificateId}</div>
                    <div className="certificate-secondary">ID: {record.id}</div>
                  </div>
                </td>
                <td>
                  <div className="facility-info">
                    <div className="facility-name">{record.facilityName}</div>
                    <div className="facility-location">{record.facilityLocation}</div>
                  </div>
                </td>
                <td>
                  <span className="state-badge">{record.state}</span>
                </td>
                <td className="vintage">{record.vintage}</td>
                <td className="generation-amount">
                  {record.mwhGenerated.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </td>
                <td className="market-price">
                  {formatCurrency(record.marketPrice)}
                  {record.salePrice && (
                    <div className="sale-price">
                      Sold: {formatCurrency(record.salePrice)}
                    </div>
                  )}
                </td>
                <td>
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusUpdate(record.id, e.target.value as SRECStatus)}
                    className={`status-select ${getStatusClass(record.status)}`}
                  >
                    <option value="Generated">Generated</option>
                    <option value="Verified">Verified</option>
                    <option value="Listed">Listed</option>
                    <option value="Sold">Sold</option>
                    <option value="Settled">Settled</option>
                    <option value="Retired">Retired</option>
                    <option value="Expired">Expired</option>
                  </select>
                </td>
                <td className="generation-date">
                  {formatDate(record.generationDate)}
                </td>
                <td className="actions-column">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn" 
                      title="View Details"
                      onClick={() => handleViewDetails(record.id)}
                    >
                      View
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      title="Edit Record"
                      onClick={() => handleEditRecord(record.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn download-btn" 
                      title="Export Certificate"
                      onClick={() => handleExportRecord(record.id)}
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

      {records.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No SREC records found matching your filters.</p>
          <button className="create-record-btn" onClick={handleOpenCreate}>Create Your First SREC</button>
        </div>
      )}

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of {pagination.totalRecords} records
        </div>
        <div className="pagination-controls">
          {renderPagination()}
        </div>
      </div>

      {/* Modals */}
      <ViewDetailsModal
        isOpen={viewModalOpen}
        record={selectedRecord}
        onClose={handleCloseModals}
      />
      <EditRecordModal
        isOpen={editModalOpen}
        record={selectedRecord}
        onClose={handleCloseModals}
        onSave={handleSaveRecord}
      />
      <ExportModal
        isOpen={exportModalOpen}
        record={selectedRecord}
        onClose={handleCloseModals}
      />

      {/* Create Modal */}
      <CreateSRECModal
        isOpen={createModalOpen}
        onClose={handleCloseCreate}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default SRECRecords;