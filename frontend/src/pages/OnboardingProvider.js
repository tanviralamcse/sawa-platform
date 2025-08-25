import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import FileUpload from '../components/FileUpload';
import { buildApiUrl } from '../config/api';

export default function OnboardingProvider() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    phone: '',
    location: '',
    bio: '',
    
    // Professional Information
    skills: [],
    experience: '',
    education: '',
    certifications: [],
    
    // Service Information
    serviceCategories: [],
    hourlyRate: '',
    availability: 'full-time',
    languages: [],
    
    // Portfolio & Documents
    portfolioItems: [],
    documents: [],
    
    // Additional Information
    workStyle: '',
    tools: [],
    previousClients: ''
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;

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
      const response = await fetch(buildApiUrl('providers/profile/'), {
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
      {[1, 2, 3, 4, 5].map(step => (
        <div 
          key={step} 
          className={`step ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
        >
          <div className="step-number">{step}</div>
          <div className="step-title">
            {step === 1 && 'Personal Info'}
            {step === 2 && 'Professional Background'}
            {step === 3 && 'Services & Rates'}
            {step === 4 && 'Portfolio & Documents'}
            {step === 5 && 'Final Details'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1>Welcome to SAWA, {user?.first_name}!</h1>
        <p>Let's set up your provider profile to showcase your skills and attract great clients.</p>
        <StepIndicator />
      </div>

      <div className="onboarding-content">
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Personal Information</h2>
            <p>Tell us about yourself so clients can get to know you better.</p>
            
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
                <label htmlFor="bio">Professional Bio</label>
                <textarea
                  id="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Write a compelling bio that highlights your expertise, experience, and what makes you unique. This will be the first thing clients see on your profile."
                />
                <small>This is your elevator pitch - make it count!</small>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h2>Professional Background</h2>
            <p>Share your skills, experience, and qualifications.</p>
            
            <div className="form-section">
              <div className="form-group">
                <label>Skills & Expertise</label>
                <div className="skills-input">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('skills', e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="skills-list">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button 
                          type="button"
                          onClick={() => removeFromArray('skills', skill)}
                          className="skill-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <small>Add your main skills and areas of expertise</small>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Professional Experience</label>
                <textarea
                  id="experience"
                  rows={5}
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  placeholder="Describe your relevant work experience, key projects, and achievements. Include years of experience, types of clients you've worked with, and notable accomplishments."
                />
              </div>

              <div className="form-group">
                <label htmlFor="education">Education</label>
                <textarea
                  id="education"
                  rows={3}
                  value={formData.education}
                  onChange={(e) => updateFormData('education', e.target.value)}
                  placeholder="Your educational background, degrees, relevant courses, etc."
                />
              </div>

              <div className="form-group">
                <label>Certifications & Awards</label>
                <div className="certifications-input">
                  <input
                    type="text"
                    placeholder="Add a certification and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('certifications', e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="certifications-list">
                    {formData.certifications.map((cert, index) => (
                      <span key={index} className="cert-tag">
                        {cert}
                        <button 
                          type="button"
                          onClick={() => removeFromArray('certifications', cert)}
                          className="cert-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h2>Services & Rates</h2>
            <p>Define the services you offer and your pricing.</p>
            
            <div className="form-section">
              <div className="form-group">
                <label>Service Categories</label>
                <div className="service-categories-grid">
                  {[
                    'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
                    'Digital Marketing', 'Content Writing', 'Copywriting', 'SEO',
                    'Data Analysis', 'Business Consulting', 'Project Management', 'Virtual Assistant',
                    'Translation', 'Video Production', 'Photography', 'Audio Production',
                    'Accounting', 'Legal Services', 'IT Support', 'Other'
                  ].map(category => (
                    <label key={category} className="checkbox-label service-category">
                      <input
                        type="checkbox"
                        checked={formData.serviceCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addToArray('serviceCategories', category);
                          } else {
                            removeFromArray('serviceCategories', category);
                          }
                        }}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hourlyRate">Hourly Rate (USD)</label>
                  <div className="rate-input">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={(e) => updateFormData('hourlyRate', e.target.value)}
                      placeholder="50"
                      min="5"
                      step="5"
                    />
                    <span className="per-hour">/hour</span>
                  </div>
                  <small>Set a competitive rate based on your experience and market standards</small>
                </div>
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => updateFormData('availability', e.target.value)}
                  >
                    <option value="full-time">Full Time (40+ hrs/week)</option>
                    <option value="part-time">Part Time (20-40 hrs/week)</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="project-based">Project Based</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Languages</label>
                <div className="languages-input">
                  <input
                    type="text"
                    placeholder="Add a language and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('languages', e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="languages-list">
                    {formData.languages.map((language, index) => (
                      <span key={index} className="language-tag">
                        {language}
                        <button 
                          type="button"
                          onClick={() => removeFromArray('languages', language)}
                          className="language-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <small>Include proficiency level (e.g., "English - Native", "Spanish - Fluent")</small>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <h2>Portfolio & Documents</h2>
            <p>Showcase your work and upload relevant documents.</p>
            
            <div className="form-section">
              <div className="form-group">
                <label>Portfolio Samples</label>
                <FileUpload
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx']}
                  maxFiles={10}
                  onFilesChange={(files) => updateFormData('portfolioItems', files)}
                  description="Upload images, PDFs, or documents that showcase your best work"
                />
                <small>Tip: Upload 3-5 of your best work samples that represent different types of projects</small>
              </div>

              <div className="form-group">
                <label>Professional Documents</label>
                <FileUpload
                  acceptedTypes={['.pdf', '.doc', '.docx']}
                  maxFiles={5}
                  onFilesChange={(files) => updateFormData('documents', files)}
                  description="Upload your resume, certifications, or other professional documents"
                />
                <small>Optional: Resume, certificates, testimonials, etc.</small>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="step-content">
            <h2>Final Details</h2>
            <p>Last step! Tell us about your work style and approach.</p>
            
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="workStyle">Work Style & Approach</label>
                <textarea
                  id="workStyle"
                  rows={4}
                  value={formData.workStyle}
                  onChange={(e) => updateFormData('workStyle', e.target.value)}
                  placeholder="Describe your work style, communication approach, and how you ensure client satisfaction. What makes working with you a great experience?"
                />
              </div>

              <div className="form-group">
                <label>Tools & Software You Use</label>
                <div className="tools-input">
                  <input
                    type="text"
                    placeholder="Add a tool/software and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('tools', e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="tools-list">
                    {formData.tools.map((tool, index) => (
                      <span key={index} className="tool-tag">
                        {tool}
                        <button 
                          type="button"
                          onClick={() => removeFromArray('tools', tool)}
                          className="tool-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <small>List the main tools, software, and technologies you use in your work</small>
              </div>

              <div className="form-group">
                <label htmlFor="previousClients">Previous Client Experience</label>
                <textarea
                  id="previousClients"
                  rows={4}
                  value={formData.previousClients}
                  onChange={(e) => updateFormData('previousClients', e.target.value)}
                  placeholder="Share any relevant experience working with clients. What types of businesses have you worked with? What were the outcomes?"
                />
              </div>
            </div>

            <div className="completion-summary">
              <h3>🎉 You're ready to start!</h3>
              <p>Once you complete your profile, you'll be able to:</p>
              <ul>
                <li>✅ Browse and apply to service requests</li>
                <li>✅ Showcase your portfolio to potential clients</li>
                <li>✅ Communicate directly with clients</li>
                <li>✅ Build your reputation through reviews</li>
                <li>✅ Grow your business on our platform</li>
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
