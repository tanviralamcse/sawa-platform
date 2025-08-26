import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e5e7eb', marginTop: 40, background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700 }}>SAWA</span>
            <span style={{ color: '#9ca3af' }}>•</span>
            <span style={{ color: '#6b7280' }}>Connecting buyers and providers</span>
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link to="/register" style={{ color: '#374151', textDecoration: 'none' }}>Get started</Link>
            <Link to="/login" style={{ color: '#374151', textDecoration: 'none' }}>Sign in</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <p style={{ color: '#6b7280', margin: 0 }}>© {new Date().getFullYear()} SAWA. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ color: '#6b7280', textDecoration: 'none' }}>Twitter</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#6b7280', textDecoration: 'none' }}>LinkedIn</a>
            <a href="mailto:contact@example.com" aria-label="Contact" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
