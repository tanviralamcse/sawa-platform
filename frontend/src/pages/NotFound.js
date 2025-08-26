import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '60px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-outline">Go to Home</Link>
    </div>
  );
}
