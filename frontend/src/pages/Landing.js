import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container">
          <div className="landing-nav-inner">
            <Link to="/" className="nav-brand">SAWA</Link>
            <div className="landing-nav-actions">
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
              <Link to="/register" className="btn btn-primary">Get started</Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="container">
          <div className="landing-hero-inner">
            <h1>Find the right technician for every industrial service need</h1>
            <p className="subtitle">
              SAWA connects buyers with verified providers for maintenance, repairs, and installations. 
              Post requests, receive applications, and manage work in one place.
            </p>
            <div className="cta">
              <Link to="/register" className="btn btn-primary btn-lg">Create a free account</Link>
              <Link to="/login" className="btn btn-outline btn-lg">I already have an account</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Post requests fast</h3>
              <p>Describe your machine, issue, budget, and timeline in minutes.</p>
            </div>
            <div className="feature-card">
              <h3>Get qualified applications</h3>
              <p>Receive proposals from vetted providers with relevant skills.</p>
            </div>
            <div className="feature-card">
              <h3>Manage end‑to‑end</h3>
              <p>Message, track, and review work securely from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

  {/* Global footer is injected by App.js */}
    </div>
  );
}
