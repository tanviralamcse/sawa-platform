import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ServiceRequestWizard from '../components/ServiceRequestWizard';
import ServiceRequestModal from '../components/ServiceRequestModal';
import ApplicationModal from '../components/ApplicationModal';
import { buildApiUrl } from '../config/api';

export default function Requests({ showNewForm = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(showNewForm || location.pathname === '/requests/new');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationRequest, setApplicationRequest] = useState(null);
  const modalOpeningRef = useRef(false);

  const fetchRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = buildApiUrl('service-requests/');
      
      if (user?.role === 'buyer' && filter !== 'all') {
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
        setRequests(data.results || data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, user]);

  useEffect(() => {
    fetchRequests();
  }, [filter, user, fetchRequests]);

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl(`service-requests/${requestId}/`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRequests(requests.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleApplyToRequest = (request) => {
    setApplicationRequest(request);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl('applications/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        fetchRequests(); // Refresh to update status
        setShowApplicationModal(false);
        setApplicationRequest(null);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to submit application');
    }
  };

  const handleViewDetails = (request) => {
    modalOpeningRef.current = true;
    setSelectedRequest(request);
    setShowModal(true);
    
    // Clear the flag after a short delay
    setTimeout(() => {
      modalOpeningRef.current = false;
    }, 200);
  };

  const handleCloseModal = () => {
    // Don't close if we're in the middle of opening
    if (modalOpeningRef.current) {
      return;
    }
    setShowModal(false);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.issue_description || request.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.machine_type || request.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RequestCard = ({ request }) => (
    <div className="request-card">
      <div className="request-header">
        <h3>{request.title}</h3>
        <span className={`status-badge ${request.status}`}>
          {request.status}
        </span>
      </div>
      
      <div className="request-meta">
        <span className="category">{request.machine_type || request.category}</span>
        <span className="budget">€{request.budget_eur || request.budget}</span>
        <span className="location">{request.customer_address || request.location}</span>
      </div>
      
      <p className="request-description">
        {request.issue_description || request.description}
      </p>
      
      <div className="request-details">
        <div className="detail-item">
          <strong>Preferred Date:</strong> {new Date(request.preferred_date || request.deadline).toLocaleDateString()}
        </div>
        <div className="detail-item">
          <strong>Posted:</strong> {new Date(request.created_at).toLocaleDateString()}
        </div>
        {request.applications_count && (
          <div className="detail-item">
            <strong>Applications:</strong> {request.applications_count}
          </div>
        )}
      </div>

      <div className="request-actions">
        <button 
          className="btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleViewDetails(request);
          }}
        >
          View Details
        </button>
        
        {user?.role === 'buyer' && request.buyer === user.id ? (
          <>
            <button 
              className="btn-secondary"
              onClick={() => {/* Navigate to edit */}}
            >
              Edit
            </button>
            <button 
              className="btn-danger"
              onClick={() => handleDeleteRequest(request.id)}
            >
              Delete
            </button>
          </>
        ) : user?.role === 'provider' ? (
          <button 
            className="btn-primary"
            onClick={() => handleApplyToRequest(request)}
            disabled={request.has_applied}
          >
            {request.has_applied ? 'Applied' : 'Apply Now'}
          </button>
        ) : null}
      </div>
    </div>
  );

  if (showNewRequest) {
    return (
      <div className="requests-page">
        <div className="page-header">
          <button 
            className="btn-back"
            onClick={() => {
              setShowNewRequest(false);
              navigate('/requests');
            }}
          >
            ← Back to Requests
          </button>
          <h1>Create New Request</h1>
        </div>
        <ServiceRequestWizard 
          onComplete={() => {
            setShowNewRequest(false);
            navigate('/requests');
            fetchRequests();
          }}
          onCancel={() => {
            setShowNewRequest(false);
            navigate('/requests');
          }}
        />
      </div>
    );
  }

  return (
    <div className="requests-page">
      <div className="page-header">
        <h1>
          {user?.role === 'buyer' ? 'My Service Requests' : 'Available Requests'}
        </h1>
        {user?.role === 'buyer' && (
          <button 
            className="btn-primary"
            onClick={() => navigate('/requests/new')}
          >
            + New Request
          </button>
        )}
      </div>

      <div className="page-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'open' ? 'active' : ''}`}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button 
            className={`filter-tab ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="requests-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="requests-grid">
            {filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No requests found</h3>
            <p>
              {user?.role === 'buyer' 
                ? "You haven't posted any requests yet. Create your first one!"
                : "No requests match your criteria. Try adjusting your filters."
              }
            </p>
            {user?.role === 'buyer' && (
              <button 
                className="btn-primary"
                onClick={() => setShowNewRequest(true)}
              >
                Create First Request
              </button>
            )}
          </div>
        )}
      </div>

      {/* Service Request Details Modal */}
      <ServiceRequestModal 
        request={selectedRequest}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      {/* Application Modal */}
      <ApplicationModal 
        request={applicationRequest}
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setApplicationRequest(null);
        }}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
}
