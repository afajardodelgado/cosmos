import React, { useState } from 'react';
import './Fulfillment.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

const Fulfillment: React.FC = () => {
  const [tasks] = useState([
    { name: 'Upload Bill', assignedTo: 'Chris Samuel', dueDate: 'Due Date' },
    { name: 'Upload Bill', assignedTo: 'Chris Samuel', dueDate: 'Due Date' },
    { name: 'Upload Bill', assignedTo: 'Chris Samuel', dueDate: 'Due Date' }
  ]);

  const [upcomingSiteVisits] = useState([
    { name: 'Timothy Johnson', address: '235 Cupcake Street, Bordentown, CA 02345' },
    { name: 'Timothy Jordan', address: '235 Cupcake Street, Bordentown, CA 02345' },
    { name: 'Timothy Jordan', address: '235 Cupcake Street, Bordentown, CA 02345' }
  ]);

  const [recentlyVisitedSites] = useState([
    { name: 'Timothy Johnson', address: '235 Cupcake Street, Bordentown, CA 02345' },
    { name: 'Timothy Jordan', address: '235 Cupcake Street, Bordentown, CA 02345' },
    { name: 'Timothy Jordan', address: '235 Cupcake Street, Bordentown, CA 02345' }
  ]);

  return (
    <div className="fulfillment-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="fulfillment-content">
        {/* Partner Info Section */}
        <div className="partner-info-section">
          <div className="partner-info">
            <span className="star-icon">⭐</span>
            <div>
              <div className="partner-name">Partner Viewing Name</div>
              <div className="partner-subtitle">Any other info you want</div>
            </div>
          </div>
          <button className="refresh-btn"></button>
        </div>

        <div className="fulfillment-grid">
          {/* Left Column - Stats */}
          <div className="stats-column">
            {/* Project Stats Row 1 */}
            <div className="stats-row">
              <div className="stat-card">
                <h3>Total Open Projects</h3>
                <div className="stat-value">86%</div>
              </div>
              <div className="stat-card">
                <h3>Completed Projects (2024)</h3>
                <div className="stat-value">86%</div>
              </div>
              <div className="stat-card">
                <h3>Upcoming Projects</h3>
                <div className="stat-value"></div>
              </div>
            </div>

            {/* Project Stats Row 2 */}
            <div className="stats-row">
              <div className="stat-card">
                <h3>Lead Conversion (%)</h3>
                <div className="stat-value">86%</div>
              </div>
              <div className="stat-card">
                <h3>Open Pipeline</h3>
                <div className="stat-value">86%</div>
              </div>
              <div className="stat-card">
                <h3>YTD Sales Goals</h3>
                <div className="stat-value"></div>
              </div>
            </div>

            {/* Job Approvals */}
            <div className="job-approvals">
              <h3>Job Approvals</h3>
              <div className="approval-item">
                <div className="approval-status">
                  <span className="status-number">1</span>
                  <span>Job Waiting</span>
                </div>
                <button className="review-btn">Review &gt;</button>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks and Site Visits */}
          <div className="tasks-column">
            {/* Tasks Section */}
            <div className="tasks-section">
              <div className="section-header">
                <h3>Tasks</h3>
                <button className="new-task-btn">New Task</button>
              </div>
              <div className="tasks-list">
                {tasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-info">
                      <div className="task-name">{task.name}</div>
                      <div className="task-assigned">Assigned To: {task.assignedTo}</div>
                    </div>
                    <div className="task-due">{task.dueDate}</div>
                  </div>
                ))}
              </div>
              <div className="more-link">More</div>
            </div>

            {/* Upcoming Site Visits */}
            <div className="site-visits-section">
              <h3>Upcoming Site Visits</h3>
              <div className="visits-list">
                {upcomingSiteVisits.map((visit, index) => (
                  <div key={index} className="visit-item">
                    <div className="visit-name">{visit.name}</div>
                    <div className="visit-address">{visit.address}</div>
                  </div>
                ))}
              </div>
              <div className="more-link">More</div>
            </div>

            {/* Recently Visited Sites */}
            <div className="site-visits-section">
              <h3>Recently Visited Sites</h3>
              <div className="visits-list">
                {recentlyVisitedSites.map((visit, index) => (
                  <div key={index} className="visit-item">
                    <div className="visit-name">{visit.name}</div>
                    <div className="visit-address">{visit.address}</div>
                  </div>
                ))}
              </div>
              <div className="more-link">More</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;