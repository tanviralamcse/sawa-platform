import React from 'react';

export default function ApplicationDetailsView({ application, onClose, onOpenChat }) {
  if (!application) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid #f3f4f6'
        }}
      >
        <div>
          <h2 
            style={{
              fontSize: '1.875rem',
              fontWeight: '800',
              color: '#1e40af',
              margin: '0 0 8px 0'
            }}
          >
            Application Details
          </h2>
          <div>
            <span 
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151'
              }}
            >
              {application.request_title || application.request_data?.title || 'Service Request'}
            </span>
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: getStatusColor(application.status) + '20',
                color: getStatusColor(application.status)
              }}
            >
              {getStatusIcon(application.status)} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Submitted on {formatDate(application.created_at)}
          </p>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            border: '1px solid #d1d5db',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '18px',
            width: '44px',
            height: '44px'
          }}
        >
          ×
        </button>
      </div>

      {/* Service Request Info */}
      {(application.request_data || application.request) && (
        <div 
          style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}
        >
          <h3 
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#374151',
              margin: '0 0 16px 0'
            }}
          >
            📋 Service Request Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <strong style={{ color: '#6b7280' }}>Budget:</strong>
              <p style={{ margin: '4px 0 0 0', fontWeight: '600' }}>
                {formatCurrency(application.request_data?.budget_eur || application.request?.budget_eur)}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Preferred Date:</strong>
              <p style={{ margin: '4px 0 0 0', fontWeight: '600' }}>
                {formatDate(application.request_data?.preferred_date || application.request?.preferred_date)}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Location:</strong>
              <p style={{ margin: '4px 0 0 0', fontWeight: '600' }}>
                {application.request_data?.customer_address || application.request?.customer_address}
              </p>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Machine Type:</strong>
              <p style={{ margin: '4px 0 0 0', fontWeight: '600' }}>
                {application.request_data?.machine_type || application.request?.machine_type}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Your Application */}
      <div 
        style={{
          backgroundColor: '#fefefe',
          border: '2px solid #e5e7eb',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}
      >
        <h3 
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#374151',
            margin: '0 0 20px 0'
          }}
        >
          📝 Your Application
        </h3>

        {/* Pitch */}
        <div style={{ marginBottom: '20px' }}>
          <h4 
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}
          >
            Your Pitch:
          </h4>
          <div 
            style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              lineHeight: '1.6'
            }}
          >
            {application.pitch}
          </div>
        </div>

        {/* Pricing */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h4 
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#6b7280',
                margin: '0 0 8px 0'
              }}
            >
              Price Adjustment:
            </h4>
            <div 
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: application.price_adjustment_eur > 0 ? '#dc2626' : 
                       application.price_adjustment_eur < 0 ? '#16a34a' : '#6b7280'
              }}
            >
              {application.price_adjustment_eur 
                ? (application.price_adjustment_eur > 0 ? '+' : '') + formatCurrency(application.price_adjustment_eur)
                : 'No adjustment'
              }
            </div>
          </div>

          <div>
            <h4 
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#6b7280',
                margin: '0 0 8px 0'
              }}
            >
              Final Price:
            </h4>
            <div 
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#1e40af'
              }}
            >
              {(application.request_data || application.request) && formatCurrency(
                parseFloat(application.request_data?.budget_eur || application.request?.budget_eur || 0) + 
                parseFloat(application.price_adjustment_eur || 0)
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div style={{ marginBottom: '20px' }}>
          <h4 
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}
          >
            Availability:
          </h4>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem'
            }}
          >
            {application.available_on_preferred_date ? (
              <>
                <span style={{ color: '#16a34a' }}>✅</span>
                Available on preferred date ({(application.request_data || application.request) && formatDate(application.request_data?.preferred_date || application.request?.preferred_date)})
              </>
            ) : (
              <>
                <span style={{ color: '#f59e0b' }}>⚠️</span>
                Not available on preferred date
                {application.suggested_date && (
                  <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                    → Suggested: {formatDate(application.suggested_date)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Comments */}
        {application.comments && (
          <div>
            <h4 
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#6b7280',
                margin: '0 0 8px 0'
              }}
            >
              Additional Comments:
            </h4>
            <div 
              style={{
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                lineHeight: '1.6'
              }}
            >
              {application.comments}
            </div>
          </div>
        )}
      </div>

      {/* Status Information */}
      <div 
        style={{
          backgroundColor: getStatusColor(application.status) + '10',
          border: `2px solid ${getStatusColor(application.status)}30`,
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: getStatusColor(application.status),
            marginBottom: '8px'
          }}
        >
          {getStatusIcon(application.status)} Application Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </div>
        <p style={{ color: '#6b7280', margin: 0 }}>
          {application.status === 'pending' && 'Your application is under review. You will be notified when the buyer makes a decision.'}
          {application.status === 'accepted' && 'Congratulations! Your application has been accepted. Check your messages for next steps.'}
          {application.status === 'rejected' && 'Unfortunately, your application was not selected for this project.'}
        </p>
      </div>

      {/* Interview Chat Button */}
      {application.chat_thread_id && (
        <div 
          style={{
            marginTop: '24px',
            textAlign: 'center'
          }}
        >
          <button 
            onClick={() => onOpenChat && onOpenChat(application.chat_thread_id)}
            style={{
              padding: '16px 32px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
            }}
          >
            💬 Start Interview Chat
          </button>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '8px 0 0 0' }}>
            Discuss project details and conduct interview before making a decision
          </p>
        </div>
      )}
    </div>
  );
}
