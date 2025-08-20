import React, { useState } from 'react';
import './SRECHome.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';

const SRECHome: React.FC = () => {
  const [notes] = useState([
    { name: 'Solar Project 1', uploadDate: '10/12/2024' },
    { name: 'Solar Project 2', uploadDate: '10/12/2024' }
  ]);

  const [srecRecords] = useState([
    { name: 'Record One', id: 1 }
  ]);

  return (
    <div className="srec-home-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="srec-header">
        <h1 className="srec-title">SREC Home</h1>
      </div>

      <div className="srec-grid">
        {/* Job Forms Card */}
        <div className="srec-card">
          <h2 className="card-header">Job Forms</h2>
          <div className="card-content">
            <p className="job-forms-text">
              You have <strong>5</strong> Job Forms. <span className="view-link">View.</span>
            </p>
          </div>
        </div>

        {/* Notes Card */}
        <div className="srec-card">
          <h2 className="card-header">Notes</h2>
          <div className="card-content">
            <div className="notes-header">
              <span className="notes-label">Note Name</span>
              <span className="notes-date-label">Upload Date</span>
            </div>
            <div className="notes-list">
              {notes.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-name">{note.name}</span>
                  <span className="note-date">{note.uploadDate}</span>
                </div>
              ))}
            </div>
            <button className="create-new-btn">
              <span>Create New</span>
              <span className="plus-icon">+</span>
            </button>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="srec-card">
          <h2 className="card-header">Tasks</h2>
          <div className="card-content">
            <div className="task-item">
              <span className="task-name">Upload Utility Bill</span>
              <button className="view-task-btn">View</button>
            </div>
          </div>
        </div>

        {/* My SREC Records Card */}
        <div className="srec-card">
          <h2 className="card-header">My SREC Records</h2>
          <div className="card-content">
            <div className="record-item">
              <div className="record-info">
                <span className="record-icon">📄</span>
                <span className="record-name">Record One</span>
              </div>
              <div className="record-actions">
                <button className="download-btn" title="Download">↓</button>
                <button className="delete-btn" title="Delete">🗑</button>
              </div>
            </div>
            <button className="view-create-btn">View & Create +</button>
          </div>
        </div>

        {/* Bulk Actions Card */}
        <div className="srec-card">
          <h2 className="card-header">Bulk Actions</h2>
          <div className="card-content">
            <div className="bulk-actions-list">
              <div className="bulk-action-item">
                <span className="bulk-action-link">Bulk Invoice Upload</span>
              </div>
              <div className="bulk-action-item">
                <span className="bulk-action-link">Past Invoices</span>
              </div>
              <div className="bulk-action-item">
                <span className="bulk-action-link">Bulk Record Upload</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRECHome;