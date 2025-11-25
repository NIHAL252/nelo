import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// JWT simulation utility
const generateJWT = (email) => {
  // Simulate JWT format: header.payload.signature
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hour expiry
    email: email,
  }));
  const signature = btoa('signature-secret-key');
  return `${header}.${payload}.${signature}`;
};

const verifyJWT = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return null; // Token expired
    }
    
    return payload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Check if user is already logged in (from sessionStorage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        const verified = verifyJWT(storedToken);
        
        if (verified) {
          setUser(userData);
          setToken(storedToken);
          const expiryTime = new Date(verified.exp * 1000);
          setSessionExpiry(expiryTime);
        } else {
          // Token expired, clear storage
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  // Monitor session expiry
  useEffect(() => {
    if (!token) return;
    
    const checkExpiry = setInterval(() => {
      const verified = verifyJWT(token);
      if (!verified) {
        console.warn('Session expired');
        logout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkExpiry);
  }, [token]);

  const login = (email, password) => {
    // Simple validation - in production, you'd validate against a backend
    if (email && password && email.includes('@')) {
      const jwtToken = generateJWT(email);
      const userData = {
        email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substr(2, 9), // Unique session ID
      };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('authToken', jwtToken);
      
      setUser(userData);
      setToken(jwtToken);
      
      // Set session expiry to 24 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      setSessionExpiry(expiry);
      
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    setSessionExpiry(null);
  };

  const isSessionActive = () => {
    if (!token) return false;
    return verifyJWT(token) !== null;
  };

  const getSessionInfo = () => {
    if (!user || !sessionExpiry) return null;
    
    const now = new Date();
    const timeRemaining = sessionExpiry - now;
    
    return {
      user: user.email,
      sessionId: user.sessionId,
      loginTime: user.loginTime,
      expiryTime: sessionExpiry.toISOString(),
      timeRemainingMs: Math.max(0, timeRemaining),
      timeRemainingMinutes: Math.max(0, Math.floor(timeRemaining / 60000)),
      isExpired: timeRemaining <= 0,
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      token,
      sessionExpiry,
      login,
      logout,
      isSessionActive,
      getSessionInfo,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
