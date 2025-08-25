import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { buildApiUrl } from '../config/api';

const steps = [
  'Job Details',
  'Customer Details', 
  'Type of Service',
  'Maintenance History & Issue Description',
  'Maintenance Manuals & Documents',
  'Technician Requirements',
  'Safety & Training Requirements',
  'Urgency & Scheduling',
  'Budget & Payment Options',
];

export default function ServiceRequestWizard({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Job Details
    title: '',
    machine_type: '',
    serial_number: '',
    
    // Step 2: Customer Details
    customer_company_name: '',
    customer_address: '',
    contact_person_name: '',
    contact_person_position: '',
    contact_email: '',
    contact_phone: '',
    
    // Step 3: Service Types
    service_types: [],
    other_service_type: '',
    
    // Step 4: Maintenance History & Issues
    has_maintenance_history: false,
    history_notes: '',
    issue_description: '',
    
    // Step 5: Documents (handled by FileUpload)
    documents: [],
    
    // Step 6: Technician Requirements
    technician_requirements: [],
    other_requirement: '',
    
    // Step 7: Safety Requirements
    safety_requirements: [],
    
    // Step 8: Urgency & Scheduling
    urgency: '',
    preferred_date: '',
    alternative_dates: [],
    
    // Step 9: Budget & Payment
    budget_eur: '',
    payment_method: '',
    status: 'open'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Job Details
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.machine_type.trim()) newErrors.machine_type = 'Machine type is required';
        if (!formData.serial_number.trim()) newErrors.serial_number = 'Serial number is required';
        break;

      case 1: // Customer Details
        if (!formData.customer_company_name.trim()) newErrors.customer_company_name = 'Company name is required';
        if (!formData.customer_address.trim()) newErrors.customer_address = 'Address is required';
        if (!formData.contact_person_name.trim()) newErrors.contact_person_name = 'Contact person is required';
        if (!formData.contact_email.trim()) newErrors.contact_email = 'Email is required';
        if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Phone is required';
        if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
          newErrors.contact_email = 'Valid email is required';
        }
        break;

      case 2: // Service Types
        if (formData.service_types.length === 0) newErrors.service_types = 'At least one service type is required';
        break;

      case 3: // Maintenance History & Issues
        if (!formData.issue_description.trim()) newErrors.issue_description = 'Issue description is required';
        break;

      case 7: // Urgency & Scheduling
        if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
        if (!formData.preferred_date) newErrors.preferred_date = 'Preferred date is required';
        break;

      case 8: // Budget & Payment
        if (!formData.budget_eur || formData.budget_eur <= 0) newErrors.budget_eur = 'Valid budget is required';
        if (!formData.payment_method) newErrors.payment_method = 'Payment method is required';
        break;
      
      default:
        // No validation needed for other steps
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Clean and format the data for the backend
      const submitData = {
        title: formData.title,
        machine_type: formData.machine_type,
        serial_number: formData.serial_number,
        customer_company_name: formData.customer_company_name,
        customer_address: formData.customer_address,
        contact_person_name: formData.contact_person_name,
        contact_person_position: formData.contact_person_position || '',
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        service_types: formData.service_types || [],
        has_maintenance_history: formData.has_maintenance_history,
        history_notes: formData.history_notes || '',
        issue_description: formData.issue_description,
        technician_requirements: formData.technician_requirements || [],
        safety_requirements: formData.safety_requirements || [],
        urgency: formData.urgency,
        preferred_date: formData.preferred_date,
        alternative_dates: Array.isArray(formData.alternative_dates) ? formData.alternative_dates : [],
        budget_eur: parseFloat(formData.budget_eur),
        payment_method: formData.payment_method,
        status: 'open'
      };

      // Add other_service_type to service_types if provided
      if (formData.other_service_type && formData.other_service_type.trim()) {
        submitData.service_types.push(formData.other_service_type.trim());
      }

      // Add other_requirement to technician_requirements if provided
      if (formData.other_requirement && formData.other_requirement.trim()) {
        submitData.technician_requirements.push(formData.other_requirement.trim());
      }

      console.log('Submitting data:', submitData); // Debug log

      const response = await fetch(buildApiUrl('service-requests/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onComplete && onComplete();
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData); // Debug log
        setErrors(errorData);
      }
    } catch (error) {
      console.error('Failed to create service request:', error);
      setErrors({ general: 'Failed to create service request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Job Details
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter job title"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Machine Type *</label>
              <input
                type="text"
                className="form-input"
                value={formData.machine_type}
                onChange={(e) => updateFormData('machine_type', e.target.value)}
                placeholder="e.g., CNC Machine, Hydraulic Press"
              />
              {errors.machine_type && <span className="error-text">{errors.machine_type}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Serial Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.serial_number}
                onChange={(e) => updateFormData('serial_number', e.target.value)}
                placeholder="Enter machine serial number"
              />
              {errors.serial_number && <span className="error-text">{errors.serial_number}</span>}
            </div>
          </div>
        );

      case 1: // Customer Details
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Customer Company Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.customer_company_name}
                onChange={(e) => updateFormData('customer_company_name', e.target.value)}
                placeholder="Enter company name"
              />
              {errors.customer_company_name && <span className="error-text">{errors.customer_company_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Customer Address *</label>
              <textarea
                className="form-textarea"
                value={formData.customer_address}
                onChange={(e) => updateFormData('customer_address', e.target.value)}
                placeholder="Enter full address"
              />
              {errors.customer_address && <span className="error-text">{errors.customer_address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.contact_person_name}
                onChange={(e) => updateFormData('contact_person_name', e.target.value)}
                placeholder="Enter contact person name"
              />
              {errors.contact_person_name && <span className="error-text">{errors.contact_person_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Position</label>
              <input
                type="text"
                className="form-input"
                value={formData.contact_person_position}
                onChange={(e) => updateFormData('contact_person_position', e.target.value)}
                placeholder="e.g., Maintenance Manager"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.contact_email}
                onChange={(e) => updateFormData('contact_email', e.target.value)}
                placeholder="Enter email address"
              />
              {errors.contact_email && <span className="error-text">{errors.contact_email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.contact_phone}
                onChange={(e) => updateFormData('contact_phone', e.target.value)}
                placeholder="Enter phone number"
              />
              {errors.contact_phone && <span className="error-text">{errors.contact_phone}</span>}
            </div>
          </div>
        );

      case 2: // Type of Service
        const serviceOptions = ['Maintenance', 'Repair', 'Inspection', 'Installation', 'Training & Education'];
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">What type of service do you need? *</label>
              <div className="checkbox-group">
                {serviceOptions.map(option => (
                  <div key={option} className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={formData.service_types.includes(option)}
                      onChange={(e) => handleArrayChange('service_types', option, e.target.checked)}
                    />
                    <label className="checkbox-label">{option}</label>
                  </div>
                ))}
              </div>
              {errors.service_types && <span className="error-text">{errors.service_types}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Other (please specify)</label>
              <input
                type="text"
                className="form-input"
                value={formData.other_service_type}
                onChange={(e) => updateFormData('other_service_type', e.target.value)}
                placeholder="Type here..."
              />
            </div>
          </div>
        );

      case 3: // Maintenance History & Issue Description
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Is there a maintenance history for this machine?</label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    className="radio-input"
                    checked={formData.has_maintenance_history === true}
                    onChange={() => updateFormData('has_maintenance_history', true)}
                  />
                  <label className="radio-label">Yes</label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    className="radio-input"
                    checked={formData.has_maintenance_history === false}
                    onChange={() => updateFormData('has_maintenance_history', false)}
                  />
                  <label className="radio-label">No</label>
                </div>
              </div>
            </div>

            {formData.has_maintenance_history && (
              <div className="form-group">
                <label className="form-label">Maintenance History Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.history_notes}
                  onChange={(e) => updateFormData('history_notes', e.target.value)}
                  placeholder="Describe the maintenance history..."
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Issue Description or Previous Actions Taken *</label>
              <textarea
                className="form-textarea"
                value={formData.issue_description}
                onChange={(e) => updateFormData('issue_description', e.target.value)}
                placeholder="Describe the issue or previous actions taken..."
                rows="5"
              />
              {errors.issue_description && <span className="error-text">{errors.issue_description}</span>}
            </div>
          </div>
        );

      case 4: // Maintenance Manuals & Documents
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Important documents for the service technician</label>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '16px' }}>
                Upload maintenance manuals, technical documents, spare parts lists, circuit diagrams, and checklists.
              </p>
              <FileUpload 
                onFilesChange={(files) => updateFormData('documents', files)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={true}
              />
            </div>
          </div>
        );

      case 5: // Technician Requirements
        const techRequirements = ['PLC (Siemens, Beckhoff, etc)', 'Hydraulics', 'CNC', 'Robotics', 'Pneumatics'];
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">What qualifications should the technician have?</label>
              <div className="checkbox-group">
                {techRequirements.map(req => (
                  <div key={req} className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={formData.technician_requirements.includes(req)}
                      onChange={(e) => handleArrayChange('technician_requirements', req, e.target.checked)}
                    />
                    <label className="checkbox-label">{req}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Other Requirements</label>
              <input
                type="text"
                className="form-input"
                value={formData.other_requirement}
                onChange={(e) => updateFormData('other_requirement', e.target.value)}
                placeholder="Type here..."
              />
            </div>
          </div>
        );

      case 6: // Safety & Training Requirements
        const safetyRequirements = ['Safety Certificate', 'Occupational Safety Training', 'First Aid Course'];
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Are special safety requirements necessary?</label>
              <div className="checkbox-group">
                {safetyRequirements.map(req => (
                  <div key={req} className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={formData.safety_requirements.includes(req)}
                      onChange={(e) => handleArrayChange('safety_requirements', req, e.target.checked)}
                    />
                    <label className="checkbox-label">{req}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7: // Urgency & Scheduling
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Urgency Level *</label>
              <div className="radio-group">
                {['High (Immediate)', 'Medium (Within 3 Days)', 'Normal (Within a Week)'].map(level => (
                  <div key={level} className="radio-item">
                    <input
                      type="radio"
                      className="radio-input"
                      checked={formData.urgency === level}
                      onChange={() => updateFormData('urgency', level)}
                    />
                    <label className="radio-label">{level}</label>
                  </div>
                ))}
              </div>
              {errors.urgency && <span className="error-text">{errors.urgency}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.preferred_date}
                onChange={(e) => updateFormData('preferred_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.preferred_date && <span className="error-text">{errors.preferred_date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Alternative Dates</label>
              <textarea
                className="form-textarea"
                value={formData.alternative_dates.join('\n')}
                onChange={(e) => updateFormData('alternative_dates', e.target.value.split('\n').filter(d => d.trim()))}
                placeholder="Enter alternative dates (one per line)"
                rows="3"
              />
            </div>
          </div>
        );

      case 8: // Budget & Payment Options
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Budget for the Service (EUR) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.budget_eur}
                onChange={(e) => updateFormData('budget_eur', parseFloat(e.target.value))}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
              {errors.budget_eur && <span className="error-text">{errors.budget_eur}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select
                className="form-select"
                value={formData.payment_method}
                onChange={(e) => updateFormData('payment_method', e.target.value)}
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="invoice">Invoice</option>
                <option value="cash">Cash</option>
              </select>
              {errors.payment_method && <span className="error-text">{errors.payment_method}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="service-request-wizard">
      {/* Progress Steps */}
      <div className="progress-container">
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? (index === currentStep ? 'active' : 'completed') : ''}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <h2 className="step-title">{steps[currentStep]}</h2>
      </div>

      {/* Form Content */}
      <div className="form-container">
        {errors.general && (
          <div className="error-message mb-3" style={{ color: '#e53e3e', fontSize: '0.875rem' }}>
            {errors.general}
          </div>
        )}

        {renderStep()}

        {/* Navigation Buttons */}
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <div>
            {currentStep > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={prevStep}
              >
                ← Back
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={nextStep}
              >
                Next →
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
