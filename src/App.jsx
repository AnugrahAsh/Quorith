// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import HeroSection from './pages/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './pages/FeaturesSection';
import TestimonialsSection from './components/TestimonialSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

// A protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// A public route component (for login/signup)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
}

// Landing page layout
const LandingLayout = () => (
  <>
    <HeroSection />
    <AboutSection />
    <FeaturesSection />
    <TestimonialsSection />
    <CTASection />
    <Footer />
  </>
);

function App() {
  return (
    <div className="bg-black">
      <Routes>
        <Route path="/" element={<LandingLayout />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        {/* You can add more dashboard routes here later, e.g. /dashboard/Plansning */}
      </Routes>
    </div>
  );
}

export default App;