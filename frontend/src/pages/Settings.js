import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { buildApiUrl } from '../config/api';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: [],
    experience: '',
    hourlyRate: '',
    availability: 'full-time'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newApplications: true,
    messageNotifications: true,
    reviewNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const profileType = user?.role === 'buyer' ? 'buyers' : 'providers';
      const response = await fetch(buildApiUrl(`${profileType}/profile/`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          firstName: data.user?.first_name || '',
          lastName: data.user?.last_name || '',
          email: data.user?.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          skills: data.skills || [],
          experience: data.experience || '',
          hourlyRate: data.hourly_rate || '',
          availability: data.availability || 'full-time'
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [user]);
  
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      const profileType = user?.role === 'buyer' ? 'buyers' : 'providers';
      
      const response = await fetch(buildApiUrl(`${profileType}/profile/`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email,
          },
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          skills: profileData.skills,
          experience: profileData.experience,
          hourly_rate: profileData.hourlyRate,
          availability: profileData.availability
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        const error = await response.json();
        setError(error.detail || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl('auth/change-password/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        setError(error.detail || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const TabButton = ({ id, title, isActive, onClick }) => (
    <button 
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      {title}
    </button>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <TabButton 
              id="profile" 
              title="Profile" 
              isActive={activeTab === 'profile'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="password" 
              title="Password" 
              isActive={activeTab === 'password'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="notifications" 
              title="Notifications" 
              isActive={activeTab === 'notifications'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="privacy" 
              title="Privacy" 
              isActive={activeTab === 'privacy'} 
              onClick={setActiveTab} 
            />
          </nav>
        </div>

        <div className="settings-main">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself..."
                  />
                </div>

                {user?.role === 'provider' && (
                  <>
                    <div className="form-group">
                      <label>Skills</label>
                      <div className="skills-input">
                        <input
                          type="text"
                          placeholder="Add a skill and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSkillAdd(e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                        <div className="skills-list">
                          {profileData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                              <button 
                                type="button"
                                onClick={() => handleSkillRemove(skill)}
                                className="skill-remove"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                        <input
                          type="number"
                          id="hourlyRate"
                          value={profileData.hourlyRate}
                          onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="availability">Availability</label>
                        <select
                          id="availability"
                          value={profileData.availability}
                          onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
                        >
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="weekends">Weekends Only</option>
                          <option value="project-based">Project Based</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="experience">Experience</label>
                      <textarea
                        id="experience"
                        rows={4}
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="Describe your relevant experience..."
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-content">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content">
              <h2>Notification Preferences</h2>
              <div className="notification-settings">
                <div className="setting-group">
                  <h3>Delivery Methods</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    />
                    Email Notifications
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    />
                    SMS Notifications
                  </label>
                </div>

                <div className="setting-group">
                  <h3>Notification Types</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newApplications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, newApplications: e.target.checked }))}
                    />
                    New Applications
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.messageNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, messageNotifications: e.target.checked }))}
                    />
                    New Messages
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.reviewNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, reviewNotifications: e.target.checked }))}
                    />
                    New Reviews
                  </label>
                </div>

                <button className="btn-primary">Save Notification Settings</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="tab-content">
              <h2>Privacy & Account</h2>
              <div className="privacy-settings">
                <div className="setting-section">
                  <h3>Profile Visibility</h3>
                  <p>Control who can see your profile information.</p>
                  <button className="btn-secondary">Manage Privacy Settings</button>
                </div>

                <div className="setting-section">
                  <h3>Data Export</h3>
                  <p>Download a copy of your data.</p>
                  <button className="btn-secondary">Export Data</button>
                </div>

                <div className="setting-section danger-zone">
                  <h3>Danger Zone</h3>
                  <p>These actions cannot be undone.</p>
                  <div className="danger-actions">
                    <button className="btn-danger" onClick={logout}>
                      Log Out
                    </button>
                    <button className="btn-danger">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
