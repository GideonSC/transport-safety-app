import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken) {
      setAuthToken(storedToken);
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('authUser');
      }
    }

    setLoading(false);
  }, []);

  const saveAuth = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setAuthToken(authToken);
    setUser(userData);
    setToken(authToken);
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthToken(null);
    setUser(null);
    setToken(null);
  };

  const register = async (payload) => {
    setError(null);
    const response = await authService.register(payload);
    saveAuth(response.data.user, response.data.token);
    return response.data;
  };

  const login = async (credentials) => {
    setError(null);
    const response = await authService.login(credentials);
    saveAuth(response.data.user, response.data.token);
    return response.data;
  };

  const logout = () => {
    clearAuth();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
      setError,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
