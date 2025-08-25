import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';
import NotificationBell from './components/NotificationBell';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            <Link to="/" className="nav-brand">SAWA</Link>
            
            <ul className="nav-links">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') || isActive('/') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/requests" 
                  className={`nav-link ${isActive('/requests') ? 'active' : ''}`}
                >
                  {user?.role === 'buyer' ? 'My Requests' : 'Available Requests'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/applications" 
                  className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link 
                  to="/messages" 
                  className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link 
                  to="/reviews" 
                  className={`nav-link ${isActive('/reviews') ? 'active' : ''}`}
                >
                  Reviews
                </Link>
              </li>
              <li>
                <NotificationBell />
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
                >
                  Settings
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container" style={{ paddingTop: '20px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
