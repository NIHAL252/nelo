import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={() => setLoginSuccess(!loginSuccess)} />;
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
