import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { buildApiUrl } from '../config/api';
import ApplicationDetailsView from '../components/ApplicationDetailsView';
import InterviewChat from '../components/InterviewChat';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatThreadId, setChatThreadId] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = buildApiUrl('applications/');

      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.results || data);
      } else {
        console.error('❌ API Error:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchApplications();
  }, [filter, fetchApplications]);

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl(`applications/${applicationId}/${action}/`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchApplications(); // Refresh applications
        alert(`Application ${action}ed successfully!`);
      } else {
        const error = await response.json();
        alert(error.detail || `Failed to ${action} application`);
      }
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
      alert(`Failed to ${action} application`);
    }
  };

  const handleOpenChat = (threadId) => {
    setChatThreadId(threadId);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatThreadId(null);
  };

  const ApplicationCard = ({ application }) => (
    <div className="application-card">
      <div className="application-header">
        <div className="application-title">
          <h3>{application.service_request_title || application.service_request?.title}</h3>
          <span className={`status-badge ${application.status}`}>
            {application.status}
          </span>
        </div>
        <div className="application-meta">
          <span className="date">
            Applied: {new Date(application.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="application-content">
        {user?.role === 'buyer' ? (
          <div className="applicant-info">
            <div className="applicant-profile">
              <h4>{application.provider_name || application.provider?.first_name} {application.provider?.last_name}</h4>
              <div className="applicant-rating">
                ⭐ {application.provider_rating || '4.5'} ({application.provider_reviews || 12} reviews)
              </div>
            </div>
            <div className="application-details">
              <div className="cover-letter">
                <h5>Cover Letter:</h5>
                <p>{application.cover_letter}</p>
              </div>
              {application.proposed_budget && (
                <div className="proposed-budget">
                  <strong>Proposed Budget: ${application.proposed_budget}</strong>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="request-info">
            <div className="request-details">
              <p><strong>Budget:</strong> ${application.service_request?.budget}</p>
              <p><strong>Deadline:</strong> {new Date(application.service_request?.deadline).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {application.service_request?.location}</p>
            </div>
            <div className="my-cover-letter">
              <h5>My Cover Letter:</h5>
              <p>{application.cover_letter}</p>
            </div>
          </div>
        )}
      </div>

      <div className="application-actions">
        {user?.role === 'buyer' && application.status === 'pending' ? (
          <>
            {application.chat_thread_id && (
              <button 
                className="btn-success"
                onClick={() => handleOpenChat(application.chat_thread_id)}
              >
                💬 Interview
              </button>
            )}
            <button 
              className="btn-primary"
              onClick={() => handleApplicationAction(application.id, 'accept')}
            >
              Accept
            </button>
            <button 
              className="btn-danger"
              onClick={() => handleApplicationAction(application.id, 'reject')}
            >
              Reject
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setSelectedApplication(application)}
            >
              View Details
            </button>
          </>
        ) : user?.role === 'provider' && application.status === 'pending' ? (
          <>
            {application.chat_thread_id && (
              <button 
                className="btn-success"
                onClick={() => handleOpenChat(application.chat_thread_id)}
              >
                💬 Chat
              </button>
            )}
            <button 
              className="btn-secondary"
              onClick={() => setSelectedApplication(application)}
            >
              View Application
            </button>
          </>
        ) : (
          <>
            {application.chat_thread_id && (
              <button 
                className="btn-outline"
                onClick={() => handleOpenChat(application.chat_thread_id)}
              >
                💬 View Chat
              </button>
            )}
            <span className="status-text">
              {application.status === 'accepted' && '✅ Accepted'}
              {application.status === 'rejected' && '❌ Rejected'}
              {application.status === 'withdrawn' && '🔄 Withdrawn'}
            </span>
          </>
        )}
      </div>
    </div>
  );

  if (selectedApplication) {
    return (
      <div className="applications-page">
        <div className="page-header">
          <button 
            className="btn-back"
            onClick={() => setSelectedApplication(null)}
          >
            ← Back to Applications
          </button>
          <h1>Application Details</h1>
        </div>
        <ApplicationDetailsView 
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onOpenChat={handleOpenChat}
        />
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>
          {user?.role === 'buyer' ? 'Applications Received' : 'My Applications'}
        </h1>
        <div className="header-stats">
          <span>Total: {applications.length}</span>
        </div>
      </div>

      <div className="page-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="applications-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="applications-grid">
            {applications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✉️</div>
            <h3>No applications found</h3>
            <p>
              {user?.role === 'buyer' 
                ? "No applications have been submitted for your requests yet."
                : "You haven't submitted any applications yet. Browse available requests to get started!"
              }
            </p>
          </div>
        )}
      </div>

      {/* Interview Chat Modal */}
      <InterviewChat 
        chatThreadId={chatThreadId}
        isOpen={showChat}
        onClose={handleCloseChat}
        currentUser={user}
      />
    </div>
  );
}
