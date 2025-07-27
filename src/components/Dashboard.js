import React from 'react';
import './Auth.css';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome {user.name}</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info">
          <h3>User Information</h3>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> Active</p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Quick Actions</h3>
          <p>This is where you can add more features and functionality for your logged-in users.</p>
          <ul>
            <li>View profile settings</li>
            <li>Update account information</li>
            <li>Access user-specific content</li>
            <li>Manage preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
