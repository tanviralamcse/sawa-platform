import React, { useState, useEffect } from 'react';

export default function ApplicationModal({ request, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    pitch: '',
    price_adjustment_eur: '',
    available_on_preferred_date: true,
    suggested_date: '',
    comments: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        pitch: '',
        price_adjustment_eur: '',
        available_on_preferred_date: true,
        suggested_date: '',
        comments: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pitch.trim()) {
      newErrors.pitch = 'Please provide a pitch for why you should be selected';
    }
    
    if (formData.price_adjustment_eur && isNaN(parseFloat(formData.price_adjustment_eur))) {
      newErrors.price_adjustment_eur = 'Please enter a valid number';
    }
    
    if (!formData.available_on_preferred_date && !formData.suggested_date) {
      newErrors.suggested_date = 'Please provide an alternative date if not available on preferred date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const applicationData = {
        ...formData,
        request: request.id,
        status: 'pending'
      };
      
      // Convert empty string to null for optional numeric field
      if (!applicationData.price_adjustment_eur) {
        applicationData.price_adjustment_eur = null;
      } else {
        applicationData.price_adjustment_eur = parseFloat(applicationData.price_adjustment_eur);
      }
      
      // Convert empty string to null for optional date field
      if (!applicationData.suggested_date) {
        applicationData.suggested_date = null;
      }
      
      await onSubmit(applicationData);
      onClose();
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen || !request) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop"
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
        className="modal-popup-container"
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
            maxWidth: '700px',
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
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '32px 32px 24px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}
          >
            <div style={{ flex: 1, marginRight: '20px' }}>
              <h2 
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#1e40af',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}
              >
                Apply for Project
              </h2>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                {request.title} • {formatCurrency(request.budget_eur)}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '32px'
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Pitch Section */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Your Pitch *
                </label>
                <textarea
                  name="pitch"
                  value={formData.pitch}
                  onChange={handleInputChange}
                  placeholder="Explain why you're the best choice for this project. Include your relevant experience, approach, and what makes you stand out..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    border: `2px solid ${errors.pitch ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.pitch ? '#ef4444' : '#e5e7eb'}
                />
                {errors.pitch && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    {errors.pitch}
                  </p>
                )}
              </div>

              {/* Price Adjustment */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Price Adjustment (EUR)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="price_adjustment_eur"
                    value={formData.price_adjustment_eur}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 40px',
                      border: `2px solid ${errors.price_adjustment_eur ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = errors.price_adjustment_eur ? '#ef4444' : '#e5e7eb'}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontWeight: '600'
                    }}
                  >
                    €
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Positive for increase, negative for discount. Leave empty to keep original budget.
                </p>
                {errors.price_adjustment_eur && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    {errors.price_adjustment_eur}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="available_on_preferred_date"
                    checked={formData.available_on_preferred_date}
                    onChange={handleInputChange}
                    style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                    I'm available on the preferred date ({new Date(request.preferred_date).toLocaleDateString()})
                  </span>
                </label>
              </div>

              {/* Alternative Date */}
              {!formData.available_on_preferred_date && (
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}
                  >
                    Suggested Alternative Date *
                  </label>
                  <input
                    type="date"
                    name="suggested_date"
                    value={formData.suggested_date}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: `2px solid ${errors.suggested_date ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = errors.suggested_date ? '#ef4444' : '#e5e7eb'}
                  />
                  {errors.suggested_date && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      {errors.suggested_date}
                    </p>
                  )}
                </div>
              )}

              {/* Additional Comments */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Any additional information, questions, or special considerations..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div 
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
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: isSubmitting 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
              }}
            >
              {isSubmitting ? (
                <>
                  <span>⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  <span>📝</span>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
