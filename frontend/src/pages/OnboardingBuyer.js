import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { buildApiUrl } from '../config/api';

export default function OnboardingBuyer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    phone: '',
    location: '',
    bio: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    industry: '',
    teamSize: '',
    
    // Service Preferences
    serviceTypes: [],
    budget: '',
    timeframe: '',
    communicationPreferences: [],
    
    // Additional Details
    previousExperience: '',
    expectations: ''
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl('buyers/profile/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const error = await response.json();
        console.error('Onboarding failed:', error);
        alert('Failed to complete onboarding. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map(step => (
        <div 
          key={step} 
          className={`step ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
        >
          <div className="step-number">{step}</div>
          <div className="step-title">
            {step === 1 && 'Personal Info'}
            {step === 2 && 'Business Details'}
            {step === 3 && 'Service Preferences'}
            {step === 4 && 'Final Details'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1>Welcome to SAWA, {user?.first_name}!</h1>
        <p>Let's set up your buyer profile to help you find the best service providers.</p>
        <StepIndicator />
      </div>

      <div className="onboarding-content">
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Personal Information</h2>
            <p>Tell us a bit about yourself so providers can get to know you better.</p>
            
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="City, State/Province, Country"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">About You</label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Tell providers about yourself, your work style, and what makes you a great client to work with..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h2>Business Information</h2>
            <p>Help providers understand your business context and needs.</p>
            
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName">Business/Organization Name</label>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    placeholder="Your company or organization name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="businessType">Business Type</label>
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => updateFormData('businessType', e.target.value)}
                  >
                    <option value="">Select business type</option>
                    <option value="startup">Startup</option>
                    <option value="small-business">Small Business</option>
                    <option value="medium-business">Medium Business</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => updateFormData('industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="teamSize">Team Size</label>
                  <select
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={(e) => updateFormData('teamSize', e.target.value)}
                  >
                    <option value="">Select team size</option>
                    <option value="1">Just me</option>
                    <option value="2-10">2-10 people</option>
                    <option value="11-50">11-50 people</option>
                    <option value="51-200">51-200 people</option>
                    <option value="200+">200+ people</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h2>Service Preferences</h2>
            <p>What types of services are you typically looking for?</p>
            
            <div className="form-section">
              <div className="form-group">
                <label>Service Types You Need</label>
                <div className="service-types-grid">
                  {[
                    'Web Development', 'Mobile Development', 'Design & UI/UX', 
                    'Digital Marketing', 'Content Writing', 'Data Analysis',
                    'Consulting', 'Project Management', 'Virtual Assistant',
                    'Translation', 'Video Production', 'Other'
                  ].map(service => (
                    <label key={service} className="checkbox-label service-type">
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addToArray('serviceTypes', service);
                          } else {
                            removeFromArray('serviceTypes', service);
                          }
                        }}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budget">Typical Project Budget Range</label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-500">Under $500</option>
                    <option value="500-2000">$500 - $2,000</option>
                    <option value="2000-5000">$2,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="timeframe">Typical Project Timeframe</label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => updateFormData('timeframe', e.target.value)}
                  >
                    <option value="">Select timeframe</option>
                    <option value="urgent">Urgent (1-2 weeks)</option>
                    <option value="fast">Fast (1 month)</option>
                    <option value="normal">Normal (2-3 months)</option>
                    <option value="flexible">Flexible (3+ months)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Communication Methods</label>
                <div className="communication-preferences">
                  {['Email', 'Phone', 'Video Calls', 'Instant Messaging', 'Project Management Tools'].map(method => (
                    <label key={method} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.communicationPreferences.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addToArray('communicationPreferences', method);
                          } else {
                            removeFromArray('communicationPreferences', method);
                          }
                        }}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <h2>Final Details</h2>
            <p>Last step! Tell us about your experience and expectations.</p>
            
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="previousExperience">Previous Experience with Service Providers</label>
                <textarea
                  id="previousExperience"
                  rows={4}
                  value={formData.previousExperience}
                  onChange={(e) => updateFormData('previousExperience', e.target.value)}
                  placeholder="Tell us about your experience working with freelancers or service providers. What worked well? What didn't?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expectations">What are your main expectations from SAWA?</label>
                <textarea
                  id="expectations"
                  rows={4}
                  value={formData.expectations}
                  onChange={(e) => updateFormData('expectations', e.target.value)}
                  placeholder="What do you hope to achieve using our platform? What would make this a successful experience for you?"
                />
              </div>
            </div>

            <div className="completion-summary">
              <h3>🎉 You're almost ready!</h3>
              <p>Once you complete your profile, you'll be able to:</p>
              <ul>
                <li>✅ Post service requests</li>
                <li>✅ Browse and connect with qualified providers</li>
                <li>✅ Manage your projects efficiently</li>
                <li>✅ Build your reputation through reviews</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="onboarding-actions">
        {currentStep > 1 && (
          <button 
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={loading}
          >
            Previous
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button 
            className="btn-primary"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Completing Setup...' : 'Complete Setup'}
          </button>
        )}
      </div>
    </div>
  );
}
