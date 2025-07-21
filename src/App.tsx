import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TradingProvider } from './contexts/TradingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MasterAccounts from './pages/MasterAccounts';
import FollowerAccounts from './pages/FollowerAccounts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './index.css';

// Component to wrap TradingProvider with user ID
const TradingProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return <TradingProvider userId={user?.id}>{children}</TradingProvider>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TradingProviderWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/master-accounts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MasterAccounts />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/follower-accounts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FollowerAccounts />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TradingProviderWrapper>
      </AuthProvider>
    </Router>
  );
};

export default App;