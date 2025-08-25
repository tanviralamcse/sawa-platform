import React, { useEffect } from 'react';

export default function ServiceRequestModal({ request, isOpen, onClose }) {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen || !request) return null;

  console.log('Modal rendering with isOpen:', isOpen, 'request:', request?.id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#28a745';
      case 'in_progress': return '#ffc107';
      case 'completed': return '#007bff';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className={`modal-backdrop ${isOpen ? 'modal-backdrop-open' : ''}`}
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      />
      
      {/* Modal Container */}
      <div 
        className={`modal-popup-container ${isOpen ? 'modal-popup-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '20px',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
        <div 
          className="modal-popup-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '950px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(40px)',
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Modal Header */}
          <div 
            className="modal-popup-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '32px 32px 24px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              position: 'relative'
            }}
          >
            <div 
              className="modal-title-section"
              style={{
                flex: 1,
                marginRight: '20px'
              }}
            >
              <h2 
                className="modal-title"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#1e40af',
                  margin: '0 0 12px 0',
                  lineHeight: '1.2'
                }}
              >
                {request.title}
              </h2>
              <div 
                className="status-badge-popup" 
                style={{ 
                  backgroundColor: getStatusColor(request.status),
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  color: 'white',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                {request.status?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <button 
              className="modal-close-button" 
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: '1px solid #d1d5db',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div 
            className="modal-popup-body"
            style={{
              flex: 1,
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
            }}
          >
            {/* Quick Info Cards */}
            <div 
              className="quick-info-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
                padding: '32px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}
            >
              <div 
                className="info-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="info-card-icon"
                  style={{
                    fontSize: '1.75rem',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  💰
                </div>
                <div 
                  className="info-card-content"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span 
                    className="info-card-label"
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Budget
                  </span>
                  <span 
                    className="info-card-value"
                    style={{
                      fontWeight: '700',
                      color: '#1f2937',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {formatCurrency(request.budget_eur)}
                  </span>
                </div>
              </div>
              <div 
                className="info-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="info-card-icon"
                  style={{
                    fontSize: '1.75rem',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  📅
                </div>
                <div 
                  className="info-card-content"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span 
                    className="info-card-label"
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Preferred Date
                  </span>
                  <span 
                    className="info-card-value"
                    style={{
                      fontWeight: '700',
                      color: '#1f2937',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {formatDate(request.preferred_date)}
                  </span>
                </div>
              </div>
              <div 
                className="info-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="info-card-icon"
                  style={{
                    fontSize: '1.75rem',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  ⚡
                </div>
                <div 
                  className="info-card-content"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span 
                    className="info-card-label"
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Urgency
                  </span>
                  <span 
                    className="info-card-value"
                    style={{
                      fontWeight: '700',
                      color: '#1f2937',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {request.urgency}
                  </span>
                </div>
              </div>
              <div 
                className="info-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="info-card-icon"
                  style={{
                    fontSize: '1.75rem',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  💳
                </div>
                <div 
                  className="info-card-content"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span 
                    className="info-card-label"
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Payment
                  </span>
                  <span 
                    className="info-card-value"
                    style={{
                      fontWeight: '700',
                      color: '#1f2937',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {request.payment_method?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabbed Content */}
            <div 
              className="modal-tabs"
              style={{
                padding: '32px'
              }}
            >
              <div className="tab-content">
                {/* Machine Information Section */}
                <div 
                  className="content-section"
                  style={{
                    padding: '24px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h3 
                    className="section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    <span 
                      className="section-icon"
                      style={{
                        fontSize: '1.4rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      🔧
                    </span>
                    Machine Information
                  </h3>
                  <div 
                    className="section-content"
                    style={{
                      display: 'block'
                    }}
                  >
                    <table 
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Machine Type
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.machine_type}
                          </td>
                        </tr>
                        <tr>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Serial Number
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.serial_number}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Information Section */}
                <div 
                  className="content-section"
                  style={{
                    padding: '24px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h3 
                    className="section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    <span 
                      className="section-icon"
                      style={{
                        fontSize: '1.4rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      🏢
                    </span>
                    Customer Information
                  </h3>
                  <div 
                    className="section-content"
                    style={{
                      display: 'block'
                    }}
                  >
                    <table 
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Company
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.customer_company_name}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Address
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.customer_address}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Contact Person
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.contact_person_name}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Position
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            {request.contact_person_position}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Email
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            <a 
                              href={`mailto:${request.contact_email}`} 
                              style={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontWeight: '600'
                              }}
                            >
                              {request.contact_email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Phone
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            <a 
                              href={`tel:${request.contact_phone}`} 
                              style={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontWeight: '600'
                              }}
                            >
                              {request.contact_phone}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Service Details Section */}
                <div 
                  className="content-section"
                  style={{
                    padding: '24px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h3 
                    className="section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    <span 
                      className="section-icon"
                      style={{
                        fontSize: '1.4rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      ⚙️
                    </span>
                    Service Details
                  </h3>
                  <div 
                    className="section-content"
                    style={{
                      display: 'block'
                    }}
                  >
                    <table 
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        marginBottom: '16px'
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Service Types
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            <div 
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                              }}
                            >
                              {request.service_types?.map((type, index) => (
                                <span 
                                  key={index} 
                                  style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    border: '1px solid #bfdbfe'
                                  }}
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              verticalAlign: 'top'
                            }}
                          >
                            Issue Description
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem',
                              lineHeight: '1.6'
                            }}
                          >
                            <div 
                              style={{
                                background: '#f8fafc',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontStyle: 'italic'
                              }}
                            >
                              {request.issue_description}
                            </div>
                          </td>
                        </tr>
                        {request.alternative_dates?.length > 0 && (
                          <tr>
                            <td 
                              style={{
                                padding: '16px 20px',
                                fontWeight: '600',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                width: '35%',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              Alternative Dates
                            </td>
                            <td 
                              style={{
                                padding: '16px 20px',
                                color: '#1f2937',
                                fontWeight: '500',
                                fontSize: '1rem'
                              }}
                            >
                              <div 
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '8px'
                                }}
                              >
                                {request.alternative_dates.map((date, index) => (
                                  <span 
                                    key={index} 
                                    style={{
                                      display: 'inline-block',
                                      padding: '6px 12px',
                                      borderRadius: '16px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      backgroundColor: '#fef3c7',
                                      color: '#92400e',
                                      border: '1px solid #fde68a'
                                    }}
                                  >
                                    {formatDate(date)}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Requirements Section */}
                <div 
                  className="content-section"
                  style={{
                    padding: '24px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h3 
                    className="section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    <span 
                      className="section-icon"
                      style={{
                        fontSize: '1.4rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      🛠️
                    </span>
                    Technical Requirements
                  </h3>
                  <div 
                    className="section-content"
                    style={{
                      display: 'block'
                    }}
                  >
                    <table 
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <tbody>
                        {request.technician_requirements?.length > 0 && (
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td 
                              style={{
                                padding: '16px 20px',
                                fontWeight: '600',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                width: '35%',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              Technician Requirements
                            </td>
                            <td 
                              style={{
                                padding: '16px 20px',
                                color: '#1f2937',
                                fontWeight: '500',
                                fontSize: '1rem'
                              }}
                            >
                              <div 
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '8px'
                                }}
                              >
                                {request.technician_requirements.map((req, index) => (
                                  <span 
                                    key={index} 
                                    style={{
                                      display: 'inline-block',
                                      padding: '6px 12px',
                                      borderRadius: '16px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      backgroundColor: '#f3e8ff',
                                      color: '#7c3aed',
                                      border: '1px solid #e9d5ff'
                                    }}
                                  >
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                        {request.safety_requirements?.length > 0 && (
                          <tr>
                            <td 
                              style={{
                                padding: '16px 20px',
                                fontWeight: '600',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                width: '35%',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              Safety Requirements
                            </td>
                            <td 
                              style={{
                                padding: '16px 20px',
                                color: '#1f2937',
                                fontWeight: '500',
                                fontSize: '1rem'
                              }}
                            >
                              <div 
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '8px'
                                }}
                              >
                                {request.safety_requirements.map((req, index) => (
                                  <span 
                                    key={index} 
                                    style={{
                                      display: 'inline-block',
                                      padding: '6px 12px',
                                      borderRadius: '16px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      backgroundColor: '#fef2f2',
                                      color: '#dc2626',
                                      border: '1px solid #fecaca'
                                    }}
                                  >
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Maintenance History Section */}
                <div 
                  className="content-section"
                  style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h3 
                    className="section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    <span 
                      className="section-icon"
                      style={{
                        fontSize: '1.4rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      📋
                    </span>
                    Maintenance History
                  </h3>
                  <div 
                    className="section-content"
                    style={{
                      display: 'block'
                    }}
                  >
                    <table 
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: request.has_maintenance_history && request.history_notes ? '1px solid #f3f4f6' : 'none' }}>
                          <td 
                            style={{
                              padding: '16px 20px',
                              fontWeight: '600',
                              color: '#6b7280',
                              backgroundColor: '#f9fafb',
                              width: '35%',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Has Maintenance History
                          </td>
                          <td 
                            style={{
                              padding: '16px 20px',
                              color: '#1f2937',
                              fontWeight: '500',
                              fontSize: '1rem'
                            }}
                          >
                            <span 
                              style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                backgroundColor: request.has_maintenance_history ? '#dcfce7' : '#fef2f2',
                                color: request.has_maintenance_history ? '#166534' : '#dc2626',
                                border: `1px solid ${request.has_maintenance_history ? '#bbf7d0' : '#fecaca'}`
                              }}
                            >
                              {request.has_maintenance_history ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                        {request.has_maintenance_history && request.history_notes && (
                          <tr>
                            <td 
                              style={{
                                padding: '16px 20px',
                                fontWeight: '600',
                                color: '#6b7280',
                                backgroundColor: '#f9fafb',
                                width: '35%',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                verticalAlign: 'top'
                              }}
                            >
                              History Notes
                            </td>
                            <td 
                              style={{
                                padding: '16px 20px',
                                color: '#1f2937',
                                fontWeight: '500',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                              }}
                            >
                              <div 
                                style={{
                                  background: '#f8fafc',
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  fontStyle: 'italic'
                                }}
                              >
                                {request.history_notes}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div 
            className="modal-popup-footer"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              padding: '24px 32px',
              borderTop: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}
          >
            <button 
              className="btn-modal-secondary" 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
            >
              Close
            </button>
            <button 
              className="btn-modal-primary"
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
              }}
            >
              <span className="btn-icon">✏️</span>
              Edit Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
