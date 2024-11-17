import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginPage from './GoogleLoginPage';
import AudienceCreation from './AudienceCreation';
import CampaignHistory from './CampaignHistory';
import Groups from './Groups';
import { Navigate } from "react-router-dom";

const clientId = '386765794934-ct357o7ho41nfp4kmimk1v60u85vmrp8.apps.googleusercontent.com';

const RequireAuth = ({ children }) => {
  // Check if the token exists in localStorage
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<GoogleLoginPage />} />
          <Route path="/" element={<RequireAuth><AudienceCreation /></RequireAuth>} />
          <Route path="/campaigns" element={<RequireAuth><CampaignHistory /></RequireAuth>} />
          <Route path="/group" element={<RequireAuth><Groups /></RequireAuth>} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
