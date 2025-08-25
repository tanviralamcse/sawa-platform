import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfileRatings from '../components/UserProfileRatings';
import { buildApiUrl } from '../config/api';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    completed_requests: 0,
    total_applications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(buildApiUrl('dashboard/'), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setStats(data || {
        total_requests: 0,
        pending_requests: 0,
        completed_requests: 0,
        total_applications: 0
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, isAuthenticated, user]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, isAuthenticated, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p className="mt-3 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p className="mt-3 text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-section">Welcome, {user?.first_name || user?.username || 'User'}!</h1>
          <div className="user-role">Role: {user?.role || 'Member'}</div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/requests/new')}>New Request</button>
          <button className="btn btn-outline" onClick={() => navigate('/settings')}>Account Settings</button>
        </div>
      </div>
      {/* Error */}
      {error && <div className="error-message">{error}</div>}
      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card blue">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.total_requests}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending_requests}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed_requests}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.total_applications}</h3>
            <p>Applications</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => navigate('/requests/new')}>➕ Post New Request</button>
            <button className="action-btn secondary" onClick={() => navigate('/applications')}>👥 Browse Applications</button>
            <button className="action-btn tertiary" onClick={() => navigate('/messages')}>💬 View Messages</button>
            <button className="action-btn secondary" onClick={() => navigate('/requests')}>📋 My Requests</button>
            <button className="action-btn tertiary" onClick={() => navigate('/reviews')}>⭐ Reviews & Ratings</button>
          </div>
        </div>
        <div className="profile-reminder">
          <h3>Your Profile</h3>
          <div className="user-avatar">
            <div className="avatar-circle">{(user?.first_name || user?.username || 'U')[0]}</div>
          </div>
          <div className="user-info">
            <h4>{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'User'}</h4>
            <div className="user-role">{user?.role || 'Member'}</div>
            <div className="sub-text">{user?.email || 'No email'}</div>
          </div>
          <div className="mt-2">
            <UserProfileRatings average={user.average_rating || 0} count={user.review_count || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
