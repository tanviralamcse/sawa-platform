import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import AppShell from './AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OnboardingBuyer from './pages/OnboardingBuyer';
import OnboardingProvider from './pages/OnboardingProvider';
import Requests from './pages/Requests';
import Applications from './pages/Applications';
import Messages from './pages/Messages';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import './App.css';
import './sawa.css';
import './pages/Landing.css';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('ProtectedRoute check:', { isAuthenticated, loading });
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
  <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated app */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="onboarding/buyer" element={<OnboardingBuyer />} />
              <Route path="onboarding/provider" element={<OnboardingProvider />} />
              <Route path="requests" element={<Requests />} />
              <Route path="requests/new" element={<Requests showNewForm={true} />} />
              <Route path="applications" element={<Applications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
